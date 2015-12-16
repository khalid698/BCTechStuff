'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AssertCtrl
 * @description
 * # AssertCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('AssertCtrl', function ($log, Identity) {
      var self = this;

      self.assertionType = 'name';
      self.assertionValue = undefined;

      self.assert = function() {
        $log.info('Asserting '+self.assertionType+' : '+self.assertionValue);
        Identity.generateAssertion(self.assertionType, self.assertionValue);
      };

  });
