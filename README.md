# WD.js -- WebDriver/Selenium 2 for node.js
  - Mailing List: https://groups.google.com/forum/#!forum/wdjs

[![Build Status](https://secure.travis-ci.org/admc/wd.png?branch=master)](http://travis-ci.org/admc/wd)
[![Selenium Test Status](https://saucelabs.com/buildstatus/wdjs)](https://saucelabs.com/u/wdjs)

[![Selenium Test Status](https://saucelabs.com/browser-matrix/wdjs.svg)](https://saucelabs.com/u/wdjs)

## Update node to latest

http://nodejs.org/#download

## Install

```
npm install wd
```

## Authors

  - Adam Christian ([admc](http://github.com/admc))
  - Ruben Daniels ([javruben](https://github.com/javruben))
  - Peter Braden ([peterbraden](https://github.com/peterbraden))
  - Seb Vincent ([sebv](https://github.com/sebv))
  - Peter 'Pita' Martischka ([pita](https://github.com/Pita))
  - Jonathan Lipps ([jlipps](https://github.com/jlipps))
  - Phil Sarin ([pdsarin](https://github.com/pdsarin))
  - Mathieu Sabourin ([OniOni](https://github.com/OniOni))
  - Bjorn Tipling ([btipling](https://github.com/btipling))
  - Santiago Suarez Ordonez ([santiycr](https://github.com/santiycr))
  - Bernard Kobos ([bernii](https://github.com/bernii))
  - Jason Carr ([maudineormsby](https://github.com/maudineormsby))
  - Matti Schneider ([MattiSG](https://github.com/MattiSG))

## License

  * License - Apache 2: http://www.apache.org/licenses/LICENSE-2.0

## 0.2.x Release

### 0.2.0

- New wrapper: promise chain.
- Old chain api is deprecated (It is still available, but you will see a depreciation message).
- There are some changes in the way the element and webdriver classes are passed around
which may affect external wrappers. External wrappers should now subclass those 2 classes. 

### 0.2.1

- New test suite using the promise chain api.
- `browser.Q` was moved to `wd.Q` 

## Usage

### Q promises + chaining

```js
...

browser
  .init({browserName:'chrome'})
  .get("http://admc.io/wd/test-pages/guinea-pig.html")
  .title()
    .should.become('I am a page title - Sauce Labs')
  .elementById('ai am a link')
  .click()
  .eval("window.location.href")
    .should.eventually.include('guinea-pig2')
  .fin(function() { return browser.quit(); })
  .done();

```
[full code here](https://github.com/admc/wd/blob/master/examples/promise/chrome.js)


### Pure async

```js
...

browser.init({browserName:'chrome'}, function() {
  browser.get("http://admc.io/wd/test-pages/guinea-pig.html", function() {
    browser.title(function(err, title) {
      title.should.include('I am a page title - Sauce Labs');
      browser.elementById('i am a link', function(err, el) {
        browser.clickElement(el, function() {
          /* jshint evil: true */
          browser.eval("window.location.href", function(err, href) {
            href.should.include('guinea-pig2');
            browser.quit();
          });
        });
      });
    });
  });
});
```
[full code here](https://github.com/admc/wd/blob/master/examples/async/chrome.js)


### Q promises without chaining

See example [here](https://github.com/admc/wd/blob/master/examples/promise/no-chain.js).

## Generators Api

### Yiewd

[Yiewd](https://github.com/jlipps/yiewd) is a wrapper around Wd.js that uses
generators in order to avoid nested callbacks, like so:

```js
wd.remote(function*() {
  yield this.init(desiredCaps);
  yield this.get("http://mysite.com");
  el = yield this.elementById("someId");
  yield el.click();
  el2 = yield this.elementById("anotherThing")
  text = yield el2.text();
  text.should.equal("What the text should be");
  yield this.quit();
});
```

## Repl

```
./node_modules/.bin/wd shell
```

```
): wd shell
> x = wd.remote() or wd.remote("ondemand.saucelabs.com", 80, "username", "apikey")

> x.init() or x.init({desired capabilities override})
> x.get("http://www.url.com")
> x.eval("window.location.href", function(e, o) { console.log(o) })
> x.quit()
```

## Browser initialization

### Indexed parameters

```js
var browser = wd.remote();
// or
var browser = wd.remote('localhost');
// or
var browser = wd.remote('localhost', 8888);
// or
var browser = wd.remote("ondemand.saucelabs.com", 80, "username", "apikey");
```
### Named parameters

The parameters used are similar to those in the [url](http://nodejs.org/docs/latest/api/url.html) module.

```js
var browser = wd.remote()
// or
var browser = wd.remote({
  hostname: '127.0.0.1',
  port: 4444,
  user: 'username',
  pwd: 'password',
});
// or
var browser = wd.remote({
  hostname: '127.0.0.1',
  port: 4444,
  auth: 'username:password',
});
```

The following parameters may also be used (as in earlier versions):

```js
var browser = wd.remote({
  host: '127.0.0.1',
  port: 4444,
  username: 'username',
  accessKey: 'password',
});
```
### Url string

```js
var browser = wd.remote('http://localhost:4444/wd/hub');
// or
var browser = wd.remote('http://user:apiKey@ondemand.saucelabs.com/wd/hub');
```

### Url object created via `url.parse`

[URL module documentation](http://nodejs.org/docs/v0.10.0/api/url.html#url_url)

```js
var url = require('url');
var browser = wd.remote(url.parse('http://localhost:4444/wd/hub'));
// or
var browser = wd.remote(url.parse('http://user:apiKey@ondemand.saucelabs.com:80/wd/hub'));
```

### Defaults

```js
{
    protocol: 'http:'
    hostname: '127.0.0.1',
    port: '4444'
    path: '/wd/hub'
}
```

### Environment variables for Saucelabs

When connecting to Saucelabs, the `user` and `pwd` fields can also be set through the `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` environment variables.

## Supported Methods

<table class="wikitable">
<tbody>
<tr>
<td width="50%" style="border: 1px solid #ccc; padding: 5px;">
<strong>JsonWireProtocol</strong>
</td>
<td width="50%" style="border: 1px solid #ccc; padding: 5px;">
<strong>wd</strong>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/status">/status</a><br>
Query the server's current status.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
status(cb) -&gt; cb(err, status)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session">/session</a><br>
Create a new session.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
init(desired, cb) -&gt; cb(err, sessionID, capabilities)<br>
Initialize the browser.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/sessions">/sessions</a><br>
Returns a list of the currently active sessions.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
sessions(cb) -&gt; cb(err, sessions)<br>
</p>
<p>
Alternate strategy to get session capabilities from server session list:<br>
altSessionCapabilities(cb) -&gt; cb(err, capabilities)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId">/session/:sessionId</a><br>
Retrieve the capabilities of the specified session.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
sessionCapabilities(cb) -&gt; cb(err, capabilities)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId">/session/:sessionId</a><br>
Delete the session.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
quit(cb) -&gt; cb(err)<br>
Destroy the browser.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts">/session/:sessionId/timeouts</a><br>
Configure the amount of time that a particular type of operation can execute for before they are aborted and a |Timeout| error is returned to the client.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setPageLoadTimeout(ms, cb) -&gt; cb(err)<br>
(use setImplicitWaitTimeout and setAsyncScriptTimeout to set the other timeouts)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/async_script">/session/:sessionId/timeouts/async_script</a><br>
Set the amount of time, in milliseconds, that asynchronous scripts executed by /session/:sessionId/execute_async are permitted to run before they are aborted and a |Timeout| error is returned to the client.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setAsyncScriptTimeout(ms, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/implicit_wait">/session/:sessionId/timeouts/implicit_wait</a><br>
Set the amount of time the driver should wait when searching for elements.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setImplicitWaitTimeout(ms, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window_handle">/session/:sessionId/window_handle</a><br>
Retrieve the current window handle.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
windowHandle(cb) -&gt; cb(err, handle)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window_handles">/session/:sessionId/window_handles</a><br>
Retrieve the list of all window handles available to the session.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
windowHandles(cb) -&gt; cb(err, arrayOfHandles)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/url">/session/:sessionId/url</a><br>
Retrieve the URL of the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
url(cb) -&gt; cb(err, url)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/url">/session/:sessionId/url</a><br>
Navigate to a new URL.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
get(url,cb) -&gt; cb(err)<br>
Get a new url.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/forward">/session/:sessionId/forward</a><br>
Navigate forwards in the browser history, if possible.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
forward(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/back">/session/:sessionId/back</a><br>
Navigate backwards in the browser history, if possible.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
back(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/refresh">/session/:sessionId/refresh</a><br>
Refresh the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
refresh(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/execute">/session/:sessionId/execute</a><br>
Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
execute(code, args, cb) -&gt; cb(err, result)<br>
execute(code, cb) -&gt; cb(err, result)<br>
args: script argument array (optional)<br>
</p>
<p>
Safely execute script within an eval block, always returning:<br>
safeExecute(code, args, cb) -&gt; cb(err, result)<br>
safeExecute(code, cb) -&gt; cb(err, result)<br>
args: script argument array (optional)<br>
</p>
<p>
Evaluate expression (using execute):<br>
eval(code, cb) -&gt; cb(err, value)<br>
</p>
<p>
Safely evaluate expression, always returning  (using safeExecute):<br>
safeEval(code, cb) -&gt; cb(err, value)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/execute_async">/session/:sessionId/execute_async</a><br>
Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
executeAsync(code, args, cb) -&gt; cb(err, result)<br>
executeAsync(code, cb) -&gt; cb(err, result)<br>
args: script argument array (optional)<br>
</p>
<p>
Safely execute async script within an eval block, always returning:<br>
safeExecuteAsync(code, args, cb) -&gt; cb(err, result)<br>
safeExecuteAsync(code, cb) -&gt; cb(err, result)<br>
args: script argument array (optional)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/screenshot">/session/:sessionId/screenshot</a><br>
Take a screenshot of the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
takeScreenshot(cb) -&gt; cb(err, screenshot)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/frame">/session/:sessionId/frame</a><br>
Change focus to another frame on the page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
frame(frameRef, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window">/session/:sessionId/window</a><br>
Change focus to another window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
window(name, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/window">/session/:sessionId/window</a><br>
Close the current window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
close(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window/:windowHandle/size">/session/:sessionId/window/:windowHandle/size</a><br>
Change the size of the specified window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
windowSize(handle, width, height, cb) -&gt; cb(err)<br>
</p>
<p>
setWindowSize(width, height, handle, cb) -&gt; cb(err)<br>
setWindowSize(width, height, cb) -&gt; cb(err)<br>
width: width in pixels to set size to<br>
height: height in pixels to set size to<br>
handle: window handle to set size for (optional, default: 'current')<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window/:windowHandle/size">/session/:sessionId/window/:windowHandle/size</a><br>
Get the size of the specified window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getWindowSize(handle, cb) -&gt; cb(err, size)<br>
getWindowSize(cb) -&gt; cb(err, size)<br>
handle: window handle to get size (optional, default: 'current')<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window/:windowHandle/position">/session/:sessionId/window/:windowHandle/position</a><br>
Change the position of the specified window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setWindowPosition(x, y, handle, cb) -&gt; cb(err)<br>
setWindowPosition(x, y, cb) -&gt; cb(err)<br>
x: the x-coordinate in pixels to set the window position<br>
y: the y-coordinate in pixels to set the window position<br>
handle: window handle to set position for (optional, default: 'current')<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window/:windowHandle/position">/session/:sessionId/window/:windowHandle/position</a><br>
Get the position of the specified window.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getWindowPosition(handle, cb) -&gt; cb(err, position)<br>
getWindowPosition(cb) -&gt; cb(err, position)<br>
handle: window handle to get position (optional, default: 'current')<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window/:windowHandle/maximize">/session/:sessionId/window/:windowHandle/maximize</a><br>
Maximize the specified window if not already maximized.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
maximize(handle, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/cookie">/session/:sessionId/cookie</a><br>
Retrieve all cookies visible to the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
allCookies() -&gt; cb(err, cookies)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/cookie">/session/:sessionId/cookie</a><br>
Set a cookie.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setCookie(cookie, cb) -&gt; cb(err)<br>
cookie example:<br>
{name:'fruit', value:'apple'}<br>
Optional cookie fields:<br>
path, domain, secure, expiry<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie">/session/:sessionId/cookie</a><br>
Delete all cookies visible to the current page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
deleteAllCookies(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie/:name">/session/:sessionId/cookie/:name</a><br>
Delete the cookie with the given name.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
deleteCookie(name, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/source">/session/:sessionId/source</a><br>
Get the current page source.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
source(cb) -&gt; cb(err, source)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/title">/session/:sessionId/title</a><br>
Get the current page title.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
title(cb) -&gt; cb(err, title)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element">/session/:sessionId/element</a><br>
Search for an element on the page, starting from the document root.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
element(using, value, cb) -&gt; cb(err, element)<br>
</p>
<p>
elementByClassName(value, cb) -&gt; cb(err, element)<br>
elementByCssSelector(value, cb) -&gt; cb(err, element)<br>
elementById(value, cb) -&gt; cb(err, element)<br>
elementByName(value, cb) -&gt; cb(err, element)<br>
elementByLinkText(value, cb) -&gt; cb(err, element)<br>
elementByPartialLinkText(value, cb) -&gt; cb(err, element)<br>
elementByTagName(value, cb) -&gt; cb(err, element)<br>
elementByXPath(value, cb) -&gt; cb(err, element)<br>
elementByCss(value, cb) -&gt; cb(err, element)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/elements">/session/:sessionId/elements</a><br>
Search for multiple elements on the page, starting from the document root.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
elements(using, value, cb) -&gt; cb(err, elements)<br>
</p>
<p>
elementsByClassName(value, cb) -&gt; cb(err, elements)<br>
elementsByCssSelector(value, cb) -&gt; cb(err, elements)<br>
elementsById(value, cb) -&gt; cb(err, elements)<br>
elementsByName(value, cb) -&gt; cb(err, elements)<br>
elementsByLinkText(value, cb) -&gt; cb(err, elements)<br>
elementsByPartialLinkText(value, cb) -&gt; cb(err, elements)<br>
elementsByTagName(value, cb) -&gt; cb(err, elements)<br>
elementsByXPath(value, cb) -&gt; cb(err, elements)<br>
elementsByCss(value, cb) -&gt; cb(err, elements)<br>
</p>
<p>
Retrieve an element avoiding not found exception and returning null instead:<br>
elementOrNull(using, value, cb) -&gt; cb(err, element)<br>
</p>
<p>
elementByClassNameOrNull(value, cb) -&gt; cb(err, element)<br>
elementByCssSelectorOrNull(value, cb) -&gt; cb(err, element)<br>
elementByIdOrNull(value, cb) -&gt; cb(err, element)<br>
elementByNameOrNull(value, cb) -&gt; cb(err, element)<br>
elementByLinkTextOrNull(value, cb) -&gt; cb(err, element)<br>
elementByPartialLinkTextOrNull(value, cb) -&gt; cb(err, element)<br>
elementByTagNameOrNull(value, cb) -&gt; cb(err, element)<br>
elementByXPathOrNull(value, cb) -&gt; cb(err, element)<br>
elementByCssOrNull(value, cb) -&gt; cb(err, element)<br>
</p>
<p>
Retrieve an element avoiding not found exception and returning undefined instead:<br>
elementIfExists(using, value, cb) -&gt; cb(err, element)<br>
</p>
<p>
elementByClassNameIfExists(value, cb) -&gt; cb(err, element)<br>
elementByCssSelectorIfExists(value, cb) -&gt; cb(err, element)<br>
elementByIdIfExists(value, cb) -&gt; cb(err, element)<br>
elementByNameIfExists(value, cb) -&gt; cb(err, element)<br>
elementByLinkTextIfExists(value, cb) -&gt; cb(err, element)<br>
elementByPartialLinkTextIfExists(value, cb) -&gt; cb(err, element)<br>
elementByTagNameIfExists(value, cb) -&gt; cb(err, element)<br>
elementByXPathIfExists(value, cb) -&gt; cb(err, element)<br>
elementByCssIfExists(value, cb) -&gt; cb(err, element)<br>
</p>
<p>
Check if element exists:<br>
hasElement(using, value, cb) -&gt; cb(err, boolean)<br>
</p>
<p>
hasElementByClassName(value, cb) -&gt; cb(err, boolean)<br>
hasElementByCssSelector(value, cb) -&gt; cb(err, boolean)<br>
hasElementById(value, cb) -&gt; cb(err, boolean)<br>
hasElementByName(value, cb) -&gt; cb(err, boolean)<br>
hasElementByLinkText(value, cb) -&gt; cb(err, boolean)<br>
hasElementByPartialLinkText(value, cb) -&gt; cb(err, boolean)<br>
hasElementByTagName(value, cb) -&gt; cb(err, boolean)<br>
hasElementByXPath(value, cb) -&gt; cb(err, boolean)<br>
hasElementByCss(value, cb) -&gt; cb(err, boolean)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/active">/session/:sessionId/element/active</a><br>
Get the element on the page that currently has focus.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
active(cb) -&gt; cb(err, element)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/element">/session/:sessionId/element/:id/element</a><br>
Search for an element on the page, starting from the identified element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
element.element(using, value, cb) -&gt; cb(err, element)<br>
</p>
<p>
element.elementByClassName(value, cb) -&gt; cb(err, element)<br>
element.elementByCssSelector(value, cb) -&gt; cb(err, element)<br>
element.elementById(value, cb) -&gt; cb(err, element)<br>
element.elementByName(value, cb) -&gt; cb(err, element)<br>
element.elementByLinkText(value, cb) -&gt; cb(err, element)<br>
element.elementByPartialLinkText(value, cb) -&gt; cb(err, element)<br>
element.elementByTagName(value, cb) -&gt; cb(err, element)<br>
element.elementByXPath(value, cb) -&gt; cb(err, element)<br>
element.elementByCss(value, cb) -&gt; cb(err, element)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/elements">/session/:sessionId/element/:id/elements</a><br>
Search for multiple elements on the page, starting from the identified element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
element.elements(using, value, cb) -&gt; cb(err, elements)<br>
</p>
<p>
element.elementsByClassName(value, cb) -&gt; cb(err, elements)<br>
element.elementsByCssSelector(value, cb) -&gt; cb(err, elements)<br>
element.elementsById(value, cb) -&gt; cb(err, elements)<br>
element.elementsByName(value, cb) -&gt; cb(err, elements)<br>
element.elementsByLinkText(value, cb) -&gt; cb(err, elements)<br>
element.elementsByPartialLinkText(value, cb) -&gt; cb(err, elements)<br>
element.elementsByTagName(value, cb) -&gt; cb(err, elements)<br>
element.elementsByXPath(value, cb) -&gt; cb(err, elements)<br>
element.elementsByCss(value, cb) -&gt; cb(err, elements)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/click">/session/:sessionId/element/:id/click</a><br>
Click on an element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
clickElement(element, cb) -&gt; cb(err)<br>
</p>
<p>
element.click(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/submit">/session/:sessionId/element/:id/submit</a><br>
Submit a FORM element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
submit(element, cb) -&gt; cb(err)<br>
Submit a `FORM` element.<br>
</p>
<p>
element.submit(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/text">/session/:sessionId/element/:id/text</a><br>
Returns the visible text for the element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
text(element, cb) -&gt; cb(err, text)<br>
element: specific element, 'body', or undefined<br>
</p>
<p>
element.text(cb) -&gt; cb(err, text)<br>
</p>
<p>
Check if text is present:<br>
textPresent(searchText, element, cb) -&gt; cb(err, boolean)<br>
element: specific element, 'body', or undefined<br>
</p>
<p>
element.textPresent(searchText, cb) -&gt; cb(err, boolean)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/value">/session/:sessionId/element/:id/value</a><br>
Send a sequence of key strokes to an element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
type(element, keys, cb) -&gt; cb(err)<br>
Type keys (all keys are up at the end of command).<br>
special key map: wd.SPECIAL_KEYS (see lib/special-keys.js)<br>
</p>
<p>
element.type(keys, cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/keys">/session/:sessionId/keys</a><br>
Send a sequence of key strokes to the active element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
keys(keys, cb) -&gt; cb(err)<br>
Press keys (keys may still be down at the end of command).<br>
special key map: wd.SPECIAL_KEYS (see lib/special-keys.js)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/name">/session/:sessionId/element/:id/name</a><br>
Query for an element's tag name.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getTagName(element, cb) -&gt; cb(err, name)<br>
</p>
<p>
element.getTagName(cb) -&gt; cb(err, name)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/clear">/session/:sessionId/element/:id/clear</a><br>
Clear a TEXTAREA or text INPUT element's value.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
clear(element, cb) -&gt; cb(err)<br>
</p>
<p>
element.clear(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/selected">/session/:sessionId/element/:id/selected</a><br>
Determine if an OPTION element, or an INPUT element of type checkbox or radiobutton is currently selected.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
isSelected(element, cb) -&gt; cb(err, selected)<br>
</p>
<p>
element.isSelected(cb) -&gt; cb(err, selected)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/enabled">/session/:sessionId/element/:id/enabled</a><br>
Determine if an element is currently enabled.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
isEnabled(element, cb) -&gt; cb(err, enabled)<br>
</p>
<p>
element.isEnabled(cb) -&gt; cb(err, enabled)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/attribute/:name">/session/:sessionId/element/:id/attribute/:name</a><br>
Get the value of an element's attribute.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getAttribute(element, attrName, cb) -&gt; cb(err, value)<br>
</p>
<p>
element.getAttribute(attrName, cb) -&gt; cb(err, value)<br>
</p>
<p>
Get element value (in value attribute):<br>
getValue(element, cb) -&gt; cb(err, value)<br>
</p>
<p>
element.getValue(cb) -&gt; cb(err, value)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/equals/:other">/session/:sessionId/element/:id/equals/:other</a><br>
Test if two element IDs refer to the same DOM element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
element.equals(other, cb) -&gt; cb(err, value)<br>
</p>
<p>
equalsElement(element, other , cb) -&gt; cb(err, value)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/displayed">/session/:sessionId/element/:id/displayed</a><br>
Determine if an element is currently displayed.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
isDisplayed(element, cb) -&gt; cb(err, displayed)<br>
</p>
<p>
element.isDisplayed(cb) -&gt; cb(err, displayed)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/location">/session/:sessionId/element/:id/location</a><br>
Determine an element's location on the page.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getLocation(element, cb) -&gt; cb(err, location)<br>
</p>
<p>
element.getLocation(cb) -&gt; cb(err, location)<br>
</p>
<p>
element.getLocationInView(cb) -&gt; cb(err, location)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/location_in_view">/session/:sessionId/element/:id/location_in_view</a><br>
Determine an element's location on the screen once it has been scrolled into view.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getLocationInView(element, cb) -&gt; cb(err, location)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/size">/session/:sessionId/element/:id/size</a><br>
Determine an element's size in pixels.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getSize(element, cb) -&gt; cb(err, size)<br>
</p>
<p>
element.getSize(cb) -&gt; cb(err, size)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/css/:propertyName">/session/:sessionId/element/:id/css/:propertyName</a><br>
Query the value of an element's computed CSS property.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
getComputedCss(element, cssProperty , cb) -&gt; cb(err, value)<br>
</p>
<p>
element.getComputedCss(cssProperty , cb) -&gt; cb(err, value)<br>
</p>
<p>
element.getComputedCss(cssProperty , cb) -&gt; cb(err, value)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/orientation">/session/:sessionId/orientation</a><br>
Get the current browser orientation.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getOrientation(cb) -&gt; cb(err, orientation)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/orientation">/session/:sessionId/orientation</a><br>
Set the browser orientation.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setOrientation(cb) -&gt; cb(err, orientation)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/alert_text">/session/:sessionId/alert_text</a><br>
Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
alertText(cb) -&gt; cb(err, text)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/alert_text">/session/:sessionId/alert_text</a><br>
Sends keystrokes to a JavaScript prompt() dialog.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
alertKeys(keys, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/accept_alert">/session/:sessionId/accept_alert</a><br>
Accepts the currently displayed alert dialog.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
acceptAlert(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/dismiss_alert">/session/:sessionId/dismiss_alert</a><br>
Dismisses the currently displayed alert dialog.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
dismissAlert(cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/moveto">/session/:sessionId/moveto</a><br>
Move the mouse by an offset of the specificed element.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
moveTo(element, xoffset, yoffset, cb) -&gt; cb(err)<br>
Move to element, xoffset and y offset are optional.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/click">/session/:sessionId/click</a><br>
Click any mouse button (at the coordinates set by the last moveto command).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
click(button, cb) -&gt; cb(err)<br>
Click on current element.<br>
Buttons: {left: 0, middle: 1 , right: 2}<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/buttondown">/session/:sessionId/buttondown</a><br>
Click and hold the left mouse button (at the coordinates set by the last moveto command).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
buttonDown(button ,cb) -&gt; cb(err)<br>
button is optional.<br>
{LEFT = 0, MIDDLE = 1 , RIGHT = 2}.<br>
LEFT if not specified.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/buttonup">/session/:sessionId/buttonup</a><br>
Releases the mouse button previously held (where the mouse is currently at).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
buttonUp(button, cb) -&gt; cb(err)<br>
button is optional.<br>
{LEFT = 0, MIDDLE = 1 , RIGHT = 2}.<br>
LEFT if not specified.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/doubleclick">/session/:sessionId/doubleclick</a><br>
Double-clicks at the current mouse coordinates (set by moveto).
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
doubleclick(cb) -&gt; cb(err)<br>
</p>
<p>
element.doubleClick(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/touch/click">/session/:sessionId/touch/click</a><br>
Single tap on the touch enabled device.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
tap(element) -&gt; cb(err)<br>
Taps element<br>
</p>
<p>
element.tap(cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/touch/flick">/session/:sessionId/touch/flick</a><br>
Flick on the touch screen using finger motion events.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
<p>
flick(xSpeed, ySpeed, swipe, cb) -&gt; cb(err)<br>
Flicks, starting anywhere on the screen.<br>
flick(element, xoffset, yoffset, speed, cb) -&gt; cb(err)<br>
Flicks, starting at element center.<br>
</p>
<p>
element.flick(xoffset, yoffset, speed, cb) -&gt; cb(err)<br>
</p>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/local_storage">/session/:sessionId/local_storage</a><br>
Set the storage item for the given key.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setLocalStorageKey(key, value, cb) -&gt; cb(err)<br>
# uses safeExecute() due to localStorage bug in Selenium<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/local_storage">/session/:sessionId/local_storage</a><br>
Clear the storage.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
clearLocalStorage(cb) -&gt; cb(err)<br>
# uses safeExecute() due to localStorage bug in Selenium<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/local_storage/key/:key">/session/:sessionId/local_storage/key/:key</a><br>
Get the storage item for the given key.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
getLocalStorageKey(key, cb) -&gt; cb(err)<br>
# uses safeEval() due to localStorage bug in Selenium<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/local_storage/key/:key">/session/:sessionId/local_storage/key/:key</a><br>
Remove the storage item for the given key.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
removeLocalStorageKey(key, cb) -&gt; cb(err)<br>
# uses safeExecute() due to localStorage bug in Selenium<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/log">/session/:sessionId/log</a><br>
Get the log for a given log type.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
log(logType, cb) -&gt; cb(err, arrayOfLogs)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/log/types">/session/:sessionId/log/types</a><br>
Get available log types.
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
logTypes(cb) -&gt; cb(err, arrayOfLogTypes)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Opens a new window (using Javascript window.open):<br>
newWindow(url, name, cb) -&gt; cb(err)<br>
newWindow(url, cb) -&gt; cb(err)<br>
name: optional window name<br>
Window can later be accessed by name with the window method,<br>
or by getting the last handle returned by the windowHandles method.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
windowName(cb) -&gt; cb(err, name)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
setHTTPInactivityTimeout(ms)<br>
ms: how many milliseconds to wait for any communication with the WebDriver server (i.e. any command to complete) before the connection is considered lost<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
waitForElement(using, value, timeout, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
waitForVisible(using, value, timeout, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
waitForElementByClassName(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByCssSelector(value, timeout, cb) -&gt; cb(err)<br>
waitForElementById(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByName(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByLinkText(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByPartialLinkText(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByTagName(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByXPath(value, timeout, cb) -&gt; cb(err)<br>
waitForElementByCss(value, timeout, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
waitForVisibleByClassName(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByCssSelector(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleById(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByName(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByLinkText(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByPartialLinkText(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByTagName(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByXPath(value, timeout, cb) -&gt; cb(err)<br>
waitForVisibleByCss(value, timeout, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
isVisible(element , cb) -&gt; cb(err, boolean)<br>
isVisible(queryType, querySelector, cb) -&gt; cb(err, boolean)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Retrieves the pageIndex element (added for Appium):<br>
getPageIndex(element, cb) -&gt; cb(err, pageIndex)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Uploads a local file using undocumented<br>
POST /session/:sessionId/file<br>
uploadFile(filepath, cb) -&gt; cb(err, filepath)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Waits for JavaScript condition to be true (polling within wd client):<br>
waitForCondition(conditionExpr, timeout, pollFreq, cb) -&gt; cb(err, boolean)<br>
waitForCondition(conditionExpr, timeout, cb) -&gt; cb(err, boolean)<br>
waitForCondition(conditionExpr, cb) -&gt; cb(err, boolean)<br>
conditionExpr: condition expression, should return a boolean<br>
timeout: timeout (optional, default: 1000)<br>
pollFreq: pooling frequency (optional, default: 100)<br>
return true if condition satisfied, error otherwise.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Waits for JavaScript condition to be true (async script polling within browser):<br>
waitForConditionInBrowser(conditionExpr, timeout, pollFreq, cb) -&gt; cb(err, boolean)<br>
waitForConditionInBrowser(conditionExpr, timeout, cb) -&gt; cb(err, boolean)<br>
waitForConditionInBrowser(conditionExpr, cb) -&gt; cb(err, boolean)<br>
conditionExpr: condition expression, should return a boolean<br>
timeout: timeout (optional, default: 1000)<br>
pollFreq: pooling frequency (optional, default: 100)<br>
return true if condition satisfied, error otherwise.<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
Equivalent to the python sendKeys binding. Upload file if<br>
a local file is detected, otherwise behaves like type.<br>
element.sendKeys(keys, cb) -&gt; cb(err)<br>
</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 5px;">
EXTRA
</td>
<td style="border: 1px solid #ccc; padding: 5px;">
isVisible(cb) -&gt; cb(err, boolean)<br>
</td>
</tr>
</tbody>
</table>

## JsonWireProtocol mapping

[supported mapping](https://github.com/admc/wd/blob/master/doc/jsonwire-mapping.md)

[full mapping](https://github.com/admc/wd/blob/master/doc/jsonwire-full-mapping.md)

## More docs!

WD is simply implementing the Selenium JsonWireProtocol, for more details see the official docs:
 - <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol">http://code.google.com/p/selenium/wiki/JsonWireProtocol</a>

## Run the tests!

```
# Install the Selenium server and Chromedriver
node_modules/.bin/install_selenium
node_modules/.bin/install_chromedriver

#Run the selenium server with chromedriver:
node_modules/.bin/start_selenium_with_chromedriver

cd wd
npm install
make test

# look at the results!
```

## Run the tests on Sauce Labs cloud!
```
cd wd
npm install
make test_e2e_sauce
```

## Monkey patching

You may want to monkey patch the webdriver class in order to add custom functionalities.
There is an example [here](https://github.com/admc/wd/blob/master/examples/example.monkey.patch.js).

## Adding new method / Contributing

If the method you want to use is not yet implemented, that should be
easy to add it to `lib/webdriver.js`. You can use the `doubleclick`
method as a template for methods not returning data, and `getOrientation`
for methods which returns data. No need to modify README as the doc
generation is automated. Other contributions are welcomed.

## Doc

The JsonWire mappings in the README and mapping files are generated from code
comments using [dox](https://github.com/visionmedia/dox).

To update the mappings run the following commands:

```
make mapping > doc/jsonwire-mapping.md
make full_mapping > doc/jsonwire-full-mapping.md
make unsupported_mapping > doc/jsonwire-unsupported-mapping.md
```

The content of doc/jsonwire-mapping.md should then be manually integrated into
README.md.

## Safe Methods

The `safeExecute` and `safeEval` methods are equivalent to `execute` and `eval` but the code is
executed within a `eval` block. They are safe in the sense that eventual
code syntax issues are tackled earlier returning as syntax error and
avoiding browser hanging in some cases.

An example below of expression hanging Chrome:

```js
browser.eval("wrong!!!", function(err, res) { // hangs
browser.safeEval("wrong!!!", function(err, res) { // returns
browser.execute("wrong!!!", function(err, res) { //hangs
browser.safeExecute("wrong!!!", function(err, res) { //returns
```

## Test Coverage

[test coverage](http://admc.io/wd/coverage.html)
