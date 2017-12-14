(function(){

  angular
       .module('game')
       .controller('GameController', [
          'gameService', '$http', '$mdBottomSheet', '$q',
          GameController
       ]);

  /**
   * About Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
    

  function GameController( gameService, $http, $mdBottomSheet, $q) {
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
             self.content.board[position] = '_'
             self.myTurn = true; 
            self.thisTurn = 9
        }
     }  ;
      
    self.submitMove = function(){
        $http.get('https://zpj6onnvm5.execute-api.us-west-2.amazonaws.com/prod/getmove')
            .then(function (response) {
            data = angular.fromJson(response.data)
            console.log(data.move_position)
            if(self.content.board[data.move_position]== '_'){
                self.content.board[data.move_position] = 'O'
            }
        console.log(response)
      }).then(function () {
            if(!self.whoWon('O')){
           self.myTurn = true; 
            self.thisTurn = 9}
         else{ 
            self.youLose = true;}
      });
        
        
     };
    
    self.checkWin= function(player)
      {if(self.whoWon(player)){self.victory = true}}
    
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
      

    /*winning games
    
   

    
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