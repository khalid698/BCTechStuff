'use strict';

/**
 * @ngdoc service
 * @name angularApp.helpers
 * @description
 * # helpers
 * Service in the angularApp.
 *
 * helpers = angular.element(document.body).injector().get('Helpers')
 */
angular.module('angularApp')
  .service('Helpers', function (IdentityContract, Identity) {
    var self=this;

    self.assertionLabelById = function(id){
      return IdentityContract.assertionById(id).label;
    };

    self.identityNameByAddress = function(address){
      return Identity.getByAddress(address).email;
    };

  });
