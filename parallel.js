// parallel 
//
var bids = [];
var done;      // flag that will make sure we call displayAd only once

bidA("cars", function (err, result) {
  if (err) return error(err);
  bids.push(result);
  checkDone();
});

bidB("cars", function (err, result) {
  if (err) return error(err);
  bids.push(result);
  checkDone();
});

function error(err) {
  if (done) return; 
  done = true;
  displayAd(err);
}

function checkDone() {
  if (done || !bids[0] || !bids[1]) return;
  done = true;
  displayAd(null, bids);
}

function bidA(topic, cb){
  //some logic to decide the price for ad
  cb(null, {'company':'a', 'price': 10});
};

function bidB(topic, cb){
  //some logic to decide the price for ad
  cb(null, {'company':'b', 'price': 13});
};

function displayAd(err, bids) {
  if(err) {
    console.log('err', err);
  } else {
    console.log('bids', bids);
  }
};
