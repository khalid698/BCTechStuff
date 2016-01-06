'use strict';

/**
 * @ngdoc service
 * @name angularApp.exporter
 * @description
 * # exporter
 * Service in the angularApp.
 var identity = angular.element(document.body).injector().get('Identity').get("test5")
 var exporter =  angular.element(document.body).injector().get('Exporter')
 */
angular.module('angularApp')
  .service('Exporter', function ($log, Identity, pgp, Web3, LightWallet, IdentityContract) {

    var self = this;

    self.importIdentities = function(data){
      $log.debug('Deleting identities');
      Identity.getIdentities().map(Identity.delete);

      var createIdentity = function(identity){
        $log.debug("Importing", identity);
        var eth = LightWallet.keystore.deserialize(JSON.stringify(identity.eth,identity.passphrase));
        var pgpKey = pgp.key.readArmored(identity.pgp).keys[0];
        pgpKey.decrypt(identity.passphrase);
        // Create usable identity
        var id = Identity.createIdentity(identity.email, identity.passphrase, identity.secretSeed, pgpKey, eth, identity.contractAddress);
        Identity.store(id);
        return Web3.giveEther(id) // Give Ether
        .then(function(){ // Ensure contract present
          if(IdentityContract.exists(id)){
             $log.debug("Contract present for",id.email,"skipping creation");
             return Promise.resolve(id);
          } else {
             return IdentityContract.createContract(id)
               .then(function(contract){
                 $log.debug("Updating contract address for",identity.email);
                 id.contractAddress = contract.address;
                 Identity.store(id);
                 return id
            })
          }})
        .then(function(id){ // Ensure assertions are setup
           var assertions = [];
           for(var assertion in identity.assertions){
               assertions.push({ assertionId: assertion, value: identity.assertions[assertion] });
           }
           return IdentityContract.assert(id, assertions, function(){})
        }).then(function(){
          $log.info("Finished contract and assertion import of",id.email);
          return {identity: id, attestations: identity.attestations}
        });
      }
      var createAttestations = function(identities){
          var createAttestationsForIdentity = function(identity){
            $log.debug("Creating attestions for", identity);
            var attestationsByAttestee = {};
            for(var assertionType in identity.attestations){
               for(var i=0; i < identity.attestations[assertionType].length; i++){
                 var attesteeAddress = identity.attestations[assertionType][i];
                 var attestee = Identity.getByAddress(attesteeAddress);
                 if(attestee !== undefined){
                   if(attestationsByAttestee[attesteeAddress] === undefined){
                     attestationsByAttestee[attesteeAddress] = [];
                   }
                   attestationsByAttestee[attesteeAddress].push(assertionType);
                  } // end if
               } // end for
            }  // end for
            var attestationPromises = [];
            for(var attesteeAddress in attestationsByAttestee){
              var attestee = Identity.getByAddress(attesteeAddress);
              var assertionTypes = attestationsByAttestee[attesteeAddress];
              attestationPromises.push(IdentityContract.attest(attestee, identity.identity, assertionTypes.map(IdentityContract.assertionById)));
            }
            $log.debug("Awaiting", attestationPromises.length,"attestations");
            return Promise.all(attestationPromises);
          } // end function
          return Promise.all(identities.map(createAttestationsForIdentity))
      };
      // Chain
      return Promise.all(data.map(createIdentity)).then(createAttestations);
    };

    self.exportIdentities = function(){
      var identities = Identity.getIdentities();
      $log.debug('Exporting', identities.length,"identities");

      var readAssertions = function(identity){
        if ( identity.contractAddress ){
           return Promise.all(IdentityContract.assertionTypeIds.map(function(assertionType){
             return IdentityContract.readAssertion(identity, identity.contractAddress, assertionType)
               .then(function(assertionValue){
                 return {assertionType: assertionType, value:assertionValue}
               });
          })).then(function(assertions){
            return assertions.filter(function(a){
              return a.value != undefined;
            })
           }).then(function(assertions){
            var merged = {}
            for(var i=0; i < assertions.length; i++){
              merged[assertions[i].assertionType] = assertions[i].value;
            }
            return merged;
           });
         } else {
          return Promise.resolve({});
         }
      };

      var readGrants = function(identity){
        return IdentityContract.grants(identity)
      };

      var readAttestations = function(identity){
        var attestations = IdentityContract.attestations(identity);
        return Promise.resolve(attestations);
      };

      var exportIdentity = function(identity){
          var identityObject = Identity.get(identity);
          return Promise.all(
              [readAssertions(identityObject), readGrants(identityObject), readAttestations(identityObject)]
              ).then(function(results){
                  //return {identity: identity, assertions: results[0]}
                   var id = {};
                   id.email = identityObject.email;
                   id.passphrase = identityObject.passphrase;
                   id.secretSeed = identityObject.secretSeed;
                   id.eth = JSON.parse(identityObject.eth.serialize()); // avoid nested json
                   id.pgp = identityObject.pgp.armor();
                   id.contractAddress = identityObject.contractAddress;
                   id.assertions = results[0];
                   id.grants = results[1];
                   id.attestations = results[2];
                   return id;
          });
      };
      return Promise.all(identities.map(exportIdentity))
        .then(function(r){ return JSON.stringify(r);});
    };


  	//take an identity JSON, return an identity object
  	self.JSONKeysToIdentityObj = function (idJSON){
      var id = {};
      id.email = idJSON.email;
      id.passphrase = idJSON.passphrase;
      id.secretSeed = idJSON.secretSeed;
  		id.eth = LightWallet.keystore.deserialize(idJSON.eth,idJSON.passphrase);
      id.pgp = pgp.key.readArmored(idJSON.pgp).keys[0];
      id.pgp.decrypt(idJSON.passphrase);
      id.contractAddress = idJSON.contractAddress;
      return Identity.createIdentity(id.email, id.passphrase, id.secretSeed, id.pgp, id.eth, id.contractAddress);
  	};

  });
