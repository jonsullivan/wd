var username = process.env.SAUCE_USERNAME || "SAUCE_USERNAME";
var accessKey = process.env.SAUCE_ACCESS_KEY || "SAUCE_ACCESS_KEY";

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

var browser = wd.promiseChainRemote("ondemand.saucelabs.com", 80, username, accessKey);

// optional extra logging
//browser._debugPromise();
browser.on('status', function(info) {
  console.log(info.cyan);
});
browser.on('command', function(meth, path, data) {
  console.log(' > ' + meth.yellow, path.grey, data || '');
});

var desired = {
  platform: 'LINUX',
  tags: ["examples"],
  name: "This is an example test"
};

/* jshint evil: true */
browser
  .init(desired)
  .get("http://admc.io/wd/test-pages/guinea-pig.html")
  .title()
    .should.become('I am a page title - Sauce Labs')
  .elementById('i am a link')
  .click()
  .eval("window.location.href")
    .should.eventually.include('guinea-pig2')
  .fin(function() { return browser.quit(); })
  .done();
