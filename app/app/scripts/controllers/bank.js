'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:BankCtrl
 * @description
 * # BankCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('BankCtrl', function ($log, $scope, $rootScope, IdentityContract) {
    var self = this;

    self.grantedAssertions = [];

    self.loadGrantedAssertions = function() {
      IdentityContract.readGrantedAssertions($rootScope.bankIdentity, $rootScope.selectedIdentity )
        .then(function(res){
          self.grantedAssertions = res;
        });
    };
    self.loadGrantedAssertions();

  });
