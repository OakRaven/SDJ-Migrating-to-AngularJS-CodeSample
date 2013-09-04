(function(app){
  'use strict';

  app.service('dataService', function($http, _){
    var containerData = null;

    var promise = $http.get('js/sample-data.json').success(function(data){
      containerData = data;
    });

    function search(containerNumbers){
      var results = [];
      _.each(containerNumbers, function(containerNumber){
        var container = _.findWhere(containerData, { 'Container': containerNumber });
        if(container){
          results.push(container);
        }
      });

      return results;
    }

    return {
      promise: promise,
      setData: function(data){
        containerData = data;
      },
      search: search
    };
  });

})(SearchApp);