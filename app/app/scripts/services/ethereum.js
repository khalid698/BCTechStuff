'use strict';

/**
 * @ngdoc service
 * @name angularApp.Ethereum
 * @description
 * # Ethereum
 * Service in the angularApp.
 */

angular.module('angularApp')
  .service('Ethereum', function (Web3) {
    var self = this;

    self.getBalance = function(address) {
        return Web3.createWeb3().eth.getBalance(address);
    };

});
