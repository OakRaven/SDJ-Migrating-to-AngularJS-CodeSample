(function(app){
  'use strict';

  app.factory('_', function() {
    return window._;
  });

  app.service('searchService', function(){
    this.searchParameters = { };

    this.setParameter = function(parameter, value){
      this.searchParameters[parameter] = value;
    };

    this.getParameter = function(parameter){
      return this.searchParameters[parameter];
    };
  });

})(SearchApp);