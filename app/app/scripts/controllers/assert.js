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

      $scope.assertionType = 'name`';
      $scope.assertionTypes = ['name', 'dob'];
      $scope.assertionValue = '';

      self.assert = function() {
        $log.info('Asserting '+$scope.assertionType+' : '+$scope.assertionValue);
        Notification.primary('Asserting '+$scope.assertionType+' : '+$scope.assertionValue);
        IdentityContract.assert($rootScope.selectedIdentity, $scope.assertionType, $scope.assertionValue);
      };

      self.read = function() {
        var callback = function(value){
          $log.info('Got assertion value : '+value);
          Notification.success('Got assertion value : '+value);
          $scope.assertionValue = value;
          $scope.$apply();
        };
        $log.info('Reading '+$scope.assertionType+' from contract');
        Notification.primary('Reading '+$scope.assertionType+' from contract');
        IdentityContract.readAssertion($rootScope.selectedIdentity, $rootScope.selectedIdentity.contractAddress, $scope.assertionType, callback);
      };

  });
