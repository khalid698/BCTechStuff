'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('MainCtrl', function (Identity) {
    var self=this;

    self.generateKey = function() {
      Identity.GenerateKey();
    };

  });
