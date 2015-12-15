'use strict';

/**
 * @ngdoc service
 * @name angularApp.Identity
 * @description
 * # Identity
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('Identity', function (kbpgp) {

    var self = this;

    self.GenerateKey = function() {
      console.log('Generating keyset');
      kbpgp.KeyManager.generate_rsa({ userid : 'Bo Jackson <user@example.com>' }, function(_, Charlie) {
        Charlie.sign({}, function() {
            console.log('done!');
        });
      });
    };

});
