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
  .service('Web3', function (Config) {
  var self = this;
  self.gasPrice = 200000;

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

});
