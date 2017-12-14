(function(){
  'use strict';

  angular.module('game')
         .config(['$routeProvider', '$locationProvider', GameRoutes]).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
  $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
  $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});

  function GameRoutes($routeProvider, $locationProvider, $q){
    $routeProvider
      .when('/game', {
        templateUrl: './src/pages/game/view/content.html',
        controller: 'GameController',
        controllerAs: 'page'
      });
  }

})();
