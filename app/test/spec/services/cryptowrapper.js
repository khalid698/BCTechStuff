'use strict';

describe('Service: CryptoWrapper', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var CryptoWrapper;
  beforeEach(inject(function (_CryptoWrapper_) {
    CryptoWrapper = _CryptoWrapper_;
  }));

  it('should do something', function () {
    expect(!!CryptoWrapper).toBe(true);
  });

});
