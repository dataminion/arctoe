(function(){

  angular
       .module('game')
       .controller('GameController', [
          'gameService', '$route', '$scope', '$http', '$mdDialog', '$mdToast', '$q',
          GameController
       ]);

  /**
   * ArcToe Game Controller
   */
    

  function GameController( gameService, $route, $scope, $http, $mdDialog, $mdToast, $q) {
    var self = this;
    //if a game is submitted don't let it be submitted again
    self.submitted = false;

    //manage the state of the click box
    self.myTurn = true;
    self.thisTurn = '9';
      
    //End Game conditions  
    self.victory = false;  
    self.youLose = false;
    self.stalemate =false;  
    
    //API request in progress   
    self.computer = false;
    self.counter = 0;  
      
    //Holder for system messages
    self.message;
    
    //allow the selection of a move but also allow that move to be unclicked until confirmed  
    self.placeTile = function(position){
      if(self.myTurn == true){
            self.myTurn = false;
            self.thisTurn = position; 
            self.content.board[position] = 'x'
        }else if(position == self.thisTurn){
             self.content.board[position] = ''
             self.myTurn = true; 
            self.thisTurn = 9
            self.toastTurn('Still your turn!');
        }
     }  ;
    
    //commit the players move and request a move from the computer  
    self.submitMove = function(){
        if(self.whoWon('x')){self.victory = true;}
        else{
        self.computer = true;    
        gameService.getMove(self)
                .then(function(move) {
                                    self.content.board[move] = 'O'
                                    return move;},
                        function(move) {self.toastTurn('Something is wrong with the server');}
                )
                .then(function (move) {
            self.counter = 0;
            if(!self.whoWon('O')){
                   self.myTurn = true; 
                    self.thisTurn = 9
                    self.toastTurn("It's your turn again!");
                    }
                 else{ 
                    self.youLose = true;}
            self.computer = false;
              });  
        }
     };
    
    self.newGame = function(){
      location.reload();
     }  ;  
      
      
    //Check to see if someone has won  
    self.whoWon =function(player){   
        //all of the possible winning games.
        if(self.content.board[0] == player &&  self.content.board[1]  == player && self.content.board[2]  == player ){
              return true;
          }
        else if(self.content.board[3] == player &&  self.content.board[4]  == player && self.content.board[5]  == player ){
              return true;
          }
        else if(self.content.board[6] == player &&  self.content.board[7]  == player && self.content.board[8]  == player ){
              return true;
          }
        else if(self.content.board[0] == player &&  self.content.board[4]  == player && self.content.board[8]  == player ){
              return true;
          }
        else if(self.content.board[6] == player &&  self.content.board[4]  == player && self.content.board[2]  == player ){
              return true;
          }
        else if(self.content.board[0] == player &&  self.content.board[3]  == player && self.content.board[6]  == player ){
              return true;
          }
        else if(self.content.board[1] == player &&  self.content.board[4]  == player && self.content.board[7]  == player ){
              return true;
          }
        else if(self.content.board[2] == player &&  self.content.board[5]  == player && self.content.board[8]  == player ){
              return true;
          }
        else{
            //test for stalemate
            var state =true;
            var output = Object.keys(self.content.board).forEach(function(key) {
                if(self.content.board[key] == ''){
                    state = false}
            });
             self.stalemate = state; 
          }
    }  

    //Monitors for an end game state  
    $scope.$watch(function () {
        if(self.victory==true){
            self.message = 'You Won!';
            return true
        }else if(self.youLose == true){
            self.message = 'You Lost!';
            return true
        }
        else if(self.stalemate==true){
            self.message = 'Stale Mate!';
            return true
        }
       return false;
   },function(value){
        if(value==true && self.submitted == false){
        self.toastTurn(self.message)    
        self.showConfirm()
        gameService.submitBoard(self)
        self.submitted = true
   }});
     
    //Displays the end game Modal  
    self.showConfirm = function(ev) {
        var confirm = $mdDialog.confirm()
              .title('This Game Has Ended!')
              .textContent('Also, it was so interesting we are archiving it in "The Big Server in the Sky"')
              .ariaLabel('well thats over')
              .targetEvent(ev)
              .ok('Start a new game')
              .cancel('Reflect on this one');

        $mdDialog.show(confirm).then(function() {
          location.reload();
        }, function() {
          self.message = 'interesting';
    });
  };  
      
     //General toaster to display system messages 
   self.toastTurn = function(message) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(message)
        .position('top right')
        .hideDelay(3000)
    );
  };  
      
      
    self.content = {};
    gameService
          .loadContent()
          .then( function( content ) {
            self.content    = content;
          });
  }
})();
