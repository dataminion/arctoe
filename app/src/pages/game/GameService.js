(function(){
  'use strict';

  angular.module('game')
         .service('gameService', ['$http', '$q', GameService]);

  /**
   * About DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadContent: Function}}
   * @constructor
   */
  function GameService($http, $q){
    var data = {
      title: 'ArcToe',
      description: "We're still naming things Arc.X right?",
      board: {
        "0": '_',
        "1": '_',
        "2": '_',
        "3": '_',
        "4": '_',
        "5": '_',
        "6": '_',
        "7": '_',
        "8": '_',
    }
    };

    // Promise-based API
    return {
      loadContent : function() {
        // Simulate async nature of real remote calls
        return $q.when(data);
      }
    };
  }

})();
