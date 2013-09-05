var SearchApp = {};

(function(){
  'use strict';

  SearchApp = angular.module('SearchApp', [])
    .config(function($routeProvider){
      $routeProvider

        .when('/search',
          { templateUrl: 'templates/search.html', controller: 'SearchController' } )

        .when('/results',
        {
          templateUrl: 'templates/results.html', controller: 'ResultsController',
          resolve: { 'ServiceData':
            function(dataService) {
              return dataService.promise;
            }
          }
        } )

        .otherwise(
          { redirectTo: '/search' } );
    });
})();
