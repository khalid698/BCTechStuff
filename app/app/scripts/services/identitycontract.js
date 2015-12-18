'use strict';

/**
 * @ngdoc service
 * @name angularApp.IdentityContract
 * @description
 * # IdentityContract
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('IdentityContract', function ($log, pgp, CryptoWrapper, Web3) {

    var self = this;

    self.contractAbi = [{'constant':false,'inputs':[],'name':'kill','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'},{'name':'key','type':'string'},{'name':'value','type':'string'}],'name':'assert','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'publicKey','type':'string'},{'name':'requestedAssertions','type':'uint256[]'}],'name':'request','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'}],'name':'get','outputs':[{'name':'key','type':'string'},{'name':'value','type':'string'}],'type':'function'},{'inputs':[],'type':'constructor'},{'anonymous':false,'inputs':[{'indexed':false,'name':'requestee','type':'address'},{'indexed':false,'name':'publicKey','type':'string'},{'indexed':false,'name':'assertionTypes','type':'uint256[]'}],'name':'DataRequested','type':'event'}];

    self.contractBytes = '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b6107bd8061003f6000396000f36060604052361561005e576000357c01000000000000000000000000000000000000000000000000000000009004806341c0e1b51461006b57806348e724dd1461007a57806361f57cd9146101205780639507d39a146101ba5761005e565b6100695b610002565b565b005b610078600480505061029d565b005b61011e6004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610331565b005b6101b86004808035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505090909190803590602001908201803590602001919190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509090919050506106cf565b005b6101d06004808035906020019091905050610529565b6040518080602001806020018381038352858181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102345780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561028d5780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561032e57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156105235760406040519081016040528083815260200182815260200150600160005060008581526020019081526020016000206000506000820151816000016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061040e57805160ff191683800117855561043f565b8280016001018555821561043f579182015b8281111561043e578251826000505591602001919060010190610420565b5b50905061046a919061044c565b80821115610466576000818150600090555060010161044c565b5090565b50506020820151816001016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106104c157805160ff19168380011785556104f2565b828001600101855582156104f2579182015b828111156104f15782518260005055916020019190600101906104d3565b5b50905061051d91906104ff565b8082111561051957600081815060009055506001016104ff565b5090565b50509050505b5b505050565b60206040519081016040528060008152602001506020604051908101604052806000815260200150600160005060008481526020019081526020016000206000506000016000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106045780601f106105d957610100808354040283529160200191610604565b820191906000526020600020905b8154815290600101906020018083116105e757829003601f168201915b505050505091508150600160005060008481526020019081526020016000206000506001016000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106c05780601f10610695576101008083540402835291602001916106c0565b820191906000526020600020905b8154815290600101906020018083116106a357829003601f168201915b5050505050905080505b915091565b7f131898d7cff6f49c19cbb3139c3fca1e54ee513f9daf1ccbdc7788b61642a032338383604051808473ffffffffffffffffffffffffffffffffffffffff16815260200180602001806020018381038352858181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156107735780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190602002808383829060006004602084601f0104600f02600301f1509050019550505050505060405180910390a15b505056';

    self.assertionTypes = {
      name: {id:1 , label: 'Name'},
      dob: {id:2, label: 'Date of birth'}
    };

    self.createIdentityClient = function(identity, address){ return Web3.getContract(identity, self.contractAbi, address); } ;

    self.createContract = function(identity, callback){
        $log.info("Creating contract for ", identity);
        $log.info("Using from address", identity.ethAddress());
        var web3 = Web3.createSignedWeb3(identity);
        var identityContract = web3.eth.contract(self.contractAbi);
        identityContract.new({
          from: identity.ethAddress(),
          data: self.contractBytes,
          gas: 3000000,
          gasPrice: Web3.gasPrice
         }, callback);
    };

    self.assert = function(identity, assertionType, assertionValue) {
      // Generate unique enryption key for this assertion
      var sessionKey = CryptoWrapper.randomKey();
      // Encrypt assertion with generated random key
      var encryptedAssertion = CryptoWrapper.encryptValue(assertionValue, sessionKey);
      // Encrypt session key to self
      pgp.encryptMessage(identity.pgp, sessionKey).then(function (encryptedSessionKey){
          // $log.info(encrypted);
          $log.info('Storing assertionType:"'+assertionType+'"" with key "'+sessionKey+'"" and value "'+assertionValue+'"" to contract at : '+identity.contractAddress);
          return self.createIdentityClient(identity, identity.contractAddress).assert( assertionType, encryptedSessionKey, encryptedAssertion, {gas: 3000000, gasPrice: Web3.gasPrice}, function(e,res){
            if (e) { $log.info(e); }
            if (res) { $log.info(res); }
          });
      }).then(function(result){
        $log.info(result);
      });
    };

    // Address is passed in since it can differ from the identity address
    self.readAssertion = function(identity, identityAddress, assertionType, callback){
      var internalCallback = function(e,result){
        if(e){
          $log.warn(e);
        } else if (result.lastIndexOf("") !== -1 ){
          $log.warn("Got one or more empty responses from contract, read failed");
        } else {
          $log.debug(result);
          pgp.decryptMessage(identity.pgp, pgp.message.readArmored(result[0])).then(function(decryptedSessionKey){
             var decryptedAssertion = CryptoWrapper.decryptStringValue(result[1], decryptedSessionKey);
             callback(decryptedAssertion);
          });
        }
      };
      self.createIdentityClient(identity, identityAddress).get.call(assertionType, internalCallback);
    };

    self.deleteContract = function(identity, callback){
      self.createIdentityClient(identity, identity.contractAddress).kill({gas: 3000000, gasPrice: Web3.gasPrice}, callback);
    };
  });
