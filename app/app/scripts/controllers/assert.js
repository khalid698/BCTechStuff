'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AssertCtrl
 * @description
 * # AssertCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('AssertCtrl', function ($log, $rootScope, $scope, IdentityContract, Notification) {
      var self = this;

      self.assertionType = '';
      self.assertionValue = '';

      self.assert = function() {
        $log.info('Asserting '+self.assertionType.label+' : '+self.assertionValue);
        Notification.primary('Asserting '+self.assertionType.label+' : '+self.assertionValue);
        IdentityContract.assert($rootScope.selectedIdentity, self.assertionType.id, self.assertionValue);
      };

      self.read = function() {
        var callback = function(value){
          Notification.success('Got assertion value : '+value);
          $log.info('Got assertion value : '+value);
          self.assertionValue = value;
          $scope.$apply();
        };
        $log.info('Reading '+self.assertionType.label+' from contract');
        IdentityContract.readAssertion($rootScope.selectedIdentity, $rootScope.selectedIdentity.contractAddress, self.assertionType.id, callback);
        Notification.primary('Reading '+self.assertionType.label+' from contract');
      };

  });
