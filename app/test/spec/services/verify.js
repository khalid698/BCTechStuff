'use strict';

describe('Service: verify', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var verify;
  beforeEach(inject(function (_verify_) {
    verify = _verify_;
  }));

  it('should do something', function () {
    expect(!!verify).toBe(true);
  });

});
