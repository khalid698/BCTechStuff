'use strict';

describe('Controller: IdentitiesCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var IdentitiesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IdentitiesCtrl = $controller('IdentitiesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IdentitiesCtrl.awesomeThings.length).toBe(3);
  });
});
