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

    self.contractAbi = [{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'assertionType','type':'uint256'},{'name':'sessionKey','type':'string'}],'name':'grant','outputs':[],'type':'function'},{'constant':false,'inputs':[],'name':'kill','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'},{'name':'key','type':'string'},{'name':'value','type':'string'}],'name':'assert','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'assertionType','type':'uint256'}],'name':'getSessionKey','outputs':[{'name':'encryptedSessionKey','type':'string'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'}],'name':'revoke','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'}],'name':'get','outputs':[{'name':'key','type':'string'},{'name':'value','type':'string'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'}],'name':'getGrantedAssertionCount','outputs':[{'name':'count','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[],'name':'getGranteeCount','outputs':[{'name':'count','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[{'name':'index','type':'uint256'}],'name':'getGrantee','outputs':[{'name':'grantee','type':'address'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'index','type':'uint256'}],'name':'getGrantedAssertion','outputs':[{'name':'assertionType','type':'uint256'}],'type':'function'},{'inputs':[],'type':'constructor'}]

    self.contractBytes = '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b6111298061003f6000396000f3606060405236156100a0576000357c01000000000000000000000000000000000000000000000000000000009004806325faee46146100ad57806341c0e1b51461011557806348e724dd146101245780635fb3fbdb146101ca57806374a8f103146102575780639507d39a1461026f578063a21d0afe14610352578063e8f1ddb71461037e578063ecdd0297146103a1578063fd29f856146103e3576100a0565b6100ab5b610002565b565b005b6101136004808035906020019091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610418565b005b6101226004805050610960565b005b6101c86004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610d35565b005b6101e96004808035906020019091908035906020019091905050610865565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102495780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61026d60048080359060200190919050506109f4565b005b6102856004808035906020019091905050610f65565b6040518080602001806020018381038352858181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102e95780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156103425780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b61036860048080359060200190919050506107d0565b6040518082815260200191505060405180910390f35b61038b6004805050610775565b6040518082815260200191505060405180910390f35b6103b76004808035906020019091905050610788565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610402600480803590602001909190803590602001909190505061080f565b6040518082815260200191505060405180910390f35b6000600090505b600360005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050805490508160ff1610156104bf5782600360005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b505414156104b157610002565b5b808060010191505061041f565b81600260005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008581526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061054c57805160ff191683800117855561057d565b8280016001018555821561057d579182015b8281111561057c57825182600050559160200191906001019061055e565b5b5090506105a8919061058a565b808211156105a4576000818150600090555060010161058a565b5090565b5050600360005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508054806001018281815481835581811511610626578183600052602060002091820191016106259190610607565b808211156106215760008181506000905550600101610607565b5090565b5b5050509190906000526020600020900160005b85909190915055506000905080505b6004600050805490508160ff1610156106dd578373ffffffffffffffffffffffffffffffffffffffff16600460005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156106cf5761076f565b5b8080600101915050610648565b6004600050805480600101828181548183558181151161072f5781836000526020600020918201910161072e9190610710565b8082111561072a5760008181506000905550600101610710565b5090565b5b5050509190906000526020600020900160005b86909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550505b50505050565b6000600460005080549050905080505b90565b6000600460005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905080505b919050565b6000600360005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080549050905080505b919050565b6000600360005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b5054905080505b92915050565b6020604051908101604052806000815260200150600260005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008381526020019081526020016000206000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109505780601f1061092557610100808354040283529160200191610950565b820191906000526020600020905b81548152906001019060200180831161093357829003601f168201915b5050505050905080505b92915050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156109f157600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610a5257610002565b600090505b600360005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050805490508160ff161015610b9057600260005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000600360005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005083815481101561000257906000526020600020900160005b50548152602001908152602001600020600050805460018160011615610100020316600290046000825580601f10610b445750610b81565b601f016020900490600052602060002090810190610b809190610b62565b80821115610b7c5760008181506000905550600101610b62565b5090565b5b505b8080600101915050610a57565b600360005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080546000825590600052602060002090810190610bfa9190610bdc565b80821115610bf65760008181506000905550600101610bdc565b5090565b5b506000905080505b6004600050805490508160ff161015610d30578173ffffffffffffffffffffffffffffffffffffffff16600460005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610d2257600460005081815481101561000257906000526020600020900160005b6101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001600460005081818054905003915081815481835581811511610d1957818360005260206000209182019101610d189190610cfa565b80821115610d145760008181506000905550600101610cfa565b5090565b5b50505050610d30565b5b8080600101915050610c03565b5b5050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610d9157610002565b80600160005060008581526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610df457805160ff1916838001178555610e25565b82800160010185558215610e25579182015b82811115610e24578251826000505591602001919060010190610e06565b5b509050610e509190610e32565b80821115610e4c5760008181506000905550600101610e32565b5090565b50508160026000506000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008581526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610f0157805160ff1916838001178555610f32565b82800160010185558215610f32579182015b82811115610f31578251826000505591602001919060010190610f13565b5b509050610f5d9190610f3f565b80821115610f595760008181506000905550600101610f3f565b5090565b50505b505050565b60206040519081016040528060008152602001506020604051908101604052806000815260200150600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008481526020019081526020016000206000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156110645780601f1061103957610100808354040283529160200191611064565b820191906000526020600020905b81548152906001019060200180831161104757829003601f168201915b505050505091508150600160005060008481526020019081526020016000206000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561111a5780601f106110ef5761010080835404028352916020019161111a565b820191906000526020600020905b8154815290600101906020018083116110fd57829003601f168201915b5050505050905080505b91509156';

    self.assertionTypes = [
      {id:1, label: 'Name'},
      {id:2, label: 'Date of birth'}
    ];

    /**
    * Get assertion type for given assertionId
    */
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

    /**
    * Stores assertion on profile, requires {assertionId:1, value:"foo"}
    */
    self.assert = function(identity, assertions) {
      var web3 = Web3.createSignedWeb3(identity)
      var batch = web3.createBatch();

      // Inner encryption layer
      var encryptAssertionWithRandomSessionKey = function(assertionType, assertionValue){
        return new Promise(function(resolve, reject){
          var sessionKey = CryptoWrapper.randomKey();
          //Notification.info('Generated session Key: '+sessionKey);
          var encryptedAssertion = CryptoWrapper.encryptValue(assertionValue, sessionKey);
          $log.debug("Encrypted assertion value with random session key ",sessionKey)
          resolve({assertionType:assertionType, sessionKey: sessionKey, encryptedAssertion:encryptedAssertion});
        });
      };

      // Encrypt session key
      var encryptSessionKeyWithPublicKey = function(encryptedPair){
        return pgp.encryptMessage(identity.pgp, encryptedPair.sessionKey).then(function(encryptedSessionKey){
          encryptedPair.sessionKey = encryptedSessionKey;
          $log.debug("Encrypted session key with pgp key ")
          return encryptedPair;
        });
      };

      // Add call to batch
      var storeAssertion = function(encryptedPair){
            $log.debug("Creating batch operation with params ", encryptedPair.assertionType, encryptedPair.sessionKey, encryptedPair.encryptedAssertion);
            batch.add(
              self.createIdentityClient(identity, identity.contractAddress)
                .assert.request(
                  encryptedPair.assertionType,
                  encryptedPair.sessionKey,
                  encryptedPair.encryptedAssertion,
                  {from: identity.ethAddress(), gas: 3000000, gasPrice: Web3.gasPrice},
                   function(e,r){
                              $log.info(e);
                              $log.info(r);
                            })
            );
            Promise.resolve();
      };
      Promise.all(assertions.map(function(assertion){
          return encryptAssertionWithRandomSessionKey(assertion.assertionId, assertion.value)
          .then(encryptSessionKeyWithPublicKey)
          .then(storeAssertion)
      })).then(function(){
        $log.debug("Executing batch with ",batch.requests.length," items");
        batch.execute();
        Notification.info("Assertion complete");
      })

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

    // self.revoke = function(grantee){
    //   return new Promise(function(resolve, reject){
    //     var
    //     self.createIdentityClient(identity, identity.contractAddress).revoke(grantee);
    //   })
    // }
  });
