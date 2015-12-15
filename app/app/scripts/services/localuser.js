'use strict';

/**
 * @ngdoc service
 * @name angularApp.LocalUser
 * @description
 * # LocalUser
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('LocalUser', function (localStorageService) {
    var self = this;

    self.email = '';
    self.privateKeyPassphrase = '';
    self.privateKey = undefined;

    self.getAddress = function() {
      return '0x3e0d0e42ce28b5ae471dfc4ade385a4bf39dc8a9';
    };

    self.storeKey = function() {
      localStorageService.set('privateKey', self.privateKey);
    };

    self.readKey = function() {
      self.privateKey = localStorageService.get('privateKey');
    };

    self.hasKey = function(){
      return localStorageService.get('privateKey') !== '';
    };

    self.readKey();

  });
