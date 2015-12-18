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

    // Progress bar
    // self.numberOfSteps = 3;
    // self.step = 1;
    // self.progess = 0;
    // Identities
    self.bankIdentity = undefined;
    self.userIdentity = undefined;

    // self.updateProgress = function(){
    //   self.progess = Math.round((self.step / self.numberOfSteps) * 100);
    // }

    // self.updateProgress();
  });
