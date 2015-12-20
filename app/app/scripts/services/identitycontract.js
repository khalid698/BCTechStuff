'use strict';

/**
 * @ngdoc service
 * @name angularApp.IdentityContract
 * @description
 * # IdentityContract
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('IdentityContract', function ($log, pgp, CryptoWrapper, Web3, Notification) {

    var self = this;

    self.contractAbi = [{'constant':false,'inputs':[],'name':'getRequesteeCount','outputs':[{'name':'','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'},{'name':'key','type':'string'}],'name':'updateKey','outputs':[],'type':'function'},{'constant':false,'inputs':[],'name':'kill','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'},{'name':'key','type':'string'},{'name':'value','type':'string'}],'name':'assert','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'publicKey','type':'string'},{'name':'requestedAssertions','type':'uint256[]'}],'name':'request','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'}],'name':'getRequest','outputs':[{'name':'publicKey','type':'string'},{'name':'numberOfAssertions','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'assertionTypes','type':'uint256[]'}],'name':'grant','outputs':[],'type':'function'},{'constant':false,'inputs':[{'name':'index','type':'uint256'}],'name':'getRequestee','outputs':[{'name':'','type':'address'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'index','type':'uint256'}],'name':'getRequestAssertion','outputs':[{'name':'assertionType','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[{'name':'assertionType','type':'uint256'}],'name':'get','outputs':[{'name':'key','type':'string'},{'name':'value','type':'string'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'}],'name':'getGrantedAssertionCount','outputs':[{'name':'count','type':'uint256'}],'type':'function'},{'constant':false,'inputs':[{'name':'requestee','type':'address'},{'name':'index','type':'uint256'}],'name':'getGrantedAssertion','outputs':[{'name':'assertionType','type':'uint256'}],'type':'function'},{'inputs':[],'type':'constructor'}];

    self.contractBytes = '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b61111d8061003f6000396000f3606060405236156100b6576000357c010000000000000000000000000000000000000000000000000000000090048063201e2d3b146100c357806330d1ab4e146100e657806341c0e1b51461014557806348e724dd1461015457806361f57cd9146101fa57806363c1dff71461029457806368aa84811461031f5780638a1397291461037b5780639471d30b146103bd5780639507d39a146103f2578063a21d0afe146104d5578063fd29f85614610501576100b6565b6100c15b610002565b565b005b6100d06004805050610e77565b6040518082815260200191505060405180910390f35b6101436004808035906020019091908035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506107be565b005b6101526004805050610e8c565b005b6101f86004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610f20565b005b6102926004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919080359060200190820180359060200191919080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050909091905050610a8c565b005b6102aa6004808035906020019091905050610580565b60405180806020018381526020018281038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156103105780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b61037960048080359060200190919080359060200190820180359060200191919080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050909091905050610d3a565b005b6103916004808035906020019091905050610536565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103dc60048080359060200190919080359060200190919050506106d3565b6040518082815260200191505060405180910390f35b61040860048080359060200190919050506108e6565b6040518080602001806020018381038352858181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561046c5780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156104c55780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b6104eb6004808035906020019091905050610729565b6040518082815260200191505060405180910390f35b6105206004808035906020019091908035906020019091905050610768565b6040518082815260200191505060405180910390f35b6000600560005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905061057b565b919050565b602060405190810160405280600081526020015060006000600260005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000509050600460005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561068c5780601f106106615761010080835404028352916020019161068c565b820191906000526020600020905b81548152906001019060200180831161066f57829003601f168201915b505050505092508250600260005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080549050915081505b50915091565b6000600260005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b5054905080505b92915050565b6000600360005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080549050905080505b919050565b6000600360005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b5054905080505b92915050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561081a57610002565b80600160005060008481526020019081526020016000206000506000016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061088357805160ff19168380011785556108b4565b828001600101855582156108b4579182015b828111156108b3578251826000505591602001919060010190610895565b5b5090506108df91906108c1565b808211156108db57600081815060009055506001016108c1565b5090565b50505b5050565b60206040519081016040528060008152602001506020604051908101604052806000815260200150600160005060008481526020019081526020016000206000506000016000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109c15780601f10610996576101008083540402835291602001916109c1565b820191906000526020600020905b8154815290600101906020018083116109a457829003601f168201915b505050505091508150600160005060008481526020019081526020016000206000506001016000508054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a7d5780601f10610a5257610100808354040283529160200191610a7d565b820191906000526020600020905b815481529060010190602001808311610a6057829003601f168201915b5050505050905080505b915091565b600082600460005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610b0757805160ff1916838001178555610b38565b82800160010185558215610b38579182015b82811115610b37578251826000505591602001919060010190610b19565b5b509050610b639190610b45565b80821115610b5f5760008181506000905550600101610b45565b5090565b505081600260005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000509080519060200190828054828255906000526020600020908101928215610bdc579160200282015b82811115610bdb578251826000505591602001919060010190610bbd565b5b509050610c079190610be9565b80821115610c035760008181506000905550600101610be9565b5090565b5050600090505b6005600050805490508160ff161015610ca3573373ffffffffffffffffffffffffffffffffffffffff16600560005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610c9557610d35565b5b8080600101915050610c0e565b60056000508054806001018281815481835581811511610cf557818360005260206000209182019101610cf49190610cd6565b80821115610cf05760008181506000905550600101610cd6565b5090565b5b5050509190906000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550505b505050565b60006000905080505b8151811015610e0557600360005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508054806001018281815481835581811511610dc857818360005260206000209182019101610dc79190610da9565b80821115610dc35760008181506000905550600101610da9565b5090565b5b5050509190906000526020600020900160005b848481518110156100025790602001906020020151909190915055505b8080600101915050610d43565b600260005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080546000825590600052602060002090810190610e6f9190610e51565b80821115610e6b5760008181506000905550600101610e51565b5090565b5b505b505050565b60006005600050805490509050610e89565b90565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610f1d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610f7c57610002565b60406040519081016040528083815260200182815260200150600160005060008581526020019081526020016000206000506000820151816000016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061100357805160ff1916838001178555611034565b82800160010185558215611034579182015b82811115611033578251826000505591602001919060010190611015565b5b50905061105f9190611041565b8082111561105b5760008181506000905550600101611041565b5090565b50506020820151816001016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106110b657805160ff19168380011785556110e7565b828001600101855582156110e7579182015b828111156110e65782518260005055916020019190600101906110c8565b5b50905061111291906110f4565b8082111561110e57600081815060009055506001016110f4565b5090565b50509050505b50505056';

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

    // Address is passed in since it can differ from the identity address
    self.readAssertion = function(identity, identityAddress, assertionType, callback){
      var internalCallback = function(e,result){
        if(e){
          $log.warn(e);
        } else if (result.lastIndexOf("") !== -1 ){
          $log.warn("Got one or more empty responses from contract, read failed");
        } else {
          $log.debug(result);
          Notification.info("Decrypting Session Key");
          pgp.decryptMessage(identity.pgp, pgp.message.readArmored(result[0])).then(function(decryptedSessionKey){
             var decryptedAssertion = CryptoWrapper.decryptStringValue(result[1], decryptedSessionKey);
             Notification.info("Decrypting Assertion");
             callback(decryptedAssertion);
          });
        }
      };
      self.createIdentityClient(identity, identityAddress).get.call(assertionType, internalCallback);
    };

    // Requests
    /**
    * to test :
    * identity = angular.element(document.body).injector().get('Identity').get("test")
    *
    **/
    self.request = function(requesteeIdentity, targetIdentity, assertionTypes, callback){
      self.createIdentityClient(requesteeIdentity, targetIdentity.contractAddress)
        .request(requesteeIdentity.pgpPublicKey(), assertionTypes,{gas: 3000000, gasPrice: Web3.gasPrice}, callback);
    };
    /**
    * To test :
    var identity = angular.element(document.body).injector().get('Identity').get("test")
    var contract = angular.element(document.body).injector().get('IdentityContract')
    c = contract.createIdentityClient(identity, identity.contractAddress)
    */
    self.requests = function(targetIdentity){
      var requests = [];
      var contract = self.createIdentityClient(targetIdentity, targetIdentity.contractAddress);
      var numberOfRequestees = contract.getRequesteeCount.call().toNumber();
      for (var i=0; i < numberOfRequestees; i++){
          var request = {};
          request.requestee = contract.getRequestee.call(i);
          var requestDetails = contract.getRequest.call(request.requestee);
          request.publicKey = requestDetails[0];
          var numberOfAssertions = requestDetails[1];
          request.assertions = [];
          for(var j=0; j < numberOfAssertions; j++){
            request.assertions.push(contract.getRequestAssertion.call(request.requestee, j).toNumber());
          }
          if ( request.assertions.length > 0 ){
            requests.push(request);
          }
      }
      return requests;
    };

    self.grants = function(identity){
      var grants = [];
      var contract = self.createIdentityClient(identity, identity.contractAddress);
      var numberOfRequestees = contract.getRequesteeCount.call().toNumber();
      $log.debug("Number of requestees :",numberOfRequestees)
      for (var i=0; i < numberOfRequestees; i++){
          $log.debug("Getting grants for requestee :",i)
          var grant = {};
          grant.requestee = contract.getRequestee.call(i);
          var grantedAssertionCount = contract.getGrantedAssertionCount.call(grant.requestee).toNumber();
          $log.debug("Requestee ",grant.requestee, " has ", grantedAssertionCount, "granted assertions");
          grant.assertions = [];
          for(var j=0; j < grantedAssertionCount; j++){
            var assertion = contract.getGrantedAssertion.call(grant.requestee, j).toNumber()
            $log.debug("Requestee ",grant.requestee, " has granted assertion ", assertion);
            grant.assertions.push(assertion);
          };
          if ( grant.assertions.length > 0 ){
            grants.push(grant);
          }
      }
      $log.debug("Returning ",grants.length, " granted assertion");
      return grants;
    };

    self.grant = function(identity, request){
      var callback = function(){
        Notification.info("Granted complete");
      };
      $log.info("Granting assertions", request.assertions, " to ", request.requestee);
      self.createIdentityClient(identity, identity.contractAddress)
      .grant(request.requestee, request.assertions,{gas: 3000000, gasPrice: Web3.gasPrice}, callback);
    };

  });
