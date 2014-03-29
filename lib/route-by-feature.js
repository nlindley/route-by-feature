var setupRoutes = {
    register: function register(expressApp, options) {
        'use strict';

        if (!options.routesExtension) {
            options.routesExtension = 'Routes.js';
        }

        if (!options.resourcesExtension) {
            options.resourcesExtension = 'Resources.js';
        }

        var path = require('path');
        var fs = require('fs');
        var _ = require('lodash');
        var inflect = require('inflect');

        var resourcesPath = options.path;
        var files = fs.readdirSync(resourcesPath);
        var directories = _.filter(files, function isDirectory(file) {
            var filePath = path.join(resourcesPath, file);
            var stats = fs.statSync(filePath);
            return stats.isDirectory();
        });

        var resourcesMap = [];
        _.each(directories, function loadRoutes(directory) {
            var singularResource = inflect.singularize(directory);

            var routesFileName = singularResource + options.routesExtension;
            var resourcesFileName = singularResource + options.resourcesExtension;

            var routesFilePath = path.join(resourcesPath, directory, routesFileName);
            var resourcesFilePath = path.join(resourcesPath, directory, resourcesFileName);

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