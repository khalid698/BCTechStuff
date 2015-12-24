'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:IdentitiesCtrl
 * @description
 * # IdentitiesCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('IdentitiesCtrl', function ($log, $rootScope, Identity, Notification) {
    var self = this;

    self.selected = undefined;
    self.bank = undefined;


    self.getIdentities = Identity.getIdentities;

    self.selectIdentity = function(){
      $rootScope.selectIdentity(self.selected);
    };
    self.selectBankIdentity = function(){
      $rootScope.selectBankIdentity(self.bank);
    };

    self.init = function() {
      if ( $rootScope.selectedIdentity){
        self.selected = $rootScope.selectedIdentity.email;
      }
      if ( $rootScope.bankIdentity){
        self.bank = $rootScope.bankIdentity.email;
      }
    };

    self.init();

  });
