'use strict';

describe('Service: CryptoWrapper', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var CryptoWrapper;
  beforeEach(inject(function (_CryptoWrapper_) {
    CryptoWrapper = _CryptoWrapper_;
  }));

  it('should encrypt and decrypt values', function () {
    var encryptionKey = CryptoWrapper.randomKey();
    console.log("encrypting using key "+encryptionKey);
    var encryptionValue = "top secret!";
    var encrypted = CryptoWrapper.encryptValue(encryptionValue, encryptionKey);
    console.log("encrypted into "+encrypted);
    var decryptedValue = CryptoWrapper.decryptStringValue(encrypted, encryptionKey);
    console.log("decrypted into "+decryptedValue);

    expect(decryptedValue).toBe(encryptionValue);
  });

});
