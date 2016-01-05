'use strict';

/**
 * @ngdoc service
 * @name angularApp.Web3
 * @description
 * # Web3
 * Service in the angularApp.
 */

var Web3 = require('web3');

angular.module('angularApp')
  .service('Web3', function ($q, $log, $timeout, Config) {
  var self = this;
  self.gasPrice = 200000;

  self.getBalance = function(address) {
      return self.createWeb3().eth.getBalance(address);
  };

  self.createWeb3 = function() {
    var web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(Config.gethEndpoint));
    return web3;
  };

  self.createSignedWeb3 = function(identity){
    var web3 = self.createWeb3();
    var provider = new window.HookedWeb3Provider({
        host: Config.gethEndpoint,
        transaction_signer: identity.eth});
    web3.setProvider(provider);
    web3.eth.defaultAccount = identity.ethAddress();
    return web3;
  };

  self.getContract = function(identity, abi, address){
    var web3 = self.createSignedWeb3(identity);
    var contract = web3.eth.contract(abi);
    return contract.at(address);
  };

  self.createContract = function(identity, contractAbi, contractBytes, callback){
    var web3 = Web3.createSignedWeb3(identity);
    var contract = web3.eth.contract(contractAbi);
    contract.new({
     from: identity.ethAddress(),
     data: contractBytes,
     gas: 3000000,
     gasPrice: self.gasPrice
    }, callback);
  };

  self.giveEther = function(identity){
    var web3 = self.createWeb3();
    var promise = $q.defer();
    $log.debug("Transfering from",web3.eth.coinbase,"to",identity.ethAddress());
    web3.eth.sendTransaction({from: web3.eth.coinbase, to: identity.ethAddress(), value: web3.toWei(1, "ether")},
      self.web3PromiseResolver(promise));
    return promise.promise.then(function(tx){
        return self.watchTransaction(identity, tx);
    });
  };

  // Callbank function to resolve promise with web3 result.
  self.web3PromiseResolver = function(promise){
    return function(e,r){
      if(e){
        $log.error("got error from web3, rejecting promise",e);
        promise.reject(e);
      } else {
        promise.resolve(r);
      }
    };
  };

  /**
  * Returns promise that resolves when the given transaction is mined
  */
  self.watchTransaction = function(identity, transaction){
    $log.debug("Watching transaction", transaction," using from address ", identity.ethAddress());
    return new Promise(function(resolve){
      var web3 = self.createWeb3();
      var resolveWhenDone = function(){
        var tx = web3.eth.getTransaction(transaction);
        // $log.debug("Current transaction", tx);
        if (tx && tx.blockHash){
          $log.debug("Transaction", tx.hash," mined on block ",tx.blockNumber);
          resolve(transaction);
        } else {
          $timeout(resolveWhenDone, 1000);
        }
      };
      resolveWhenDone();
    }
    );
    };
});
