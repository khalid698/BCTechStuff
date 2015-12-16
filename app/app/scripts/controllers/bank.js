'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:BankCtrl
 * @description
 * # BankCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('BankCtrl', function ($log, ngProgressFactory, $scope) {
    var self = this;
    $scope.progressbar = ngProgressFactory.createInstance();

    self.signUp = function() {
      // $log.info("doing things!");
      $scope.progressbar.start();
    };

  });
