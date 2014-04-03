var setupRoutes = {
    register: function register(expressApp, routeOptions) {
        'use strict';

        var path = require('path');
        var _ = require('lodash');

        var defaultOptions = {
            path: path.join(path.dirname(module.parent.filename), 'features'),
            routesExtension: 'Routes',
            resourcesExtension: 'Resources'
        };

        routeOptions = routeOptions ? routeOptions : {};

        var options = _.assign(routeOptions, defaultOptions);

        var fs = require('fs');
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

            resourcesMap.push({
                routesFilePath: routesFilePath,
                resourcesFilePath: resourcesFilePath
            });
        });

        function mapResources(resourceMap) {
            try {
                var routes = require(resourceMap.routesFilePath);
            } catch (e) {
                if (e.code !== 'MODULE_NOT_FOUND') {
                    throw e;
                }
            }

            if (routes) {
                var resources = require(resourceMap.resourcesFilePath);
            }

            function registerRoute(route, action) {
                expressApp[route.method](route.url, resources[action]);
            }

            _.each(routes, registerRoute);
        }

        _.each(resourcesMap, mapResources);
    }
};

module.exports = setupRoutes;
