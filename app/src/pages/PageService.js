(function(){
  'use strict';
  angular.module('page', [ ]);
  angular.module('page')
         .service('pageService', ['$q', PageService]);

  /**
   * About DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadContent: Function}}
   * @constructor
   */
  function PageService($q){
    var self = this;
    this.title
    this.description

    // Promise-based API
    return {
      loadContent : function() {
        // Simulate async nature of real remote calls
        return $q.when(data);
      }
    };
  }

})();