(function(){
  'use strict';

  angular.module('game')
         .service('gameService', ['$http', '$q', '$timeout' ,GameService]);

  /**
   * About DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadContent: Function
                getMove: Function
                submitBoard: Function
    }}
   * @constructor
   */
  function GameService($http, $q, $timeout){
    var data = {
      title: 'ArcToe',
      description: "We're still naming things Arc.X right?",
      board: {
        "0": '',
        "1": '',
        "2": '',
        "3": '',
        "4": '',
        "5": '',
        "6": '',
        "7": '',
        "8": '',
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
                if(self.content.board[data.move_position]== ''){
                    deferred.resolve(data.move_position);
                }else{
                    if (self.counter < 4) {
                        deferred.resolve(GetMove(self))
                        }else{
                        $timeout( function(){
                            console.log('Enforcing Rate Limiting')
                            self.counter = 0;
                        }, 5000 ).then(function(){deferred.resolve(GetMove(self))})
                        
                    }
                    }
             },
             function(response) {
                deferred.reject(false);
              })
           return deferred.promise;
        }
    
     var SubmitBoard =  function(board){
            var self = board
             var deferred = $q.defer();
         var data = {"final_board": self.content.board}
        self.counter++ 
         $http.put('https://gnswrchqte.execute-api.us-west-2.amazonaws.com/prod/putboard',data)
            .then(
             function (response) {
                console.log('game has been submitted')
                    deferred.resolve('game could not be submitted');
               
             },
             function(response) {
                 console.log('game could not be submitted')
                deferred.reject('game could not be submitted');
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
        ,
        submitBoard: SubmitBoard
    };
  }

})();
