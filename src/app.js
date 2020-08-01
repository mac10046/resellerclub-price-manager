"use strict";

var app = angular.module('ngApp', ['ngRoute', 'angular.filter', 'ngAnimate', 'ngMessages']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: "views/home.html",
            controller: "HomeController"
        })
        .otherwise({
            templateUrl: "views/not-found.html"
        });

}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = false;
}]);

app.config(['$qProvider', function($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

app.config(['$httpProvider', function($httpProvider) {

    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};

}]);


app.service('MetaTagsService',
    function MetaTagsService() {
        // Reference from https://oodavid.com/article/angularjs-meta-tags-management/
        var service = this;
        service.setDefaultTags = setDefaultTags;
        service.setTags = setTags;
        service.clearTags = clearTags;
        var defaultTags = {};
        var tagElements = [];

        function setDefaultTags(tags) {
            angular.copy(tags, defaultTags);
            setTags({});
        }

        function setTags(tags) {
            clearTags();
            mergeDefaultTags(tags);
            angular.forEach(tags, function(content, name) {
                var tagElement = getTagElement(content, name);
                document.head.appendChild(tagElement);
                tagElements.push(tagElement);
            });
        }

        function mergeDefaultTags(tags) {
            angular.forEach(defaultTags, function(defaultTagContent, defaultTagName) {
                if (!tags[defaultTagName]) {
                    tags[defaultTagName] = defaultTagContent;
                }
            });
            return tags;
        }

        function getTagElement(content, name) {
            if (name == 'title') {
                // Special provision for the title element
                var title = document.createElement('title');
                title.textContent = content;
                return title;
            } else if (name.indexOf('og:')) {
                // Opengraph uses [property]
                var nameAttr = 'property';
                var meta = document.createElement('meta');
                meta.setAttribute(nameAttr, name);
                meta.setAttribute('content', content);
                return meta;
            } else if (name.indexOf('itemprop:')) {
                var nameAttr = 'itemprop';
                var meta = document.createElement('meta');
                meta.setAttribute(nameAttr, name.split(":")[1]);
                meta.setAttribute('content', content);
                return meta;
            } else {
                var nameAttr = 'name';
                var meta = document.createElement('meta');
                meta.setAttribute(nameAttr, name);
                meta.setAttribute('content', content);
                return meta;
            }


        }

        function clearTags() {
            angular.forEach(tagElements, function(tagElement) {
                document.head.removeChild(tagElement);
            });
            tagElements.length = 0;
        }
    });

app.run(function($rootScope, MetaTagsService) {
    $rootScope.$on('$routeChangeSuccess', function() {
        MetaTagsService.clearTags();
    })
});

app.run(['MetaTagsService', function(MetaTagsService) {
    MetaTagsService.setDefaultTags({
        // Indexing / Spiders
        'googlebot': 'all',
        'bingbot': 'all',
        'robots': 'all',
        // General SEO
        'title': 'title',
        'description': 'metaDescription',
        'keywords': 'profitable portfolio, indian advisory product, managed portfolio',
        'author': 'author',
        // OpenGraph
        'og:type': 'product',
        'og:title': 'title',
        'og:description': 'metaDescription',
        'og:image': 'iconImage',
        // Twitter
        'twitter:card': 'summary_small_image',
        'twitter:creator': 'author',
        'twitter:title': 'title',
        'twitter:description': 'metaDescription',
        'twitter:image': 'iconImage',
    });
}]);