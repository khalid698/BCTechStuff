'use strict';

/**
 * @ngdoc service
 * @name angularApp.Ethereum
 * @description
 * # Ethereum
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('Ethereum', function (Identity, web3) {
    var self = this;

    self.getBalance = function() {
        var address = Identity.getAddress();
        if (!address) {
          return undefined;
        }
        return web3.eth.getBalance(address);
    };

    self.storeAssertion = function(){

    };

  });
