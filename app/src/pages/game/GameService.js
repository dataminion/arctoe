(function(){
  'use strict';

  angular.module('game')
         .service('gameService', ['$http', '$q', '$timeout' ,GameService]);

  /**
   * About DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadContent: Function}}
   * @constructor
   */
  function GameService($http, $q, $timeout){
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
    
    var GetMove =  function(board){
            var self = board
             var deferred = $q.defer();
        self.counter++ 
         $http.get('https://zpj6onnvm5.execute-api.us-west-2.amazonaws.com/prod/getmove')
            .then(
             function (response) {
                data = angular.fromJson(response.data)
                console.log(data.move_position)
                if(self.content.board[data.move_position]== '_'){
                    deferred.resolve(data.move_position);
                }else{
                    if (self.counter < 4) {
                        deferred.resolve(GetMove(self))
                        }else{
                        $timeout( function(){
                            console.log('throttling loop')
                            self.counter = 0;
                        }, 5000 ).then(function(){deferred.resolve(GetMove(self))})
                        
                    }
                    }
                console.log(response)
             },
             function(response) {
                deferred.reject(false);
              })
           return deferred.promise;
        }
    
    // Promise-based API
    return {
      loadContent : function() {
        // Simulate async nature of real remote calls
        return $q.when(data);
      },
        getMove: GetMove
    };
  }

})();
