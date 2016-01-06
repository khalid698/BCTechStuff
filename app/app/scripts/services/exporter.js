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
  .service('Exporter', function ($log, Identity, pgp, LightWallet, IdentityContract) {

    var self = this;

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
          .then(function(grants){
            return grants.map(function(grant){
              // Replace contract address with email, contract addresses are no longer valid after chain reset.
              var grantedIdentity = Identity.getByAddress(grant.requestee)
              if ( grantedIdentity ) {
                grant.requestee = grantedIdentity.email;
                return grant;
              } else {
                return undefined;
              }
            }).filter(function(grant){return grant !== undefined; });
          });
      };

      var readAttestations = function(identity){
        return IdentityContract.attestations(identity)
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

  	//take an identity object, return JSON
  	self.identityObjToJSONKeys = function (identity){
      var id = {};
      id.email = identity.email;
      id.passphrase = identity.passphrase;
      id.secretSeed = identity.secretSeed;
      id.eth = identity.eth.serialize();
      id.pgp = identity.pgp.armor();
      id.contractAddress = identity.contractAddress;
      return id;
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
