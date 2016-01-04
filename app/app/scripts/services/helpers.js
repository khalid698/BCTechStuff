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

    self.getRequesteePGPFingerprint = function(ethAddress){
      var fingerprint = Identity.getByAddress(ethAddress).pgp.primaryKey.fingerprint;
      var ch = fingerprint.toUpperCase().split('');
      var l = ch.length;
      var shortened =  ch[l-16]+ch[l-15]+' '+ch[l-14]+ch[l-13]+' '+ch[l-12]+ch[l-11]+' '+ch[l-10]+ch[l-9]+' '+ch[l-8]+ch[l-7]+' '+ch[l-6]+ch[l-5]+' '+ch[l-4]+ch[l-3]+' '+ch[l-2]+ch[l-1];
      return shortened;
    };

    self.getRequesteeEthFingerprint = function(ethAddress){
      var fingerprint = ethAddress;
      var ch = fingerprint.toUpperCase().split('');
      var l = ch.length;
      var shortened =  ch[l-8]+ch[l-7]+' '+ch[l-6]+ch[l-5]+' '+ch[l-4]+ch[l-3]+' '+ch[l-2]+ch[l-1];
      return shortened;
    };

    self.exportKeys = function(data) {
      //get fingerprint for unique file names
      var fingerprint = data.pgp.primaryKey.fingerprint;

      if (!data) {
        console.error('No data');
        return;
      }

      if (typeof data === 'object') {
        data = JSON.stringify(data, undefined, 2);
      }

      var blob = new Blob([data], {type: 'text/json'}),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

      a.download = 'DIDkeys_'+fingerprint+'.json';
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initMouseEvent('click', true, false, window,
          0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    };

    self.importKeys = function (file) {

        Upload.upload({
            url: 'upload/url',
            data: {file: file, 'username': 'test'}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };

  });
