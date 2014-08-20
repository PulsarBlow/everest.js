[![GitHub version](https://badge.fury.io/gh/PulsarBlow%2Feverest.js.svg)](http://badge.fury.io/gh/PulsarBlow%2Feverest.js)
[![Bower version](https://badge.fury.io/bo/everest.svg)](http://badge.fury.io/bo/everest)
[![Build Status](https://travis-ci.org/PulsarBlow/everest.js.svg?branch=master)](https://travis-ci.org/PulsarBlow/everest.js)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

# Everest.js

A REST Api javascript client for the browser.

## What is it ?

Everest simplifies the way you implement asynchronous HTTP communications in your project, and particularly when you are communicating with a RESTful API.

Everest provides a REST API client abstraction, an HTTP client abstraction and a set of useful features you can reuse accross your project (url parser, types checkers, pre-conditions guards, string manipulation, UUID manipulation).

## Installation

There are 2 ways to install Everest

#### Easiest

Install with [Bower](http://bower.io/)
```
$ bower install everest
```

Reference jQuery and Everest in your page

```html
<script src="/path/to/jquery" />
<script src="/path/to/everestjs" />
```

#### Easy

Download the source from github : [everest.min.js](/dist/everest.min.js)

Reference jQuery and Everest in your page

```html
<script src="/path/to/jquery" />
<script src="/path/to/everest.min.js" />
```

## Usage

#### As a global variable (traditional browser way)

Everest exports itself as a global variable : **window.everest** or the shortcut **window.ê**  
It is built on top of jQuery and thus requires the reference to the jquery library.  
If you want to use Everest as an AMD mobule, see the section below.

```javascript
var restClient = ê.createRestClient({
  host: "api.github.com",
  useSSL: true // required by github api
});

restClient.read("/repos/PulsarBlow/everestjs")
  .done(function(data) {
    // Do something with data
  }).fail(function() {
    // Handle a read failure
});
```
#### As an AMD module

You can also use Everest as an AMD module (with [RequireJS](http://requirejs.org))

```html
<script>
    var require = {
        paths: {
            "jquery": "/path/to/jquery",
            "everest": "/path/to/everest"
        }
    };
</script>
<script data-main="main.js" src="/path/to/requirejs"></script>

```

```javascript
// main.js
define(["everest"], function(ê) {
  "use strict";
  
  var restClient = ê.createRestClient({
    baseUrl: "api.github.com",
    useSSL: true // required by github api
  });
  
  restClient.read("/repos/PulsarBlow/everestjs")
    .done(function(data) {
      console.log("resource read successful", data);
    })
    .fail(function() {
      console.warn("resource read failed", arguments);
    }).always(function() {
      console.log("resApi read completed");
    });
});
```
## Documentation

Read the [full documentation](http://pulsarblow.github.io/everest.js) to learn about all the details.

## Development

To run the test you will need [node.js](http://nodejs.org) (> 0.8) and git
Tests are run with Jasmine and PhantomJS

```
$ git clone https://github.com/PulsarBlow/everestjs
$ cd everestjs

$ npm install
$ bower install
```

```
$ grunt
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using grunt.
