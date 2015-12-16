'use strict';

/**
 * @ngdoc service
 * @name angularApp.Identity
 * @description
 * # Identity
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('Identity', function ($log, pgp, Ethereum, LightWallet, localStorageService) {

    var self = this;

    self.email = '';
    self.privateKeyPassphrase = '';

    //PGP and Eth key holders
    self.privateKey = undefined;
    self.keyStore = undefined;


    // Key deletion and generation
    self.deleteKey = function() {
      self.privateKey = undefined;
      self.keyStore = undefined;
    };

    self.generateKey = function() {
      // Generate BIP32 seed
      var secretSeed = LightWallet.keystore.generateRandomSeed();
      // console.log(secretSeed);
      // Create keystore and add 5 addresses
      var keyStore = new LightWallet.keystore(secretSeed, self.privateKeyPassphrase);
      keyStore.generateNewAddress(self.privateKeyPassphrase,5);

      var options = {
        numBits: 4096,
        userId: self.email,
        passphrase: self.privateKeyPassphrase
      };
      $log.info('Generating key with options :');
      // $log.info(options);
      pgp.generateKeyPair(options).then(function(keypair) {
          // Add ethereum literal to private key
          // keypair.key.primaryKey.packets.push(symmetricallyEncrypted);
          // keypair = pgp.key.Key(keypair.key.toPacketlist());

          $log.info('Created PGP key');
          console.log(keypair);
          self.privateKey = keypair.key;
          self.keyStore = keyStore;
          //var privkey = keypair.privateKeyArmored;
          //var pubkey = keypair.publicKeyArmored;
          self.storeKey();
          self.storeKeyStore();
      });
    };

    self.storeKey = function() {
      localStorageService.set('privateKey', self.privateKey.armor());
    };

    self.storeKeyStore = function(){
      localStorageService.set('keyStore', self.keyStore.serialize());
    };

    self.readKeyStore = function() {
      var serializedKeyStore = localStorageService.get('keyStore');
      if(serializedKeyStore){
        self.keyStore = LightWallet.keystore.deserialize(serializedKeyStore,self.privateKeyPassphrase);

      }
    };

    self.readKey = function() {
      var privateKeyString = localStorageService.get('privateKey');
      self.privateKey = pgp.key.readArmored(privateKeyString).keys[0];
      if(self.privateKey){
        self.privateKey.decrypt('');
        //self.keystore = LightWallet.keystore.deserialize();
      }
      $log.info(self.privateKey);
    };

    /**
    * Returns the 'wallet' address
    */
    self.getAddress = function(){
      if (self.keyStore && self.keyStore.getAddresses().length > 0){
        return '0x'+self.keyStore.getAddresses()[0];
      } else {
        return undefined;
      }
    };
    /**
    * Returns the contract address
    */
    self.getContractAddress = function(){
      if (self.keyStore && self.keyStore.getAddresses().length > 0){
        return '0x'+self.keyStore.getAddresses()[1];
      } else {
        return undefined;
      }
    };


    // Assertions
    self.assertionTypes = {
      name: 1
    };

    self.generateAssertion = function(assertionType, assertionValue) {
      // Wrap the assertion in a self addressed pgp message
      pgp.encryptMessage(self.privateKey, assertionValue)
      .then(function (encrypted){
          $log.info(encrypted);
          return Ethereum.storeAssertion(self.keyStore, self.assertionTypes[assertionType], encrypted);
      }).then(function(result){
        $log.info(result);
      });
    };

    self.readKey();
    self.readKeyStore();
    console.log('Initialized Identity');
    console.log(self);


});
