'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('MainCtrl', function (Identity, LocalUser) {
    var self=this;

    self.localUser = LocalUser;

    self.generateKey = function() {
      Identity.GenerateKey();
    };

  });
