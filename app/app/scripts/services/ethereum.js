'use strict';

/**
 * @ngdoc service
 * @name angularApp.Ethereum
 * @description
 * # Ethereum
 * Service in the angularApp.
 */

angular.module('angularApp')
  .service('Ethereum', function (Web3, $log, Notification) {
    var self = this;

    self.getBalance = function(address) {
        return Web3.createWeb3().eth.getBalance(address);
    };

    self.sendFunds = function(identity, fromAddress, toAddress, value) {
      //return Web3.createWeb3().;
      //send funds
      var tx = {}
      tx.from = fromAddress;
      tx.to = toAddress;
      tx.value = value;
      tx.gas = 3000000;
      tx.gasPrice = Web3.gasPrice;
      var web3 = Web3.createSignedWeb3(identity);
      web3.eth.sendTransaction(tx, function (e, res){
        if (e) { $log.info(e);
                  Notification.error(e);
                   }
        if (res) { 
          $log.info(res);
          Notification.success("sent "+tx.value+" to "+tx.to);
          }
      });
    };

});
