'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AssertCtrl
 * @description
 * # AssertCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('IdentityCtrl', function ($log, $rootScope, $scope, $state, IdentityContract, Identity, Notification) {
      var self = this;

      self.assertionType = $rootScope.assertionTypes[0];
      self.assertionValue = '';

      // Store request params
      //$log.info($state.params);
      self.request = {
        requestee: $state.params.requestee,
        assertionTypes: $state.params.assertionTypes,
      };

      self.assert = function() {
        $log.info('Asserting '+self.assertionType.label+' : '+self.assertionValue);
        Notification.primary('Asserting '+self.assertionType.label+' : '+self.assertionValue);
        IdentityContract.assert($rootScope.selectedIdentity, self.assertionType.id, self.assertionValue);
      };

      self.read = function() {
        $log.info('Reading '+self.assertionType.label+' from contract');
        IdentityContract.readAssertion($rootScope.selectedIdentity, $rootScope.selectedIdentity.contractAddress, self.assertionType.id)
          .then(function(decryptedAssertion){
              Notification.success('Got assertion value : '+decryptedAssertion);
              $log.info('Got assertion value : '+decryptedAssertion);
              self.assertionValue = decryptedAssertion;
              $scope.$apply();
          });
        Notification.primary('Reading '+self.assertionType.label+' from contract');
      };

      self.grantRequest = function() {
        var grantee = Identity.get(self.request.requestee);
        IdentityContract.grant($rootScope.selectedIdentity, grantee, self.request.assertionTypes);
      };


  });
