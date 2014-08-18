[![GitHub version](https://badge.fury.io/gh/pulsarblow%2Feverestjs.svg)](http://badge.fury.io/gh/pulsarblow%2Feverestjs)
[![Bower version](https://badge.fury.io/bo/everest.svg)](http://badge.fury.io/bo/everest)
[![Build Status](https://travis-ci.org/PulsarBlow/everestjs.svg?branch=master)](https://travis-ci.org/PulsarBlow/everestjs)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

# Everest.js

A REST Api javascript client for the browser.

## What is it ?

Everest simplifies the way you implement asynchronous HTTP communications in your project, and particularly when you are communicating with a RESTful API.

Everest provides a REST API client abstraction, an HTTP client abstraction and a set of useful features you can reuse accross your project (url parser, types validators, pre-conditions guards, string manipulation, UUID utilities).

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
<script src="/path/to/everestjs" />
```

## Usage

#### As a global variable (traditional browser way)

Everest exports itself as a global variable : **window.everest** or the shortcut **window.ê**  
It is built on top of jQuery and thus requires the reference to the jquery library.  
If you want to use Everest as an AMD mobule, see the section below.

```javascript
var restApi = new ê.RestApiClient({
  baseUrl: "api.github.com",
});

restApi.read("/repos/PulsarBlow/everestjs")
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
  
  var restApi = ê.RestApiClient({
    baseUrl: "api.github.com"
  });
  
  restApi.read("/repos/PulsarBlow/everestjs")
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

Read the [full documentation](http://pulsarblow.github.io/everestjs) to learn about all the details.

## Development

To contribute to the repository or run the test you will need [node.js](http://nodejs.org) (> 0.8) and git

```
$ git clone https://github.com/PulsarBlow/everestjs
$ cd everestjs

$ npm install
$ bower install
```

To build the library and run the unit tests. Tests are run with Jasmine and PhantomJS

```
$ grunt
```
