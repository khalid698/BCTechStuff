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

    self.assertionFormatById = function(id){
      return IdentityContract.assertionById(id).format;
    };

    self.getDateFormat = function(){
      return 'yyyy - MMMM - dd';
    };

    self.dateConverter = function(dateString){
      return new Date(dateString);
    };

    self.getRequesteeEmail = function(ethAddress){
      return Identity.getByAddress(ethAddress).email;
    };

    self.getRequesteeFingerprint = function(ethAddress){
      var fingerprint = Identity.getByAddress(ethAddress).pgp.primaryKey.fingerprint;
      var ch = fingerprint.toUpperCase().split('');
      var l = ch.length;
      var shortened =  ch[l-8]+ch[l-7]+' '+ch[l-6]+ch[l-5]+' '+ch[l-4]+ch[l-3]+' '+ch[l-2]+ch[l-1];
      return shortened;
    };


  });
