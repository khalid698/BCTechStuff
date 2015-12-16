'use strict';

/**
 * @ngdoc service
 * @name angularApp.Ethereum
 * @description
 * # Ethereum
 * Service in the angularApp.
 */

var Web3 = require('web3');

angular.module('angularApp')
  .service('Ethereum', function ($log, Config) {
    var self = this;

    self.contractAbi = [{'constant':false,'inputs':[],'name':'kill','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'}],'name':'attest','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'},{'name':'value','type':'string'}],'name':'assert','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'}],'name':'get','outputs':[{'name':'value','type':'string'}],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'},{'name':'grantee','type':'address'},{'name':'key','type':'string'}],'name':'grant','outputs':[],'type':'function'},{'constant':false,'inputs':[],'name':'mortal','outputs':[],'type':'function'}];
    self.contractBytes = '6060604052610699806100126000396000f360606040523615610074576000357c01000000000000000000000000000000000000000000000000000000009004806341c0e1b5146100765780634af6ffc2146100855780636a40acd61461009d5780639507d39a146100fc5780639604a66314610180578063f1eae25c146101e857610074565b005b6100836004805050610225565b005b61009b60048080359060200190919050506103d6565b005b6100fa6004808035906020019091908035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506102b9565b005b61011260048080359060200190919050506105c7565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101725780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101e66004808035906020019091908035906020019091908035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505090909190505061047f565b005b6101f560048050506101f7565b005b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156102b657600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156103d15780600160005060008481526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061037257805160ff19168380011785556103a3565b828001600101855582156103a3579182015b828111156103a2578251826000505591602001919060010190610384565b5b5090506103ce91906103b0565b808211156103ca57600081815060009055506001016103b0565b5090565b50505b5b5050565b60026000506000828152602001908152602001600020600050805480600101828181548183558181151161043c5781836000526020600020918201910161043b919061041d565b80821115610437576000818150600090555060010161041d565b5090565b5b5050509190906000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550505b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156105c157806003600050600085815260200190815260200160002060005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061056257805160ff1916838001178555610593565b82800160010185558215610593579182015b82811115610592578251826000505591602001919060010190610574565b5b5090506105be91906105a0565b808211156105ba57600081815060009055506001016105a0565b5090565b50505b5b505050565b6020604051908101604052806000815260200150600160005060008381526020019081526020016000206000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106885780601f1061065d57610100808354040283529160200191610688565b820191906000526020600020905b81548152906001019060200180831161066b57829003601f168201915b50505050509050610694565b91905056';

    self.createWeb3 = function() {
      var web3 = new Web3();
      web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
      return web3;
    };

    self.createSignedWeb3 = function(keyStore){
      var web3 = self.createWeb3();
      var provider = new window.HookedWeb3Provider({
          host: Config.gethEndpoint,
          transaction_signer: keyStore});
      web3.setProvider(provider);
      web3.eth.defaultAccount = keyStore.getAddresses()[0];
      return web3;
    };

    self.getBalance = function(address) {
        return self.createWeb3().eth.getBalance(address);
    };

    self.createContract = function(keyStore){
        var web3 = self.createSignedWeb3(keyStore);
        // Start paste from http://chriseth.github.io/browser-solidity/
        var identityContract = web3.eth.contract(self.contractAbi);
        identityContract.new({
         from: keyStore.getAddresses()[0],
         to: keyStore.getAddresses()[1],
         data: self.contractBytes,
         gas: 3000000,
         gasPrice: 200000
        }, function(e, contract){
        console.log(e, contract);
        if (typeof contract.address !== 'undefined') {
             console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
        }
         });
        // End paste
    };

    self.storeAssertion = function(keyStore, assertionType, assertionBlob){
      $log.info('Storing '+assertionType+' : '+assertionBlob+' from address '+keyStore.getAddresses()[0]+' to contract at '+keyStore.getAddresses()[1]);
      var web3 = self.createSignedWeb3(keyStore);
      var identityContract = web3.eth.contract(self.contractAbi);
      var identity = identityContract.at(keyStore.getAddresses()[1]);
      identity.assert(assertionType, assertionBlob, {gas: 3000000, gasPrice: 200000}, function(e,res){ $log.info(e); $log.info(res);});
    };

    // self.getAssertion = function(keyStore, assertionType){
    //   var web3 = self.createSignedWeb3(keyStore);
    //   var identityContract = web3.eth.contract(self.contractAbi);
    //   var res = identity.get.call(assertionType);
    //   $log.info(res);
    // };

  });
