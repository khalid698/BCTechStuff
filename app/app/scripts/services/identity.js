'use strict';

/**
 * @ngdoc service
 * @name angularApp.Identity
 * @description
 * # Identity
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('Identity', function ($log, pgp, Ethereum, LightWallet, localStorageService, CryptoWrapper) {

    var self = this;

    self.email = '';
    self.privateKeyPassphrase = '';

    //PGP and Eth key holders
    self.privateKey = undefined;
    self.keyStore = undefined;
    self.contractAddress = undefined;

    // Key deletion and generation
    self.deleteKey = function() {
      self.privateKey = undefined;
      self.keyStore = undefined;
      self.contractAddress = undefined;
      localStorageService.clear();
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

    self.deleteContract = function(){
      var callback = function(e,res){
        if ( e === undefined){
          $log.info('Deleted contract at : '+self.contractAddress);
          self.contractAddress = undefined;
          self.storeContractAddress();
        }
        $log.debug(res);
      };
      $log.info('Deleting contract at : '+self.contractAddress);
      Ethereum.deleteContract(self.keyStore, self.contractAddress, callback);
    };

    /**
    * Returns the 'wallet' address
    */
    self.getAddress = function(){
      if (self.keyStore && self.keyStore.getAddresses().length > 0){
        return self.keyStore.getAddresses()[0];
      } else {
        return undefined;
      }
    };

    // Assertions
    self.assertionTypes = {
      name: 1
    };

    self.generateAssertion = function(assertionType, assertionValue) {
      // Generate unique enryption key for this assertion
      var sessionKey = CryptoWrapper.randomKey();
      // Encrypt assertion with generated random key
      var encryptedAssertion = CryptoWrapper.encryptValue(assertionValue, sessionKey);
      $log.info(encryptedAssertion)
      // Encrypt session key to self
      pgp.encryptMessage(self.privateKey, sessionKey).then(function (encrypted){
          $log.info(encrypted);
          return Ethereum.assert(self.keyStore, self.contractAddress, self.assertionTypes[assertionType], encrypted, encryptedAssertion);
      }).then(function(result){
        $log.info(result);
      });
    };

    self.readAssertion = function(assertionType, callback){
      // var resultHandler = function(error, result){
      //   $log.info(assertion);
      //   var sessionKey = pgp.decryptMessage(self.privateKey, assertion[0]);
      //   var decryptedAssertion = CryptoWrapper.decryptStringValue(assertion[1], sessionKey);
      //   callback(decryptedAssertion);
      // };
      var result = Ethereum.get(self.keyStore, self.contractAddress, self.assertionTypes[assertionType]);
      var sessionKey = pgp.decryptMessage(self.privateKey, openpgp.message.readArmored(result[0])).then(function(decryptedSessionKey){
         var decryptedAssertion = CryptoWrapper.decryptStringValue(result[1], decryptedSessionKey);
         callback(decryptedAssertion);
      })
    };

    // Local storage
    self.readKey = function() {
      var privateKeyString = localStorageService.get('privateKey');
      self.privateKey = pgp.key.readArmored(privateKeyString).keys[0];
      if(self.privateKey){
        self.privateKey.decrypt('');
        //self.keystore = LightWallet.keystore.deserialize();
      }
      $log.info(self.privateKey);
    };
    self.readKeyStore = function() {
      var serializedKeyStore = localStorageService.get('keyStore');
      if(serializedKeyStore){
        self.keyStore = LightWallet.keystore.deserialize(serializedKeyStore,self.privateKeyPassphrase);

      }
    };
    self.readContractAddress = function() {
      self.contractAddress = localStorageService.get('contractAddress');
      $log.debug('Read contract address : '+self.contractAddress);
    };

    self.storeKey = function() {
      localStorageService.set('privateKey', self.privateKey.armor());
    };

    self.storeKeyStore = function(){
      localStorageService.set('keyStore', self.keyStore.serialize());
    };
    self.storeContractAddress = function(){
      $log.debug('Storing contract address : '+self.contractAddress);
      localStorageService.set('contractAddress', self.contractAddress);
    };

    // Startup
    self.readKey();
    self.readKeyStore();
    self.readContractAddress();
    console.log('Initialized Identity');
    console.log(self);


});
