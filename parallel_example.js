https://github.com/bigeasy/strata/blob/master/index.js#L901

function readLeaf (page, callback) {
  // When we read backwards, we create a list of of the insert and delete
  // objects in the splices array. When we have found a positions array, we
  // stop going backwards.
  var splices   = []
    // Note that if we don't find a position array that has been written to
    // the leaf page file, then we'll start with an empty position array.
    , positions = []
    // Temporary cache of records read while searching for position array
    // object.
    , cache     = {}
    , line      = ""
    , buffer    = new Buffer(1024)
    , end
    , eol
    , start
    , read
    , fd
    , page
    , check = validator(callback);
    ;

  // We don't cache file descriptors after the leaf page file read. We will
  // close the file descriptors before the function returns.
  fs.open(filename(page.address), "r+", check(opened));

  function opened ($1) {
    fs.fstat(fd = $1, check(stat));
  }

  function stat (stat) {
    end = stat.size, eol = stat.size
    input();
  }

  //
  function input () {
    if (end) {
      end = eol;
      start = end - buffer.length;
      if (start < 0) start = 0;
      fs.read(fd, buffer, 0, buffer.length, start, check(iterate));
    } else {
      replay();
    }
  }

  function iterate (read) {
    var eos, entry, index, position;
    end -= read
    if (buffer[--read] != 0x0A) {
      throw new Error("corrupt leaves: no newline at end of file");
    }
    eos = read;
    while (read != 0) {
      read = read - 1
      if (buffer[read] == 0x0A || start == 0 && read == 0) {
        entry = readLine(buffer.toString("utf8", read, eos));
        eos   = read;
        index = entry.shift();
        if (index == 0) {
          entry.shift(); // leaf page file format version
          page.right = entry.shift();
          page.ghosts = entry.shift();
          page.entries = entry.shift();
          positions = entry.shift();
          end = 0;
          break;
        } else {
          position = start + read + 1;
          if (index > 0) {
            cache[position] = entry.pop();
          }
          splices.push([ index, position, entry.pop() ]);
        }
      }
    }
    eol = start + eos
    input();
  }

  function replay() {
    // Prime our page with the positions array read from the leaf file, or else
    // an empty positions array.
    splice(page, 0, 0, positions);

    // Now we replay the inserts and deletes described by the insert and delete
    // objects that we've gathered up in our splices array.
    splices.reverse()
    splices.forEach(function ($) {
      var index = $[0], position = $[1], entry = $[2];
      if (entry != ++page.entries) {
        throw new Error("leaf corrupt: incorrect entry position");
      }
      if (index > 0) {
        splice(page, index - 1, 0, position);
      } else if (~index == 0 && page.address != -1) {
        if (page.ghosts) throw new Error("double ghosts");
        page.ghosts++
      } else {
        splice(page, -(index + 1), 1);
      }
    });

    // Cache the records we read while searching for the position array object.
    page.positions.forEach(function (position) {
      if (cache[position]) {
        cacheRecord(page, position, cache[position]);
      }
    });

    // Close the file descriptor.
    fs.close(fd, closed);
  }

  // Return the loaded page.
  function closed () {
    callback(null, page);
  }
}

