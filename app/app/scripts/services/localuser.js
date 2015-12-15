'use strict';

/**
 * @ngdoc service
 * @name angularApp.LocalUser
 * @description
 * # LocalUser
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('LocalUser', function () {
    var self = this;
    self.getAddress = function() {
      return '0x0';
    };

  });
