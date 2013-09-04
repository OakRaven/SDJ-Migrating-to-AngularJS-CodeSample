(function(app){
  'use strict';

  app.factory('parameterService', function(){
    var parameters = {};

    function setParameter (key, value){
      parameters[key] = value;
    }

    function getParameter(key){
      return parameters[key];
    }

    return {
      setParameter: setParameter,
      getParameter: getParameter
    };
  });
})(SearchApp);