var setupRoutes = {
    register: function register(expressApp, routeOptions) {
        'use strict';

        var options = routeOptions ? routeOptions : {};
        var path = require('path');

        if (!options.path) {
            options.path = path.join(path.dirname(module.parent.filename), 'features');
        }

        if (!options.routesExtension) {
            options.routesExtension = 'Routes.js';
        }

        if (!options.resourcesExtension) {
            options.resourcesExtension = 'Resources.js';
        }

        var fs = require('fs');
        var _ = require('lodash');
        var inflect = require('inflect');

        var files = fs.readdirSync(options.path);
        var directories = _.filter(files, function isDirectory(file) {
            var filePath = path.join(options.path, file);
            var stats = fs.statSync(filePath);
            return stats.isDirectory();
        });

        var resourcesMap = [];
        _.each(directories, function loadRoutes(directory) {
            var singularResource = inflect.singularize(directory);

            var routesFileName = singularResource + options.routesExtension;
            var resourcesFileName = singularResource + options.resourcesExtension;

            var routesFilePath = path.join(options.path, directory, routesFileName);
            var resourcesFilePath = path.join(options.path, directory, resourcesFileName);

            if (fs.existsSync(routesFilePath)) {
                resourcesMap.push({
                    routesFilePath: routesFilePath,
                    resourcesFilePath: resourcesFilePath
                });
            }
        });

        function mapResources(resourceMap) {
            var routes = require(resourceMap.routesFilePath);
            var resources = require(resourceMap.resourcesFilePath);

            function registerRoute(route, action) {
                expressApp[route.method](route.url, resources[action]);
            }

            _.each(routes, registerRoute);
        }

        _.each(resourcesMap, mapResources);
    }
};

module.exports = setupRoutes;
