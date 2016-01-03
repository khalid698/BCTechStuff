'use strict';

describe('Service: sign', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var sign;
  beforeEach(inject(function (_sign_) {
    sign = _sign_;
  }));

  it('should do something', function () {
    expect(!!sign).toBe(true);
  });

});
