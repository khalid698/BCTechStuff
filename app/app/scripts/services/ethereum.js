'use strict';

/**
 * @ngdoc service
 * @name angularApp.Ethereum
 * @description
 * # Ethereum
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('Ethereum', function (LocalUser, web3) {
    var self = this;

    self.getBalance = function() {
        var address = LocalUser.getAddress();
        return web3.eth.getBalance(address);
    };

  });
