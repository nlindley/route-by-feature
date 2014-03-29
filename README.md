# Route by Feature

Route by Feature is an opinionated way of conventionally declaring routes in an [Express](http://expressjs.com) app. While there are many ways of managing routes, this is one way that keeps the routes with the features with minimal configuration.

## Usage

First we need an Express app, then we need options to tell the router where to look for your features. Finally we register the routes.

```javascript
// app.js

var express = require('express');
var path = require('path');
var routes = require('route-by-feature');

var app = express();

var routeOptions = {
    path: path.join(__dirname, 'features'), // This one is required
    routesExtension: 'Routes.js', // Optional. default: 'Routes.js'
    resourcesExtension: 'Resources.js' // Optional. default: 'Routes.js'
};

routes.register(app, routeOptions);

app.listen(3000);
```

Let’s create a feature. We will name it Thing. In `features/things` we need the following files.

```javascript
// features/things/thingRoutes.js

'use strict';

var thingRoutes = {
    index: { url: '/things', method: 'get' },
    retrieve: { url: '/things/:id', method: 'get' },
    destroy: { url: '/things/:id', method: 'delete' },
    create: { url: '/things', method: 'post' },
    update: { url: '/things/:id', method: 'put' }
};

module.exports = thingRoutes;
```

```javascript
// features/things/thingResources.js

'use strict';

var thingResources = {
    index: function index(req, res) {
        res.send('GET the index');
    },
    retrieve: function retrieve(req, res) {
        res.send('GET with ID ' + req.params.id);
    },
    create: function create(req, res) {
        res.send('POSTing');
    },
    update: function update(req, res) {
        res.send('PUT with ID ' + req.params.id);
    },
    destroy: function destroy(req, res) {
        res.send('DELETE with ID ' + req.params.id);
    }
};

module.exports = thingResources;
```

Now, fire up your server with `node app.js` and point your browser to <http://localhost:3000/things>.