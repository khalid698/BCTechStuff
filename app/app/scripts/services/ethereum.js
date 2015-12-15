'use strict';

/**
 * @ngdoc service
 * @name angularApp.Ethereum
 * @description
 * # Ethereum
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('Ethereum', function (LocalUser) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var Web3 = require('web3');
    var web3 = new Web3();

    var self = this;

    self.getBalance = function() {
        var address = LocalUser.getAddress();
        return web3.eth.getBalance(address);
    };

  });
