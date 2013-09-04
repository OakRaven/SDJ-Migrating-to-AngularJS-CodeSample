(function(app){
  'use strict';

  app.controller('SearchController',
    function SearchController($scope, _, parameterService, $location){
      $scope.newContainerNumber = '';

      $scope.containers = parameterService.getParameter('containers') || ['ABCD222222', 'ABCD444444', 'ABCD888888'];

      $scope.canAdd = function(){
        return $scope.newContainerNumber !== '';
      };

      $scope.add = function(){
        ($scope.containers).push($scope.newContainerNumber.toUpperCase());
        $scope.newContainerNumber = '';
      };

      $scope.canSearch = function(){
        return $scope.containers.length !== 0;
      };

      $scope.remove = function(container){
        if(confirm('Remove selected container [' + container + ']?')){
          $scope.containers = _.without($scope.containers, container);
        }
      };

      $scope.reset = function(){
        if(confirm('Remove all containers?')){
          $scope.containers = [];
        }
      };

      $scope.search = function(){
        parameterService.setParameter('containers', $scope.containers);
        $location.path('/results');
      };
    }
  );
})(SearchApp);