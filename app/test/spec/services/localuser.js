'use strict';

describe('Service: LocalUser', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var LocalUser;
  beforeEach(inject(function (_LocalUser_) {
    LocalUser = _LocalUser_;
  }));

  it('should do something', function () {
    expect(!!LocalUser).toBe(true);
  });

});
