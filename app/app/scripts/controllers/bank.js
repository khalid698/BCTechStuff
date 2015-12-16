'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:BankCtrl
 * @description
 * # BankCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('BankCtrl', function ($log) {
    var self = this;

    self.signUp = function() {
      $log.info("doing things!");
    };

  });
