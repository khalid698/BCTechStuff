'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AssertCtrl
 * @description
 * # AssertCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('AssertCtrl', function ($log, $scope, Identity) {
      var self = this;

      $scope.assertionType = '';
      $scope.assertionTypes = ['name', 'dob'];
      $scope.assertionValue = '';

      self.assert = function() {
        $log.info('Asserting '+$scope.assertionType+' : '+$scope.assertionValue);
        Identity.generateAssertion($scope.assertionType, $scope.assertionValue);
      };

      self.read = function() {
        var callback = function(value){
          $log.info('Got assertion value : '+value);
          $scope.assertionValue = value;
          $scope.$apply();
        };
        $log.info('Reading '+$scope.assertionType+' from contract');
        Identity.readAssertion($scope.assertionType, callback);
      };

  });
