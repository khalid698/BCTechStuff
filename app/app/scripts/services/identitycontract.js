'use strict';

/**
 * @ngdoc service
 * @name angularApp.IdentityContract
 * @description
 * # IdentityContract
 * Service in the angularApp.
 *
 var identity = angular.element(document.body).injector().get('Identity').get("test")
 var contract = angular.element(document.body).injector().get('IdentityContract')
 *
 */
angular.module('angularApp')
  .service('IdentityContract', function ($log, pgp, CryptoWrapper, Web3, Notification) {

    var self = this;

    self.contractAbi = [{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'assertionType','type':'uint256'},{'name':'sessionKey','type':'string'}],'name':'grant','outputs':[],'type':'function'},{'constant':false,'inputs':[],'name':'kill','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'},{'name':'key','type':'string'},{'name':'value','type':'string'}],'name':'assert','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'assertionType','type':'uint256'}],'name':'getSessionKey','outputs':[{'name':'encryptedSessionKey','type':'string'}],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'}],'name':'get','outputs':[{'name':'key','type':'string'},{'name':'value','type':'string'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'}],'name':'getGrantedAssertionCount','outputs':[{'name':'count','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[],'name':'getGranteeCount','outputs':[{'name':'count','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[{'name':'index','type':'uint256'}],'name':'getGrantee','outputs':[{'name':'grantee','type':'address'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'index','type':'uint256'}],'name':'getGrantedAssertion','outputs':[{'name':'assertionType','type':'uint256'}],'type':'function'},{'inputs':[],'type':'constructor'}];

    self.contractBytes = '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b610dc58061003f6000396000f360606040523615610095576000357c01000000000000000000000000000000000000000000000000000000009004806325faee46146100a257806341c0e1b51461010a57806348e724dd146101195780635fb3fbdb146101bf5780639507d39a1461024c578063a21d0afe1461032f578063e8f1ddb71461035b578063ecdd02971461037e578063fd29f856146103c057610095565b6100a05b610002565b565b005b6101086004808035906020019091908035906020019091908035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506103f5565b005b610117600480505061093d565b005b6101bd6004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506109d1565b005b6101de6004808035906020019091908035906020019091905050610842565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561023e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6102626004808035906020019091905050610c01565b6040518080602001806020018381038352858181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102c65780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561031f5780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b61034560048080359060200190919050506107ad565b6040518082815260200191505060405180910390f35b6103686004805050610752565b6040518082815260200191505060405180910390f35b6103946004808035906020019091905050610765565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103df60048080359060200190919080359060200190919050506107ec565b6040518082815260200191505060405180910390f35b6000600090505b600360005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050805490508160ff16101561049c5782600360005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b5054141561048e57610002565b5b80806001019150506103fc565b81600260005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008581526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061052957805160ff191683800117855561055a565b8280016001018555821561055a579182015b8281111561055957825182600050559160200191906001019061053b565b5b5090506105859190610567565b808211156105815760008181506000905550600101610567565b5090565b5050600360005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080548060010182818154818355818115116106035781836000526020600020918201910161060291906105e4565b808211156105fe57600081815060009055506001016105e4565b5090565b5b5050509190906000526020600020900160005b85909190915055506000905080505b6004600050805490508160ff1610156106ba578373ffffffffffffffffffffffffffffffffffffffff16600460005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156106ac5761074c565b5b8080600101915050610625565b6004600050805480600101828181548183558181151161070c5781836000526020600020918201910161070b91906106ed565b8082111561070757600081815060009055506001016106ed565b5090565b5b5050509190906000526020600020900160005b86909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550505b50505050565b6000600460005080549050905080505b90565b6000600460005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905080505b919050565b6000600360005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080549050905080505b919050565b6000600360005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b5054905080505b92915050565b6020604051908101604052806000815260200150600260005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008381526020019081526020016000206000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561092d5780601f106109025761010080835404028352916020019161092d565b820191906000526020600020905b81548152906001019060200180831161091057829003601f168201915b5050505050905080505b92915050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156109ce57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610a2d57610002565b80600160005060008581526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610a9057805160ff1916838001178555610ac1565b82800160010185558215610ac1579182015b82811115610ac0578251826000505591602001919060010190610aa2565b5b509050610aec9190610ace565b80821115610ae85760008181506000905550600101610ace565b5090565b50508160026000506000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008581526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610b9d57805160ff1916838001178555610bce565b82800160010185558215610bce579182015b82811115610bcd578251826000505591602001919060010190610baf565b5b509050610bf99190610bdb565b80821115610bf55760008181506000905550600101610bdb565b5090565b50505b505050565b60206040519081016040528060008152602001506020604051908101604052806000815260200150600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008481526020019081526020016000206000508054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610d005780601f10610cd557610100808354040283529160200191610d00565b820191906000526020600020905b815481529060010190602001808311610ce357829003601f168201915b505050505091508150600160005060008481526020019081526020016000206000508054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610db65780601f10610d8b57610100808354040283529160200191610db6565b820191906000526020600020905b815481529060010190602001808311610d9957829003601f168201915b5050505050905080505b91509156';

    self.assertionTypes = [
      {id:1, label: 'Name'},
      {id:2, label: 'Date of birth'}
    ];

    self.assertionById = function(id){
      var filter = function(element){
        return element.id.toString() === id.toString();
      };
      return self.assertionTypes.find(filter);
    };

    self.createIdentityClient = function(identity, address){
      return Web3.getContract(identity, self.contractAbi, address);
    };

    // Contract creation / Deletion
    self.createContract = function(identity, callback){
        $log.info("Creating contract for ", identity);
        Notification.primary("Creating contract");
        $log.info("Using from address", identity.ethAddress());
        Notification.info("Using from address: " + identity.ethAddress());
        var web3 = Web3.createSignedWeb3(identity);
        var identityContract = web3.eth.contract(self.contractAbi);
        identityContract.new({
          from: identity.ethAddress(),
          data: self.contractBytes,
          gas: 3000000,
          gasPrice: Web3.gasPrice
         }, callback);
    };

    self.deleteContract = function(identity, callback){
      self.createIdentityClient(identity, identity.contractAddress).kill({gas: 3000000, gasPrice: Web3.gasPrice}, callback);
    };

    // Assertions
    self.assert = function(identity, assertionType, assertionValue) {
      // Generate unique enryption key for this assertion
      var sessionKey = CryptoWrapper.randomKey();
      Notification.info('Generating Session Key: '+sessionKey);
      // Encrypt assertion with generated random key
      var encryptedAssertion = CryptoWrapper.encryptValue(assertionValue, sessionKey);
      Notification.info('Encrypting Assertion: '+encryptedAssertion);
      // Encrypt session key to self
      Notification.info('Encrypting Session Key');
      var callback = function(e){
        if(e){
          Notification.fail("Assertion failed");
        } else {
          Notification.success("Asserted value");
        }
      };
      pgp.encryptMessage(identity.pgp, sessionKey).then(function (encryptedSessionKey){
          $log.info('Storing assertionType:"'+assertionType+'"" with key "'+sessionKey+'"" and value "'+assertionValue+'"" to contract at : '+identity.contractAddress);
          return self.createIdentityClient(identity, identity.contractAddress).assert( assertionType, encryptedSessionKey, encryptedAssertion, {gas: 3000000, gasPrice: Web3.gasPrice}, callback);
      });
    };

    /**
    * Read encrypted assertion
    * grantee can be the owner or a third party,
    */
    self.readAssertion = function(grantee, contractAddress, assertionType){
      return new Promise(function(resolve, reject){
        var internalCallback = function(e,result){
          if(e){
            $log.warn(e);
            reject(e);
          } else if (result.lastIndexOf("") !== -1 ){
            $log.warn("Got one or more empty responses from contract, read failed");
            reject("Got one or more empty responses from contract, read failed");
          } else {
            // $log.debug(result);
            // Notification.info("Decrypting Session Key");
            pgp.decryptMessage(grantee.pgp, pgp.message.readArmored(result[0])).then(function(decryptedSessionKey){
               $log.debug("Decrypted session key", decryptedSessionKey);
               var decryptedAssertion = CryptoWrapper.decryptStringValue(result[1], decryptedSessionKey);
               $log.debug("Decrypted assertion key", decryptedAssertion);
               //callback(decryptedAssertion);
               resolve(decryptedAssertion);
            });
          }
        };
        self.createIdentityClient(grantee, contractAddress).get.call(assertionType, internalCallback);
      });
    };

    /**
    * Read all granted assetions, returns [{assertionType, value}]
    */
    self.readGrantedAssertions = function(identity, target) {
      return new Promise(function(resolve, reject){
          if ( target.contractAddress === undefined){
            reject("Cannot using identity without contractAddress as target in readGrantedAssertions");
            return;
          }
          // Read granted assertion types
          var grants = self.grantsByGrantee(target, identity.ethAddress());
          $log.debug("Got grants ",grants, " on target ", target);
          // Read and decrypt values
          function readEncryptedAssertion(assertionType){
              return self.readAssertion(identity, target.contractAddress, assertionType)
                    .then(function(value){
                          $log.debug("Got assertion value", value);
                          return {
                            assertionType: assertionType,
                            value: value
                          };});
          }
          Promise.all(grants.map(readEncryptedAssertion)).then(function(value){
            $log.info("Loaded decrypted granted assertions", value);
            resolve(value);
          });
        });
    };
    /**
    * Returns the granted assertionTypes on 'identity' for grantee with address 'granteeAddress'
    */
    self.grantsByGrantee = function( identity, granteeAddress) {
        $log.info("Getting grants for ", granteeAddress," on contract at address ", identity.contractAddress);
        // $log.info(identity);
        var contract = self.createIdentityClient(identity, identity.contractAddress);
        var grantedAssertionCount = contract.getGrantedAssertionCount.call(granteeAddress).toNumber();
        $log.debug("Grantee ",granteeAddress, " has ", grantedAssertionCount, "granted assertions");
        var grants = [];
        for(var j=0; j < grantedAssertionCount; j++){
          var assertion = contract.getGrantedAssertion.call(granteeAddress, j).toNumber();
          $log.debug("Grantee ",granteeAddress, " has granted assertion ", assertion);
          grants.push(assertion);
        }
        return grants;
    };

    self.grants = function(identity){
      var grants = [];
      var contract = self.createIdentityClient(identity, identity.contractAddress);
      var numberOfRequestees = contract.getGranteeCount.call().toNumber();
      $log.debug("Number of grantees on ",identity.contractAddress, " : " , numberOfRequestees);
      for (var i=0; i < numberOfRequestees; i++){
          var grant = {};
          grant.requestee = contract.getGrantee.call(i);
          $log.debug("Getting grants for requestee nr ",i," : ", grant.requestee);
          grant.assertions = self.grantsByGrantee(identity, grant.requestee);

          if ( grant.assertions.length > 0 ){
            grants.push(grant);
          }
      }
      $log.debug("Returning ",grants.length, " granted assertion");
      return grants;
    };

    self.grant = function(identity, grantee, assertionTypes){
      var web3 = Web3.createSignedWeb3(identity)
      var batch = web3.createBatch();

      $log.info("Granting assertions ", assertionTypes, " to ", grantee);

      var grantCompleteCallback = function(assertionType){
        Notification.info("Grant of ",assertionType," complete");
      };

      var storeEncryptedSessionKey = function(assertionType, encryptedSessionKey){
        $log.info("Storing encrypted session key for assertionType", assertionType);
              batch.add(self.createIdentityClient(identity, identity.contractAddress)
                        .grant.request(
                            grantee.ethAddress(),
                            assertionType,
                            encryptedSessionKey,
                            {from: identity.ethAddress(), gas: 3000000, gasPrice: Web3.gasPrice},
                            function(e,r){
                              $log.info(e);
                              $log.info(r);
                            }));
              return Promise.resolve();
      };

      var encryptWithGranteePublicKey = function(decryptedSessionKey){
          $log.info("Encrypting session key ", decryptedSessionKey," with grantees public key");
          // Encrypt session with grantee public key
          return pgp.encryptMessage(grantee.pgp, decryptedSessionKey);
      };

      var readEncryptedSessionKey = function(assertionType){
          $log.debug("Reading encrypted session key for assertionType", assertionType);
          var assertion = self.createIdentityClient(identity, identity.contractAddress).get.call(assertionType);
          if(assertion.indexOf("") !== -1){
            return Promise.reject("Cannot grant nonexisting assertion");
          } else {
            return pgp.decryptMessage(identity.pgp, pgp.message.readArmored(assertion[0])).then(function(sessionKey){
              $log.debug("Decrypted session key for assertionType ",assertionType," : ", sessionKey);
              return sessionKey;
            })
          }
      };

      Promise.all(assertionTypes.map(function(assertionType){
          return readEncryptedSessionKey(assertionType)
            .then(encryptWithGranteePublicKey)
            .then(function(encryptedSessionKeyForGrantee){ return storeEncryptedSessionKey(assertionType,encryptedSessionKeyForGrantee);});
      })).then(function(){
        // Wait for all decryption/encrytion promises to complete, once done execute the batch
        $log.debug("Executing batch with ",batch.requests.length," items");
        batch.execute();
      })
    };

  });
