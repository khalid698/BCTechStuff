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

    self.contractAbi = [{'constant':false,'inputs':[],'name':'kill','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'},{'name':'key','type':'string'},{'name':'value','type':'string'}],'name':'assert','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'}],'name':'attest','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'}],'name':'get','outputs':[{'name':'key','type':'string'},{'name':'value','type':'string'}],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'},{'name':'grantee','type':'address'},{'name':'key','type':'string'}],'name':'grant','outputs':[],'type':'function'},{'constant':false,'inputs':[],'name':'mortal','outputs':[],'type':'function'}];

    self.contractBytes = '60606040526108ee806100126000396000f360606040523615610074576000357c01000000000000000000000000000000000000000000000000000000009004806341c0e1b51461007657806348e724dd146100855780634af6ffc21461012b5780639507d39a146101435780639604a66314610226578063f1eae25c1461028e57610074565b005b61008360048050506104c3565b005b6101296004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505090909190505061029d565b005b6101416004808035906020019091905050610557565b005b6101596004808035906020019091905050610748565b6040518080602001806020018381038352858181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101bd5780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102165780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b61028c6004808035906020019091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610600565b005b61029b6004805050610495565b005b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561048f5760406040519081016040528083815260200182815260200150600160005060008581526020019081526020016000206000506000820151816000016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061037a57805160ff19168380011785556103ab565b828001600101855582156103ab579182015b828111156103aa57825182600050559160200191906001019061038c565b5b5090506103d691906103b8565b808211156103d257600081815060009055506001016103b8565b5090565b50506020820151816001016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061042d57805160ff191683800117855561045e565b8280016001018555821561045e579182015b8281111561045d57825182600050559160200191906001019061043f565b5b509050610489919061046b565b80821115610485576000818150600090555060010161046b565b5090565b50509050505b5b505050565b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561055457600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b6002600050600082815260200190815260200160002060005080548060010182818154818355818115116105bd578183600052602060002091820191016105bc919061059e565b808211156105b8576000818150600090555060010161059e565b5090565b5b5050509190906000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550505b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561074257806003600050600085815260200190815260200160002060005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106106e357805160ff1916838001178555610714565b82800160010185558215610714579182015b828111156107135782518260005055916020019190600101906106f5565b5b50905061073f9190610721565b8082111561073b5760008181506000905550600101610721565b5090565b50505b5b505050565b60206040519081016040528060008152602001506020604051908101604052806000815260200150600160005060008481526020019081526020016000206000506000016000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108235780601f106107f857610100808354040283529160200191610823565b820191906000526020600020905b81548152906001019060200180831161080657829003601f168201915b505050505091508150600160005060008481526020019081526020016000206000506001016000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108df5780601f106108b4576101008083540402835291602001916108df565b820191906000526020600020905b8154815290600101906020018083116108c257829003601f168201915b5050505050905080505b91509156';

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

    self.createIdentityClient = function(keyStore, address){
      var web3 = self.createSignedWeb3(keyStore);
      var identityContract = web3.eth.contract(self.contractAbi);
      return identityContract.at(address);
    };

    self.getBalance = function(address) {
        return self.createWeb3().eth.getBalance(address);
    };

    self.createContract = function(keyStore, address, callback){
        var web3 = self.createSignedWeb3(keyStore, address);
        var identityContract = web3.eth.contract(self.contractAbi);
        identityContract.new({
         from: keyStore.getAddresses()[0],
         data: self.contractBytes,
         gas: 3000000,
         gasPrice: 200000
        }, callback);
    };

    self.deleteContract = function(keyStore, address){
      self.createIdentityClient(keyStore, address).kill({gas: 3000000, gasPrice: 200000}, function(e,res){ $log.info(e); $log.info(res);});
    };

    /**
    * This maps to the contract on ehtereum, typically wrapped behind the identity asser which does more encryption.
    */
    self.assert = function(keyStore, address, assertionType, assertionKey, assertionValue){
      $log.info('Storing '+assertionType+' with key '+assertionKey+' and value '+assertionValue+' to contract at '+address);
      self.createIdentityClient(keyStore, address).assert( assertionType, "foo", "bar", {gas: 3000000, gasPrice: 200000}, function(e,res){
        if (e) { $log.info(e); };
        if (res) { $log.info(res);};
      });
    };

    self.get = function(keyStore, address, assertionType){
      $log.info('Querying '+assertionType+' on contract at '+keyStore.getAddresses()[1]);
      var res = self.createIdentityClient(keyStore, address).get.call(assertionType);
      $log.info(res);
    };

    $log.info(this);
  });
