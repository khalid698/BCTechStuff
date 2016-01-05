'use strict';

/**
 * @ngdoc service
 * @name angularApp.Identity
 * @description
 * # Identity
 * Service in the angularApp.
 */

 function Identity( email, passphrase, secretSeed, pgp, eth, contractAddress) {
  this.email = email;
  this.passphrase = passphrase;
  this.secretSeed = secretSeed;
  this.pgp = pgp;
  eth.passwordProvider = function(e){ e(null, passphrase );};
  this.eth = eth;

  this.contractAddress = contractAddress;

  this.pgpUserId = function() {
    return this.pgp.users[0].userId.userid;
  };

  this.pgpFingerprint = function(){
    return this.pgp.primaryKey.fingerprint;
  };

  this.pgpPublicKey = function(){
    return pgp.toPublic().armor();
  };

  this.ethAddress = function(){
    return '0x'+this.eth.getAddresses()[0];
  };

  this.hasContract = function(){
    return this.contractAddress !== undefined;
  };
}

angular.module('angularApp')
  .service('Identity', function ($log, pgp, Ethereum, LightWallet, localStorageService, Notification) {

    var self = this;

    /**
    * Generate PGP and Ehtereum private key
    */
    self.generateIdentity = function(email, passphrase, callback) {
      // Generate ethereum
      var secretSeed = LightWallet.keystore.generateRandomSeed();
      var keyStore = new LightWallet.keystore(secretSeed, passphrase);
      keyStore.generateNewAddress(passphrase,5);
      Notification.info("New Ethereum Address generated");
      // Generate PGP
      var options = {
        numBits: 1024,
        userId: email,
        passphrase: passphrase
      };
      pgp.generateKeyPair(options).then(function(keypair) {
          //Store new identity and call backback
          var identity = new Identity(email,passphrase,secretSeed,keypair.key, keyStore, undefined);
          $log.info("Created identity",identity);
          Notification.info("PGP Key generated");
          self.store(identity);
          callback(identity);
      });
    };

    self.store = function(identity){
      var storageHolder = {};
      storageHolder.email = identity.email;
      storageHolder.passphrase = identity.passphrase;
      storageHolder.secretSeed = identity.secretSeed;
      storageHolder.eth = identity.eth.serialize();
      storageHolder.pgp = identity.pgp.armor();
      storageHolder.contractAddress = identity.contractAddress;

      localStorageService.set(identity.email, storageHolder);
      var identities = localStorageService.get('identities');
      if ( identities.lastIndexOf(identity.email) === -1 ){
        identities.push(identity.email);
        localStorageService.set('identities', identities);
      }
    };

    self.getByAddress = function(address){
      var identities = self.getIdentities();
      for(var id in identities){
        var storedId = self.get(identities[id]);
        if(storedId.ethAddress() == address){
          return storedId;
        }
      }
    };

    self.get = function(email){
      $log.debug("Loading identity ", email);
      var storageHolder = localStorageService.get(email);
      if(!storageHolder){
        return undefined;
      }
      storageHolder.eth = LightWallet.keystore.deserialize(storageHolder.eth,storageHolder.passphrase);
      storageHolder.pgp = pgp.key.readArmored(storageHolder.pgp).keys[0];
      storageHolder.pgp.decrypt(storageHolder.passphrase);
      return new Identity(storageHolder.email, storageHolder.passphrase, storageHolder.secretSeed,  storageHolder.pgp, storageHolder.eth, storageHolder.contractAddress );
    };

    self.delete = function(email){
      $log.info('Deleting identity', email)
      localStorageService.remove(email);
      var identities = localStorageService.get('identities');
      identities = identities.filter(function(i){ return i !== email});
      localStorageService.set('identities', identities);
      self.init();
    };

    self.getIdentities = function() {
      return localStorageService.get('identities');
    };

    self.init = function() {
      var identities = localStorageService.get('identities');
      $log.info("Known identities : ");
      $log.info(identities);
      if(!identities) {
        $log.info("Creating identities local storage");
        localStorageService.set('identities', []);
      }
    };

    self.createIdentity = function (email, passphrase, secretSeed, pgp, eth, contractAddress) {
      return new Identity(email, passphrase, secretSeed, pgp, eth, contractAddress)
    }

    // Startup
    self.init();

});
