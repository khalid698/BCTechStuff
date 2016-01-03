'use strict';

describe('Controller: AttestationctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var AttestationctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AttestationctrlCtrl = $controller('AttestationctrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AttestationctrlCtrl.awesomeThings.length).toBe(3);
  });
});
