'use strict';

describe('Service: Ethereum', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Ethereum;
  beforeEach(inject(function (_Ethereum_) {
    Ethereum = _Ethereum_;
  }));

  it('should do something', function () {
    expect(!!Ethereum).toBe(true);
  });

});
