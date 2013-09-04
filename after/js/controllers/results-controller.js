(function(app){
  'use strict';

  app.controller('ResultsController',
    function ResultsController($scope, $location, parameterService, dataService){
      var containers = parameterService.getParameter('containers') || [];

      if(containers.length === 0){
        $location.path('/search');
      }

      $scope.searchResults = dataService.search(containers);
      $scope.selectedContainer = null;

      $scope.newSearch = function(){
        if(confirm('Are you sure you want to reset your search?')){
          parameterService.setParameter('containers', []);
          $location.path('/search');
        }
      };

      $scope.modifySearch = function(){
        $location.path('/search');
      };

      $scope.select = function(containerItem){
        $scope.selectedContainer = containerItem;
      };

      $scope.isSelected = function(containerItem){
        if($scope.selectedContainer) {
          return containerItem.Container === $scope.selectedContainer.Container;
        }

        return false;
      };
    }
  );
})(SearchApp);