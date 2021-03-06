var setup = require('../helpers/setup');

var path = require('path');

describe('element api test (' + setup.testEnv + ')', function() {

  var browser;
  var express = new setup.Express( __dirname + '/assets' );

  before(function() {
    express.start();
    return browser = setup.initBrowser();
  });

  after(function() {
    express.stop();
    return setup.closeBrowser();
  });

  beforeEach(function() {
    var cleanTitle = this.currentTest.title.replace(/@[-\w]+/g, '').trim();
    return browser.get(
      'http://127.0.0.1:8181/test-page?partial=' +
        encodeURIComponent(cleanTitle));
  });

  express.partials['element.text'] =
    '<div id="theDiv">I am some text</div>';
  it('element.text', function() {
    return browser.elementById("theDiv").then(function(el) {
      el.text().should.eventually.include("I am some text");
    });
  });

  express.partials['element.textPresent'] =
    '<div id="theDiv">I am some text</div>';
  it('element.textPresent', function() {
    return browser.elementById("theDiv").then(function(el) {
      return Q.all([
        el.textPresent("some text").should.eventually.be.ok,
        el.textPresent("wrong text").should.eventually.not.be.ok
      ]);
    });
  });

  express.partials['element.click'] =
    '<div id="theDiv"><a href="#">not clicked</a></div>';
  it('element.click', function() {
    return browser
      .execute(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' a.click(function() {\n' +
        '   a.html("clicked");\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n'
      )
      .elementByCss('#theDiv a').text().should.become('not clicked')
      .elementByCss('#theDiv a').then(function(el) {
        return el.click();
      })
      .elementByCss('#theDiv a').text().should.become('clicked');
  });

  express.partials['element.doubleClick'] =
    '<div id="theDiv"><a href="#">not clicked</a></div>';
  it('element.doubleClick', function() {
    return browser
      .execute(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' a.dblclick(function() {\n' +
        '   a.html("doubleclicked");\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n'
      )
      .elementByCss('#theDiv a').text().should.become('not clicked')
      .elementByCss('#theDiv a').then(function(el) {
        return el.doubleClick();
      })
      .elementByCss('#theDiv a').text().should.become('doubleclicked');
  });

  express.partials['element.moveTo'] =
    '<div id="theDiv"><a href="#">not clicked</a></div>';
  it('element.moveTo', function() {
    return browser
      .elementByCss('#theDiv a').then(function(el) {
        return el.moveTo();
      })
      .elementByCss('#theDiv a').then(function(el) {
        return el.moveTo(10, 10);
      });
      // todo: write better tests using hover
  });

  express.partials['element.getTagName'] =
    '<div id="theDiv">\n' +
    '  <input type="text">\n' +
    '  <a href="#">a1</a>\n' +
    '</div>\n';
  it('element.getTagName', function() {
    return browser
      .elementByCss("#theDiv input").then(function(el) {
        return el.getTagName().should.become('input');
      })
      .elementByCss("#theDiv a").then(function(el) {
        return el.getTagName().should.become('a');
      });
  });

  express.partials['element.isDisplayed'] =
    '<div id="theDiv">\n' +
    '  <input class="displayed" type="text" value="Hello">\n' +
    '  <input class="hidden" type="hidden" value="Hello">\n' +
    '</div>\n';
  it('element.isDisplayed', function() {
    return browser
      .elementByCss("#theDiv .displayed").then(function(el) {
        return Q.all([
            el.isDisplayed().should.eventually.be.ok,
            el.displayed().should.eventually.be.ok,
          ]);
      })
      .elementByCss("#theDiv .hidden").then(function(el) {
        return el.isDisplayed().should.eventually.not.be.ok;
      });
  });

  express.partials['element.isEnabled'] =
    '<div id="theDiv">\n' +
    '  <input class="enabled" type="text" value="Hello">\n' +
    '  <input class="disabled" type="text" value="Hello" disabled>\n' +
    '</div>\n';
  it('element.isEnabled', function() {
    return browser
      .elementByCss("#theDiv .enabled").then(function(el) {
        return Q.all([
            el.isEnabled().should.eventually.be.ok,
            el.enabled().should.eventually.be.ok,
          ]);
      })
      .elementByCss("#theDiv .disabled").then(function(el) {
        return el.isEnabled().should.eventually.not.be.ok;
      });
  });

  express.partials['element.getComputedCss'] =
    '<div id="theDiv">\n' +
    '  <a href="#">a1</a>\n' +
    '</div>\n';
  it('element.getComputedCss', function() {
    return browser
      .elementByCss("#theDiv a").then(function(el) {
        return Q.all([
            el.getComputedCss('color')
              .should.eventually.have.length.above(0),
            el.getComputedCSS('color')
              .should.eventually.have.length.above(0)
          ]);
      })
      ;
  });

  it('element.equals', function() {
    return Q.all([
      browser.elementByTagName("body"),
      browser.elementByXPath("//body")
    ]).then(function(els) {
      return els[0].equals(els[1]).should.eventually.be.ok;
    });
  });

  express.partials['element.getAttribute'] =
    '<div id="theDiv" att="42">Attribute</div>\n';
  it('element.getAttribute', function() {
    return browser
      .elementById("theDiv").then(function(el) {
        return el.getAttribute("att").should.become("42");
      });
  });

  express.partials['element.getValue'] =
    '<div id="theDiv" value="qwerty">Value</div>\n';
  it('element.getValue', function() {
    return browser
      .elementById("theDiv").then(function(el) {
        return el.getValue().should.become("qwerty");
      });
  });

  express.partials['element.type'] =
    '<div id="theDiv"><input></input></div>\n';
  it('element.type', function() {
    return browser
      .elementByCss("#theDiv input").getValue().should.become("")
      .elementByCss("#theDiv input").then(function(el) {
        return el.type('hello').getValue().should.become("hello");
      });
  });

  express.partials['element.keys'] =
    '<div id="theDiv"><input></input></div>\n';
  it('element.keys', function() {
    return browser
      .elementByCss("#theDiv input").getValue().should.become("")
      .elementByCss("#theDiv input").then(function(el) {
        return el.click().keys('hello').getValue().should.become("hello");
      });
  });

  express.partials['element.sendKeys'] =
    '<div id="theDiv">\n' +
    '  <textarea></textarea>\n' +
    '  <input></input>\n' +
    '</div>\n';
  it('element.sendKeys', function() {
    return browser
      .elementByCss("#theDiv textarea").then(function(el) {
        var sequence = [
          function() { return el.sendKeys("keys").getValue().should.become("keys"); },
          function() { return el.sendKeys([100136872.21, {}])
            .getValue().should.become("keys100136872.21" + {}.toString()); }
        ];
        return sequence.reduce(Q.when, new Q());
      })
      .elementByCss("#theDiv input").then(function(el) {
        var filePath = path.resolve("test/mocha.opts");
        return el.sendKeys(filePath).getValue().then(function(val) {
          val.should.include('mocha.opts');
          // check that the path was transformed, as the file was uploaded
          val.should.not.include(filePath);
        });
      });
  });

  express.partials['element.clear'] =
    '<div id="theDiv"><textarea>Not clear</textarea></div>\n';
  it('element.clear', function() {
    return browser
      .elementByCss("#theDiv textarea").then(function(el) {
        var sequence = [
          function() { return el.getValue().should.become("Not clear"); },
          function() { return el.clear().getValue().should.become(""); }
        ];
        return sequence.reduce(Q.when, new Q());
      });
  });

  express.partials['element.elementByTagName'] =
    '<div id="theDiv"><a href="#">a link</a></div>\n' +
    '<div id="theDiv2"><textarea></textarea></div>\n';
  it('element.elementByTagName', function() {
    return browser
      .setImplicitWaitTimeout(0)
      .elementById("theDiv").then(function(el) {
        return el.elementByTagName("a").text().should.become("a link");
      })
      .elementById("theDiv").then(function(el) {
        return el.elementByTagName("textarea").should.be.rejected.with(/status: 7/);
      })
      ;
  });

  express.partials['element.elementsByTagName'] =
    '<div id="theDiv">\n' +
    '  <a href="#">a link 1</a>\n' +
    '  <a href="#">a link 2</a>\n' +
    '  <a href="#">a link 3</a>\n' +
    '</div>\n' +
    '<div id="theDiv2"><textarea></textarea></div>\n';
  it('element.elementsByTagName', function() {
    return browser
      .setImplicitWaitTimeout(0)
      .elementById("theDiv").then(function(el) {
        return el.elementsByTagName("a").should.eventually.have.length(3);
      })
      .elementById("theDiv").then(function(el) {
        return el.elementsByTagName("textarea").should.eventually.deep.equal([]);
      });
  });

  // todo: add test for other suffixed methods

});
