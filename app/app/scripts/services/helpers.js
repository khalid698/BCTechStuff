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

    self.namesByAddress = {};

    self.assertionLabelById = function(id){
      return IdentityContract.assertionById(id).label;
    };

    self.identityNameByAddress = function(address){
      if ( self.namesByAddress[address] ){
        return self.namesByAddress[address];
      } else {
        self.namesByAddress[address] = Identity.getByAddress(address).email;
      }
      return self.namesByAddress[address];
    };

  });