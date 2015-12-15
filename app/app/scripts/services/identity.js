'use strict';

/**
 * @ngdoc service
 * @name angularApp.Identity
 * @description
 * # Identity
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('Identity', function (kbpgp, LocalUser) {

    var self = this;

    self.GenerateKey = function() {
      console.log('Generating keyset for '+LocalUser.email);
      kbpgp.KeyManager.generate_ecc({ userid : LocalUser.email }, function(_, Charlie) {
        // console.log(Charlie);
        Charlie.sign({}, function() {
           console.log('done!');
           Charlie.export_pgp_private ({
              passphrase: 'booyeah!'
          }, function(err, pgp_private) {
              console.log('private key: ', pgp_private);
          });
        });
      });
    };

});
