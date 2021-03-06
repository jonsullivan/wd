require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd;
try {
  wd = require('wd');
} catch( err ) {
  wd = require('../../lib/main');
}

var browser = wd.promiseChainRemote();

// optional extra logging
//browser._debugPromise();
browser.on('status', function(info) {
  console.log(info.cyan);
});
browser.on('command', function(meth, path, data) {
  console.log(' > ' + meth.yellow, path.grey, data || '');
});

function search(something) {
  return function() {
    return browser
      .elementByCss('input[name=q]')
      .type(something)
      .keys(wd.SPECIAL_KEYS.Return);
  };
}

browser
  .init({browserName: 'chrome'})
  .get('http://www.google.com')
  .then(search('wd'))
  .fin(function() { return browser.sleep(2000).quit(); })
  .done();
