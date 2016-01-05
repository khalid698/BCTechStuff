'use strict';

/**
 * @ngdoc service
 * @name angularApp.exporter
 * @description
 * # exporter
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('Exporter', function (Identity, pgp, LightWallet) {

    var self = this;

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
  	}

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
      return Identity.createIdentity(id.email, id.passphrase, id.secretSeed, id.pgp, id.eth, id.contractAddress)
  	}

  });
