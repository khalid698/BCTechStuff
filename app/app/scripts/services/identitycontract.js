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
 var contract = angular.element(document.body).injector().get('IdentityContract')
 *
 */
angular.module('angularApp')
  .service('IdentityContract', function ($log, pgp, CryptoWrapper, Web3, Notification) {

    var self = this;

    self.contractAbi = [{'constant':false,'inputs':[],'name':'kill','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'},{'name':'key','type':'string'},{'name':'value','type':'string'}],'name':'assert','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'}],'name':'attest','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'assertionType','type':'uint256'}],'name':'getSessionKey','outputs':[{'name':'encryptedSessionKey','type':'string'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'assertionType','type':'uint256'},{'name':'sessionKey','type':'string'},{'name':'description','type':'string'}],'name':'grant','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'}],'name':'revoke','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'}],'name':'get','outputs':[{'name':'key','type':'string'},{'name':'value','type':'string'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'}],'name':'getGrantedAssertionCount','outputs':[{'name':'count','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[],'name':'getGranteeCount','outputs':[{'name':'count','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[{'name':'index','type':'uint256'}],'name':'getGrantee','outputs':[{'name':'grantee','type':'address'},{'name':'description','type':'string'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'index','type':'uint256'}],'name':'getGrantedAssertion','outputs':[{'name':'assertionType','type':'uint256'}],'type':'function'},{'inputs':[],'type':'constructor'}];

    self.contractBytes = '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b6115d88061003f6000396000f3606060405236156100ab576000357c01000000000000000000000000000000000000000000000000000000009004806341c0e1b5146100b857806348e724dd146100c75780634af6ffc21461016d5780635fb3fbdb1461018557806360e286321461021257806374a8f103146102c15780639507d39a146102d9578063a21d0afe146103bc578063e8f1ddb7146103e8578063ecdd02971461040b578063fd29f856146104ac576100ab565b6100b65b610002565b565b005b6100c560048050506106a5565b005b61016b6004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610739565b005b61018360048080359060200190919050506113aa565b005b6101a460048080359060200190919080359060200190919050506112af565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102045780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6102bf6004808035906020019091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610caa565b005b6102d76004808035906020019091905050610969565b005b6102ef60048080359060200190919050506104e1565b6040518080602001806020018381038352858181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156103535780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156103ac5780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b6103d2600480803590602001909190505061121a565b6040518082815260200191505060405180910390f35b6103f560048050506110df565b6040518082815260200191505060405180910390f35b61042160048080359060200190919050506110f2565b604051808373ffffffffffffffffffffffffffffffffffffffff168152602001806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561049d5780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b6104cb6004808035906020019091908035906020019091905050611259565b6040518082815260200191505060405180910390f35b60206040519081016040528060008152602001506020604051908101604052806000815260200150600360005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008481526020019081526020016000206000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105e05780601f106105b5576101008083540402835291602001916105e0565b820191906000526020600020905b8154815290600101906020018083116105c357829003601f168201915b505050505091508150600160005060008481526020019081526020016000206000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106965780601f1061066b57610100808354040283529160200191610696565b820191906000526020600020905b81548152906001019060200180831161067957829003601f168201915b5050505050905080505b915091565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561073657600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561079557610002565b80600160005060008581526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106107f857805160ff1916838001178555610829565b82800160010185558215610829579182015b8281111561082857825182600050559160200191906001019061080a565b5b5090506108549190610836565b808211156108505760008181506000905550600101610836565b5090565b50508160036000506000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008581526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061090557805160ff1916838001178555610936565b82800160010185558215610936579182015b82811115610935578251826000505591602001919060010190610917565b5b5090506109619190610943565b8082111561095d5760008181506000905550600101610943565b5090565b50505b505050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156109c757610002565b600090505b600460005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050805490508160ff161015610b0557600360005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000600460005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005083815481101561000257906000526020600020900160005b50548152602001908152602001600020600050805460018160011615610100020316600290046000825580601f10610ab95750610af6565b601f016020900490600052602060002090810190610af59190610ad7565b80821115610af15760008181506000905550600101610ad7565b5090565b5b505b80806001019150506109cc565b600460005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080546000825590600052602060002090810190610b6f9190610b51565b80821115610b6b5760008181506000905550600101610b51565b5090565b5b506000905080505b6005600050805490508160ff161015610ca5578173ffffffffffffffffffffffffffffffffffffffff16600560005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610c9757600560005081815481101561000257906000526020600020900160005b6101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001600560005081818054905003915081815481835581811511610c8e57818360005260206000209182019101610c8d9190610c6f565b80821115610c895760008181506000905550600101610c6f565b5090565b5b50505050610ca5565b5b8080600101915050610b78565b5b5050565b6000600090505b600460005060008673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050805490508160ff161015610d515783600460005060008773ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b50541415610d4357610002565b5b8080600101915050610cb1565b82600360005060008773ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008681526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610dde57805160ff1916838001178555610e0f565b82800160010185558215610e0f579182015b82811115610e0e578251826000505591602001919060010190610df0565b5b509050610e3a9190610e1c565b80821115610e365760008181506000905550600101610e1c565b5090565b5050600460005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508054806001018281815481835581811511610eb857818360005260206000209182019101610eb79190610e99565b80821115610eb35760008181506000905550600101610e99565b5090565b5b5050509190906000526020600020900160005b869091909150555081600260005060008773ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610f4c57805160ff1916838001178555610f7d565b82800160010185558215610f7d579182015b82811115610f7c578251826000505591602001919060010190610f5e565b5b509050610fa89190610f8a565b80821115610fa45760008181506000905550600101610f8a565b5090565b50506000905080505b6005600050805490508160ff161015611046578473ffffffffffffffffffffffffffffffffffffffff16600560005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611038576110d8565b5b8080600101915050610fb1565b60056000508054806001018281815481835581811511611098578183600052602060002091820191016110979190611079565b808211156110935760008181506000905550600101611079565b5090565b5b5050509190906000526020600020900160005b87909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550505b5050505050565b6000600560005080549050905080505b90565b60006020604051908101604052806000815260200150600560005083815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1691508150600260005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561120b5780601f106111e05761010080835404028352916020019161120b565b820191906000526020600020905b8154815290600101906020018083116111ee57829003601f168201915b5050505050905080505b915091565b6000600460005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080549050905080505b919050565b6000600460005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b5054905080505b92915050565b6020604051908101604052806000815260200150600360005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008381526020019081526020016000206000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561139a5780601f1061136f5761010080835404028352916020019161139a565b820191906000526020600020905b81548152906001019060200180831161137d57829003601f168201915b5050505050905080505b92915050565b6000600090505b60066000506000838152602001908152602001600020600050805490508160ff16101561146e573373ffffffffffffffffffffffffffffffffffffffff166006600050600084815260200190815260200160002060005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561146057610002565b5b80806001019150506113b1565b6006600050600083815260200190815260200160002060005080548060010182818154818355818115116114d4578183600052602060002091820191016114d391906114b5565b808211156114cf57600081815060009055506001016114b5565b5090565b5b5050509190906000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550506000905080505b6007600050805490508160ff1610156115665781600760005082815481101561000257906000526020600020900160005b50541415611558576115d4565b5b808060010191505061151a565b600760005080548060010182818154818355818115116115b8578183600052602060002091820191016115b79190611599565b808211156115b35760008181506000905550600101611599565b5090565b5b5050509190906000526020600020900160005b84909190915055505b505056';

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

    self.deleteContract = function(identity, callback){
      $log.debug('Deleting contract for identity',identity);
      self.createIdentityClient(identity, identity.contractAddress).kill({gas: 3000000, gasPrice: Web3.gasPrice}, callback);
    };

    /**
    * Stores assertion on profile, requires {assertionId:1, value:"foo"}
    */
    self.assert = function(identity, assertions) {
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
            return Web3.watchTransaction(identity, tx);
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

    self.grant = function(identity, grantee, assertionTypes, description){
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
        return pgp.encryptMessage(identity.pgp, description); // This is encrypted to the granting identity
      };

      var encryptWithGranteePublicKey = function(decryptedSessionKey){
          $log.info("Encrypting session key ", decryptedSessionKey," with grantees public key");
          // Encrypt session with grantee public key
          return Promise.all([
            pgp.encryptMessage(grantee.pgp, decryptedSessionKey),
            pgp.encryptMessage(grantee.pgp, description)
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
            return Web3.watchTransaction(identity, tx);
          }));
        });
      }).then(function(){
        $log.info("All grant promises complete;");
      });
    };
    /**
    * Attest, identity is the identity attesting the
    */
    self.attest = function(identity, target, assertionType){
      return new Promise(function(resolve, reject){
          if(!target.contractAddress){
            reject("Cannot attest target without contract address");
          }
          var callback = function(e,r){
            if (e){
              reject(e);
            } else {
              resolve(r);
            }
          };
          self.createIdentityClient(identity, target.contractAddress)
              .attest(assertionType.id);
      });
    }

    self.revoke = function(identity, grantee){
      $log.info("Revoking access by",grantee);
      var p = Promise.defer();
      self.createIdentityClient(identity, identity.contractAddress).revoke(grantee.ethAddress(), {gas: 3000000, gasPrice: Web3.gasPrice}, self.web3PromiseResolver(p));
      return p.promise;
    }
  });
