'use strict';

/**
 * @ngdoc service
 * @name angularApp.IdentityContract
 * @description
 * # IdentityContract
 * Service in the angularApp.
 *
 var identity = angular.element(document.body).injector().get('Identity').get("test")
 var bank = angular.element(document.body).injector().get('Identity').get("info@bitbank.com")
 var web3 = angular.element(document.body).injector().get('Web3')
 var web3Client = web3.createWeb3()
 var identityContract = angular.element(document.body).injector().get('IdentityContract')
 var contract = identityContract.createIdentityClient(identity, identity.contractAddress)
 *
 */
angular.module('angularApp')
  .service('IdentityContract', function ($log, pgp, CryptoWrapper, Web3, Notification) {

    var self = this;

    self.contractAbi = [{'constant':false,'inputs':[],'name':'getAttestedAssertionCount','outputs':[{'name':'count','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[],'name':'kill','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'},{'name':'key','type':'string'},{'name':'value','type':'string'}],'name':'assert','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'assertionType','type':'uint256'}],'name':'getSessionKey','outputs':[{'name':'encryptedSessionKey','type':'string'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'assertionType','type':'uint256'},{'name':'sessionKey','type':'string'},{'name':'description','type':'string'}],'name':'grant','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionTypes','type':'uint256[]'}],'name':'attest','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'}],'name':'getAttesteeCount','outputs':[{'name':'count','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'}],'name':'revoke','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'}],'name':'get','outputs':[{'name':'key','type':'string'},{'name':'value','type':'string'}],'type':'function'},{'constant':false,'inputs':[{'name':'index','type':'uint256'}],'name':'getAttestedAssertion','outputs':[{'name':'assertionType','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'},{'name':'index','type':'uint256'}],'name':'getAttestee','outputs':[{'name':'attestee','type':'address'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'}],'name':'getGrantedAssertionCount','outputs':[{'name':'count','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[],'name':'getGranteeCount','outputs':[{'name':'count','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[{'name':'index','type':'uint256'}],'name':'getGrantee','outputs':[{'name':'grantee','type':'address'},{'name':'description','type':'string'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'index','type':'uint256'}],'name':'getGrantedAssertion','outputs':[{'name':'assertionType','type':'uint256'}],'type':'function'},{'inputs':[],'type':'constructor'}];

    self.contractBytes = '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b6118258061003f6000396000f3606060405236156100d7576000357c0100000000000000000000000000000000000000000000000000000000900480630ea99159146100e457806341c0e1b51461010757806348e724dd146101165780635fb3fbdb146101bc57806360e28632146102495780636b9b7cd8146102f85780637495f9d41461034b57806374a8f103146103775780639507d39a1461038f578063981eb4dd146104725780639f70ed771461049e578063a21d0afe146104e9578063e8f1ddb714610515578063ecdd029714610538578063fd29f856146105d9576100d7565b6100e25b610002565b565b005b6100f16004805050610d43565b6040518082815260200191505060405180910390f35b6101146004805050611791565b005b6101ba6004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505090909190505061060e565b005b6101db600480803590602001909190803590602001909190505061140c565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561023b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6102f66004808035906020019091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610e07565b005b61034960048080359060200190820180359060200191919080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050909091905050611507565b005b6103616004808035906020019091905050610d81565b6040518082815260200191505060405180910390f35b61038d6004808035906020019091905050610a02565b005b6103a5600480803590602001909190505061083e565b6040518080602001806020018381038352858181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156104095780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156104625780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b6104886004808035906020019091905050610d56565b6040518082815260200191505060405180910390f35b6104bd6004808035906020019091908035906020019091905050610daa565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6104ff6004808035906020019091905050611377565b6040518082815260200191505060405180910390f35b610522600480505061123c565b6040518082815260200191505060405180910390f35b61054e600480803590602001909190505061124f565b604051808373ffffffffffffffffffffffffffffffffffffffff168152602001806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156105ca5780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b6105f860048080359060200190919080359060200190919050506113b6565b6040518082815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561066a57610002565b80600160005060008581526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106106cd57805160ff19168380011785556106fe565b828001600101855582156106fe579182015b828111156106fd5782518260005055916020019190600101906106df565b5b509050610729919061070b565b80821115610725576000818150600090555060010161070b565b5090565b50508160036000506000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008581526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106107da57805160ff191683800117855561080b565b8280016001018555821561080b579182015b8281111561080a5782518260005055916020019190600101906107ec565b5b5090506108369190610818565b808211156108325760008181506000905550600101610818565b5090565b50505b505050565b60206040519081016040528060008152602001506020604051908101604052806000815260200150600360005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008481526020019081526020016000206000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561093d5780601f106109125761010080835404028352916020019161093d565b820191906000526020600020905b81548152906001019060200180831161092057829003601f168201915b505050505091508150600160005060008481526020019081526020016000206000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109f35780601f106109c8576101008083540402835291602001916109f3565b820191906000526020600020905b8154815290600101906020018083116109d657829003601f168201915b5050505050905080505b915091565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610a6057610002565b600090505b600460005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050805490508160ff161015610b9e57600360005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000600460005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005083815481101561000257906000526020600020900160005b50548152602001908152602001600020600050805460018160011615610100020316600290046000825580601f10610b525750610b8f565b601f016020900490600052602060002090810190610b8e9190610b70565b80821115610b8a5760008181506000905550600101610b70565b5090565b5b505b8080600101915050610a65565b600460005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080546000825590600052602060002090810190610c089190610bea565b80821115610c045760008181506000905550600101610bea565b5090565b5b506000905080505b6005600050805490508160ff161015610d3e578173ffffffffffffffffffffffffffffffffffffffff16600560005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610d3057600560005081815481101561000257906000526020600020900160005b6101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001600560005081818054905003915081815481835581811511610d2757818360005260206000209182019101610d269190610d08565b80821115610d225760008181506000905550600101610d08565b5090565b5b50505050610d3e565b5b8080600101915050610c11565b5b5050565b6000600760005080549050905080505b90565b6000600760005082815481101561000257906000526020600020900160005b5054905080505b919050565b60006006600050600083815260200190815260200160002060005080549050905080505b919050565b60006006600050600084815260200190815260200160002060005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905080505b92915050565b6000600090505b600460005060008673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050805490508160ff161015610eae5783600460005060008773ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b50541415610ea057610002565b5b8080600101915050610e0e565b82600360005060008773ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008681526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610f3b57805160ff1916838001178555610f6c565b82800160010185558215610f6c579182015b82811115610f6b578251826000505591602001919060010190610f4d565b5b509050610f979190610f79565b80821115610f935760008181506000905550600101610f79565b5090565b5050600460005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508054806001018281815481835581811511611015578183600052602060002091820191016110149190610ff6565b808211156110105760008181506000905550600101610ff6565b5090565b5b5050509190906000526020600020900160005b869091909150555081600260005060008773ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106110a957805160ff19168380011785556110da565b828001600101855582156110da579182015b828111156110d95782518260005055916020019190600101906110bb565b5b50905061110591906110e7565b8082111561110157600081815060009055506001016110e7565b5090565b50506000905080505b6005600050805490508160ff1610156111a3578473ffffffffffffffffffffffffffffffffffffffff16600560005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561119557611235565b5b808060010191505061110e565b600560005080548060010182818154818355818115116111f5578183600052602060002091820191016111f491906111d6565b808211156111f057600081815060009055506001016111d6565b5090565b5b5050509190906000526020600020900160005b87909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550505b5050505050565b6000600560005080549050905080505b90565b60006020604051908101604052806000815260200150600560005083815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1691508150600260005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156113685780601f1061133d57610100808354040283529160200191611368565b820191906000526020600020905b81548152906001019060200180831161134b57829003601f168201915b5050505050905080505b915091565b6000600460005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080549050905080505b919050565b6000600460005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b5054905080505b92915050565b6020604051908101604052806000815260200150600360005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008381526020019081526020016000206000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156114f75780601f106114cc576101008083540402835291602001916114f7565b820191906000526020600020905b8154815290600101906020018083116114da57829003601f168201915b5050505050905080505b92915050565b60006000600060006000600094505b85518560ff1610156117885785858151811015610002579060200190602002015193506001925060019150600090505b60066000506000858152602001908152602001600020600050805490508160ff161015611605573373ffffffffffffffffffffffffffffffffffffffff166006600050600086815260200190815260200160002060005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156115f7576000915081505b5b8480600101955050611546565b6000905080505b6007600050805490508560ff16101561165a5783600760005086815481101561000257906000526020600020900160005b5054141561164c576000925082505b5b848060010195505061160c565b82156116ce57600760005080548060010182818154818355818115116116b2578183600052602060002091820191016116b19190611693565b808211156116ad5760008181506000905550600101611693565b5090565b5b5050509190906000526020600020900160005b86909190915055505b811561177a5760066000506000858152602001908152602001600020600050805480600101828181548183558181151161173a57818360005260206000209182019101611739919061171b565b80821115611735576000818150600090555060010161171b565b5090565b5b5050509190906000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550505b5b8480600101955050611516565b5b505050505050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561182257600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b56';

    self.web3Options = {gas: 3000000, gasPrice: Web3.gasPrice};

    self.web3OptionsWithFrom = function(identity){
      var res = self.web3Options;
      res.from = identity.ethAddress();
      return res;
    };

    // Default 'format' is text
    self.assertionTypes = [
      {id:1, label: 'Name'},
      {id:2, label: 'Date of birth'}, // TODO : Date ?
      {id:3, label: 'Telephone number'},
      {id:4, label: 'Passport number'},
      {id:5, label: 'Driver licence number'},
      {id:6, label: 'Address', format: 'multiline'}
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

    // Callbank function to resolve promise with web3 result.
    self.web3PromiseResolver = function(promise){
      return function(e,r){
        if(e){
          $log.error("got error from web3, rejecting promise",e);
          promise.reject(e);
        } else {
          promise.resolve(r);
        }
      }
    };

    // Contract creation / Deletion
    self.createContract = function(identity, name){
        $log.info("Creating contract for ", identity);
        // Notification.primary("Creating contract");
        $log.info("Using from address", identity.ethAddress());
        // Notification.info("Using from address: " + identity.ethAddress());
        var web3 = Web3.createSignedWeb3(identity);
        var identityContract = web3.eth.contract(self.contractAbi);
        return new Promise(function(resolve, reject){
          var callback = function(e,contract){
            if(e){
              reject(e);
            } else {
              if (typeof contract !== 'undefined' && typeof contract.address !== 'undefined') {
                resolve(contract);
              }
            }
          };
          identityContract.new(name, {
            from: identity.ethAddress(),
            data: self.contractBytes,
            gas: 3000000,
            gasPrice: Web3.gasPrice
           }, callback);
        });
    };

    self.deleteContract = function(identity){
      $log.debug('Deleting contract for identity',identity);
      var p = Promise.defer();
      var web3 = Web3.createSignedWeb3(identity);
      var batch = web3.createBatch();
      var identityClient = self.createIdentityClient(identity, identity.contractAddress)
      var request = identityClient.kill.request(self.web3OptionsWithFrom(identity), self.web3PromiseResolver(p));
      request.format = false;
      batch.add(request);
      batch.execute()
      return p.promise.then(function(tx){
        return Web3.watchTransaction(identity, tx);
      });
    };

    /**
    * Stores assertion on profile, requires {assertionId:1, value:"foo"}
    */
    self.assert = function(identity, assertions, callback) {
      var web3 = Web3.createSignedWeb3(identity);
      var batch = web3.createBatch();

      var batchTransactionPromises = [];

      // Inner encryption layer
      var encryptAssertionWithRandomSessionKey = function(assertionType, assertionValue){
        return new Promise(function(resolve, reject){
          var sessionKey = CryptoWrapper.randomKey();
          //Notification.info('Generated session Key: '+sessionKey);
          var encryptedAssertion = CryptoWrapper.encryptValue(assertionValue, sessionKey);
          $log.debug("Encrypted assertion value with random session key ",sessionKey);
          resolve({
            assertionType:assertionType,
            sessionKey: sessionKey,
            encryptedAssertion:encryptedAssertion});
        });
      };

      // Encrypt session key
      var encryptSessionKeyWithPublicKey = function(encryptedPair){
        return pgp.encryptMessage(identity.pgp, encryptedPair.sessionKey).then(function(encryptedSessionKey){
          encryptedPair.sessionKey = encryptedSessionKey;
          $log.debug("Encrypted session key with pgp key ");
          return encryptedPair;
        });
      };

      // Add call to batch
      var storeAssertion = function(encryptedPair){
            $log.debug("Creating batch operation with params ", encryptedPair.assertionType, encryptedPair.sessionKey, encryptedPair.encryptedAssertion);
            var p = Promise.defer();
            batchTransactionPromises.push(p.promise);

            var request = self.createIdentityClient(identity, identity.contractAddress)
                .assert.request(
                  encryptedPair.assertionType,
                  encryptedPair.sessionKey,
                  encryptedPair.encryptedAssertion,
                  {from: identity.ethAddress(), gas: 3000000, gasPrice: Web3.gasPrice},
                  self.web3PromiseResolver(p)
                );
                request.format = false;
            batch.add(request);
            // This promise complete immidiately,
            Promise.resolve();
      };


      return Promise.all(assertions.map(function(assertion){
      // Initial promsise, encrypts and populats batch
          return encryptAssertionWithRandomSessionKey(assertion.assertionId, assertion.value)
          .then(encryptSessionKeyWithPublicKey)
          .then(storeAssertion);
      })).then(function(){
        // Second promise, executes batch
        $log.debug("Executing batch with ",batch.requests.length," items");
        batch.execute();
        // Notification.info("Assertion complete");
      }).then(function(){
        // Wait for
        $log.debug("Waiting for ",batchTransactionPromises," promises to complete");
        return Promise.all(batchTransactionPromises).then(function(t){
          return Promise.all(t.map(function(tx){
            return Web3.watchTransaction(identity, tx).then(function(){callback()});
          }));
        });
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
            $log.debug("Got empty response reading assertionType",assertionType);
            //reject("Got one or more empty responses from contract, read failed");
            resolve(undefined);
          } else {
            // $log.debug(result);
            // Notification.info("Decrypting Session Key");
            $log.debug("Decrypting session key for assertion ", assertionType);
            pgp.decryptMessage(grantee.pgp, pgp.message.readArmored(result[0])).then(function(decryptedSessionKey){
               $log.debug("Decrypted session key", decryptedSessionKey);
               var decryptedAssertion = CryptoWrapper.decryptStringValue(result[1], decryptedSessionKey);
               $log.debug("Decrypted assertion key", decryptedAssertion);
               //callback(decryptedAssertion);
               resolve(decryptedAssertion);
            });
          }
        };
        $log.debug("Reading encrypted assertion", assertionType,"from contract at", contractAddress);
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
          var getGrantee = contract.getGrantee.call(i);
          grant.requestee = getGrantee[0];
          grant.description = getGrantee[1];
          $log.debug("Getting grants for requestee nr ",i," : ", grant.requestee);
          grant.assertions = self.grantsByGrantee(identity, grant.requestee);

          if ( grant.assertions.length > 0 ){
            grants.push(grant);
          }
      }
      $log.debug("Returning ",grants.length, " granted assertion");
      return Promise.all(grants.map(function(grant){
        $log.debug("Decrypting pgp message", grant.description);
        return pgp.decryptMessage(identity.pgp, pgp.message.readArmored(grant.description)).then(function(encryptedDescription){
          grant.description = encryptedDescription;
          return grant;
        })
      }));
    };

    self.grant = function(identity, grantee, assertionTypes, description, callback){
      var web3 = Web3.createSignedWeb3(identity);
      var batch = web3.createBatch();

      $log.info("Granting assertions ", assertionTypes, " to ", grantee);

      var grantPromises = [];

      var storeEncryptedSessionKey = function(assertionType, encryptedSessionKey, encryptedDescription){
        $log.info("Storing encrypted session key for assertionType", assertionType);
        var p = Promise.defer();
        grantPromises.push(p.promise);
        var request = self.createIdentityClient(identity, identity.contractAddress)
                  .grant.request(
                      grantee.ethAddress(),
                      assertionType,
                      encryptedSessionKey,
                      encryptedDescription,
                      {from: identity.ethAddress(), gas: 3000000, gasPrice: Web3.gasPrice},
                      self.web3PromiseResolver(p)
                      );
        request.format = false;
        batch.add(request);
        return Promise.resolve();
      };
      var encryptDescription = function(){
        return pgp.encryptMessage([identity.pgp, grantee.pgp], description); // This is encrypted to the granting identity
      };

      var encryptWithGranteePublicKey = function(decryptedSessionKey){
          $log.info("Encrypting session key ", decryptedSessionKey," with grantees public key");
          // Encrypt session with grantee public key
          return Promise.all([
            pgp.encryptMessage([identity.pgp, grantee.pgp], decryptedSessionKey),
            pgp.encryptMessage([identity.pgp, grantee.pgp], description)
            ]);
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
            });
          }
      };

      return Promise.all(assertionTypes.map(function(assertionType){
          return readEncryptedSessionKey(assertionType)
            .then(encryptWithGranteePublicKey)
            .then(function(encryptedSessionKeyAndDescription){
              $log.info(encryptedSessionKeyAndDescription);
              return storeEncryptedSessionKey(assertionType,encryptedSessionKeyAndDescription[0], encryptedSessionKeyAndDescription[1]);
            });
      })).then(function(){
        // Wait for all decryption/encrytion promises to complete, once done execute the batch
        $log.debug("Executing batch with ",batch.requests.length," items");
        batch.execute();
      }).then(function(){
        return Promise.all(grantPromises).then(function(t){
          $log.info("transactions",t);
          return Promise.all(t.map(function(tx){
            return Web3.watchTransaction(identity, tx).then(function(){callback()});
          }));
        });
      }).then(function(){
        $log.info("All grant promises complete;");
      });
    };

    /**
    *
    */
    self.attest = function(identity, target, assertionTypes, callback){
      var web3 = Web3.createSignedWeb3(identity);
      var batch = web3.createBatch();

      var assertionIds = assertionTypes.map(function(at){return at.id;});
      $log.info("Attesting assertion ids ", assertionIds, " on ", target, "by", identity);
      var p = Promise.defer();

      self.createIdentityClient(identity, target.contractAddress).attest(assertionIds, self.web3OptionsWithFrom(identity), self.web3PromiseResolver(p));
      return p.promise.then(function(tx){
        return Web3.watchTransaction(identity, tx).then(function(){
          $log.debug("Attestation complete");
        })
      });

      // var createAttestation = function(assertionType){
      //     var p = Promise.defer();
      //     transactionPromises.push(p.promise);
      //     var request =
      //     request.format = false;
      //     batch.add(request);
      //     return Promise.resolve();
      // };

      // return Promise.all(assertionTypes.map(function(assertionType){
      //   return createAttestation(assertionType)
      // })).then(function(){
      //   batch.execute();
      //   return Promise.all(transactionPromises).then(function(txIds){
      //     return Promise.all(txIds.map(function(tx){
      //       return Web3.watchTransaction(identity, tx).then(function(){callback()});
      //     }))
      //   })
      // })
    };

    self.revoke = function(identity, grantee){
      $log.info("Revoking access by",grantee);
      var p = Promise.defer();
      self.createIdentityClient(identity, identity.contractAddress).revoke(grantee.ethAddress(), self.web3Options, self.web3PromiseResolver(p));
      return p.promise;
    };

    /**
    * Returns
    * {
    *    <assertionId> : [<address>, ...]
    */
    self.attestations = function(identity){
       var contract = self.createIdentityClient(identity, identity.contractAddress);
       var attestedAssertionCount = contract.getAttestedAssertionCount.call();
      var result = {};
      $log.debug("Got",attestedAssertionCount.toNumber(),"attested assertions");
      for(var i=0; i < attestedAssertionCount; i++){
        var attestedAssertionType = contract.getAttestedAssertion.call(i);
        var attesteeCount = contract.getAttesteeCount.call(attestedAssertionType);
        //$log.debug("Got",attesteeCount.toNumber(),"attestees for assertiontype",attestedAssertionType.toNumber() );
        result[attestedAssertionType.toNumber()] = [];
        for(var j=0; j < attesteeCount; j++){
          var attestee = contract.getAttestee.call(attestedAssertionType, j);
          //$log.debug("Got attestee",attestee," for assertiontype", attestedAssertionType.toNumber());
          result[attestedAssertionType.toNumber()].push(attestee);
        }
      }
      $log.debug("Returning attestations", result);
      return result;
    };

});
