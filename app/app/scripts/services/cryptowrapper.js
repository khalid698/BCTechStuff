'use strict';

/**
 * @ngdoc service
 * @name angularApp.CryptoWrapper
 * @description
 * # CryptoWrapper
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('CryptoWrapper', function (CryptoJS) {

    var self = this;

    self.randomKey = function(){
      return CryptoJS.lib.WordArray.random(128/8).toString();
    };

    self.encryptValue = function(value, key){
      var opensslFormatted = CryptoJS.AES.encrypt(value,key).toString();
      return asciiToHex(opensslFormatted);
    };

    self.decryptStringValue = function(encrypted, key){
      var opensslFormatted = hexToAscii(encrypted);
      return CryptoJS.AES.decrypt(opensslFormatted, key).toString(CryptoJS.enc.Utf8);
    };

});
