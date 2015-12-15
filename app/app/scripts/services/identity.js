'use strict';

/**
 * @ngdoc service
 * @name angularApp.Identity
 * @description
 * # Identity
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('Identity', function ($log, pgp, LocalUser, LightWallet) {

    var self = this;

    self.GenerateKey = function() {
      // $log.info('Generating key for : '+LocalUser.email);
      // console.log(CryptoJS);

      var options = {
        numBits: 2048,
        userId: LocalUser.email,
        passphrase: LocalUser.privateKeyPassphrase
      };
      $log.info('Generating key with options :');
      $log.info(options);
      pgp.generateKeyPair(options).then(function(keypair) {
          // success
          $log.info('Created PGP key');
          var secretSeed = LightWallet.keystore.generateRandomSeed();
          var generatedKey = keypair;
          console.log(secretSeed);
          console.log(generatedKey);
          //LocalUser.privateKey = keypair.privateKeyArmored;
          //var privkey = keypair.privateKeyArmored;
          //var pubkey = keypair.publicKeyArmored;
          //LocalUser.storeKey();
      }).catch(function(error) {
          console.log(error);
      });

      // kbpgp.KeyManager.generate_ecc({ userid : LocalUser.email }, function(_, Charlie) {
      //   // console.log(Charlie);
      //   Charlie.sign({}, function() {
      //      console.log('Generating private key with passphrase : '+LocalUser.privateKeyPassphrase);
      //      Charlie.export_pgp_private ({
      //         passphrase: LocalUser.privateKeyPassphrase
      //       }, function(err, pgp_private) {
      //         //console.log('private key: ', pgp_private);
      //         console.log('Update privateKey');
      //         LocalUser.privateKey = pgp_private;
      //         LocalUser.storeKey();
      //     });
      //   });
    };


});
