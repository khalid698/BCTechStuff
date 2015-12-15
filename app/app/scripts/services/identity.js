'use strict';

/**
 * @ngdoc service
 * @name angularApp.Identity
 * @description
 * # Identity
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('Identity', function ($log, pgp, LightWallet, localStorageService) {

    var self = this;

    self.email = '';
    self.privateKeyPassphrase = '';

    //PGP and Eth key holders
    self.privateKey = undefined;
    self.keyStore = undefined;

    self.GenerateKey = function() {
      // Generate BIP32 seed
      var secretSeed = LightWallet.keystore.generateRandomSeed();
      // console.log(secretSeed);
      // Create keystore and add 5 addresses
      var keyStore = new LightWallet.keystore(secretSeed, "")
      keyStore.generateNewAddress("",5);

      // Store in PGP key literal
      // var literal = new pgp.packet.UserAttribute();
      // literal.setText(keyStore.serialize());
      // literal.setFilename('lightwallet.json');

      // var symmetricallyEncrypted = new pgp.packet.SymmetricallyEncrypted();
      // symmetricallyEncrypted.packets = new pgp.packet.List();
      // symmetricallyEncrypted.packets.push(literal);

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
    }

    self.readKeyStore = function() {
      var serializedKeyStore = localStorageService.get('keyStore');
      if(serializedKeyStore){
        self.keyStore = lightwallet.keystore.deserialize(serializedKeyStore,"");
      };
    }

    self.readKey = function() {
      var privateKeyString = localStorageService.get('privateKey');
      self.privateKey = pgp.key.readArmored(privateKeyString).keys[0];
      if(self.privateKey){
        self.privateKey.decrypt('');
        //self.keystore = LightWallet.keystore.deserialize();
      }
      $log.info(self.privateKey);
    };

    self.getAddress = function(){
      if (self.keyStore && self.keyStore.getAddresses().length > 0){
        return self.keyStore.getAddresses()[0];
      } else {
        return undefined;
      }
    }

    self.readKey();
    self.readKeyStore();



});
