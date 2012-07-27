how to organize js code
-----------------------

how to get from this mess

```javascript
var form = document.querySelector('form')
form.onsubmit = function(submitEvent) {
  var name = document.querySelector('input').value
  request({
    uri: "http://example.com/upload",
    body: name,
    method: "POST"
  }, function(err, response, body) {
    var statusMessage = document.querySelector('.status')
    if (err) return statusMessage.value = err
    statusMessage.value = body
  })
}
```

to this

```javascript
document.querySelector('form').onsubmit = formUploader.submit
```

(example taken from [callbackhell.com](http://callbackhell.com/))

* naming your anonymous functions
* get rid of nesting
* spliting into separete files using CommonJS with [browserify](https://github.com/substack/node-browserify#readme)
* minify with [uglify-js](https://github.com/mishoo/UglifyJS/)
* using the 'scripts' section in package.json
* using makefile
* using [grunt](https://github.com/cowboy/grunt)


helpful commands
----------------

using browserify

    ./node_modules/browserify/bin/cmd.js hello2.js -o bundle.js

using uglify-js

    ./node_modules/uglify-js/bin/uglifyjs -o miniBundle.js bundle.js

piping browerify into uglify

    ./node_modules/browserify/bin/cmd.js hello2.js | ./node_modules/uglify-js/bin/uglifyjs -o miniBundle.js

add key to 'scripts' section of package.json and run it with 'npm run-script uglify'

    "scripts": {
      "browserify": "browserify hello2.js -o bundle.js",
      "uglify": "uglify-js -o miniBundle.js bundle.js"
    },

