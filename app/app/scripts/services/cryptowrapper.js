'use strict';

/**
 * @ngdoc service
 * @name angularApp.CryptoWrapper
 * @description
 * # CryptoWrapper
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('CryptoWrapper', function () {

    var self = this;

    self.randomKey = function(){
      return window.CryptoJS.lib.WordArray.random(128/8).toString();
    };

    self.encryptValue = function(value, key){
      return window.CryptoJS.AES.encrypt(value,key);
    };

    self.decryptStringValue = function(encrypted, key){
      return window.CryptoJS.AES.decrypt(encrypted, key).toString(window.CryptoJS.enc.Utf8);
    };
  //   /**
  //   *
  //   */
  //   self.encrypt = function(value, privateKey) {
  //     // Generate new random encryption key for this assertion
  //     var assertionKey = CryptoJS.lib.WordArray.random(128/8).toString(); // example "883bdecfed2846dafcaa2d1a4e4a47a2"
  //     // Use our newly generated key to encrypt the assertion value
  //     var encryptedAssertionValue = self.encryptValue(value, assertionKey); //CryptoJS.AES.encrypt(value,assertionKey);
  //     // Use our private key to encrypt the assertionKey so we're the only one able to decrypt the actual key and thus the value
  //     var encryptedAssertionKey = self.encryptValue(assertionKey, privateKey); // CryptoJS.AES.encrypt(assertionKey, privateKey);
  //     return {
  //       encryptedAssertion: encryptedAssertionValue.toString(),
  //       encryptedAssertionKey: encryptedAssertionKey.toString()
  //     };
  //   };

  // /**
  // both encrypted value should be passed in as string formatted : U2FsdGVkX18JytpnqYeh4tx4ZEjHTowbl....
  // */
  // self.decryptAssertion = function(encryptedAssertionKey, encryptedAssertion, privateKey) {
  //   var decryptedAssertionKey = CryptoJS.AES.decrypt(encryptedAssertionKey, privateKey).toString(CryptoJS.enc.Utf8); // ;
  //   // decryptedAssertionKey should now be back to the same form as it was after generate , example "883bdecfed2846dafcaa2d1a4e4a47a2"
  //   // CryptoJS.AES.decrypt("U2FsdGVkX1/JizQazjQ0i56ddWxrAMSsF4endTbuEF4=", "883bdecfed2846dafcaa2d1a4e4a47a2").toString(CryptoJS.enc.Utf8);
  //     return CryptoJS.AES.decrypt(encryptedAssertion, decryptedAssertionKey).toString(CryptoJS.enc.Utf8);
  // };

});
