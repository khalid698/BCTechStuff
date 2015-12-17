'use strict';

describe('Service: IdentityContract', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var IdentityContract;
  beforeEach(inject(function (_IdentityContract_) {
    IdentityContract = _IdentityContract_;
  }));

  it('should do something', function () {
    expect(!!IdentityContract).toBe(true);
  });

});
