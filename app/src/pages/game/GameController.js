(function(){

  angular
       .module('game')
       .controller('GameController', [
          'gameService', '$route', '$scope', '$http', '$mdBottomSheet','$mdDialog', '$q',
          GameController
       ]);

  /**
   * About Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
    

  function GameController( gameService, $route, $scope, $http, $mdBottomSheet, $mdDialog, $q) {
    var self = this;

    self.content = {};
    self.showContactOptions = showContactOptions;
    self.counter = 0;
    self.myTurn = true;
    self.thisTurn = '9';
    self.victory = false;  
    self.youLose = false;
    gameService
          .loadContent()
          .then( function( content ) {
            self.content    = content;
          });

    self.placeTile = function(position){
      if(self.myTurn == true){
         console.log(position)
            self.myTurn = false;
            self.thisTurn = position; 
            self.content.board[position] = 'x'
        }else if(position == self.thisTurn){
             self.content.board[position] = ''
             self.myTurn = true; 
            self.thisTurn = 9
        }
     }  ;
      
    self.submitMove = function(){
        if(self.whoWon('x')){self.victory = true;
                               self.message = 'You Won!';
                               }
        else{
        gameService.getMove(self)
                .then(function(move) {
                                    self.content.board[move] = 'O'
                                    return move;},
                        function(move) {self.Message = "request flat failed"}
                )
                .then(function (move) {
            self.counter = 0;
            if(!self.whoWon('O')){
                   self.myTurn = true; 
                    self.thisTurn = 9}
                 else{ 
                    self.youLose = true;}
              });  
        }
     };
    
    self.newGame = function(){
      $route.reload();
     }  ;  
      
    self.whoWon =function(player){
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
    }

    self.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('This Game Has Ended!')
          .textContent('Also, it was so interesting we are archiving it in "The Big Server in the Sky"')
          .ariaLabel('well thats over')
          .targetEvent(ev)
          .ok('Start a new game')
          .cancel('Reflect on this one');

    $mdDialog.show(confirm).then(function() {
      $route.reload();
    }, function() {
      self.message = 'interesting';
    });
  };
    
    $scope.$watch(function () {
        if(self.victory==true){
            self.message='You Won!'
            return true;
        }else if(self.youLose == true){
            self.message='You Lost!'
            return true;
        }
       return false;
   },function(value){
        if(value==true){
        console.log(self.message)
        self.showConfirm()
        gameService.submitBoard(self)}
   });
    /**
     * Show the bottom sheet
     */
    function showContactOptions($event) {
        var user = self.selected;

        return $mdBottomSheet.show({
          templateUrl: './src/pages/about/view/share.html',
          controller: [ '$mdBottomSheet', ContactPanelController],
          controllerAs: "cp",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          clickedItem && $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * Bottom Sheet controller for the Avatar Actions
         */
        function ContactPanelController( $mdBottomSheet ) {
          this.user = user;
          this.actions = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
          ];
          this.submitContact = function(action) {
            $mdBottomSheet.hide(action);
          };
        }
    }
  }
})();
