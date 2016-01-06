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
  .service('Helpers', function (IdentityContract, Identity, Exporter, $rootScope) {
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

    self.getMyId = function () {
      var ethAddress = $rootScope.selectedIdentity.ethAddress();
      return ethAddress;
    };

    self.exportKeys = function(identity) {
      //takes an identity object
      //get fingerprint for unique file names
      var fingerprint = identity.pgp.primaryKey.fingerprint;

      if (!identity) {
        console.error('No data');
        return;
      }
      var data;
      if (typeof identity === 'object') {
        data = JSON.stringify(Exporter.identityObjToJSONKeys(identity), undefined, 2);
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

    self.exportAllData = function() {

      var date = new Date().toISOString().slice(0, 19).replace(/:/g,"-")

      Exporter.exportIdentities().then(function(identities){
        if (!identities) {
          console.error('No data');
          return;
        }
        var data;
        if (typeof identities === 'string') {
          data = JSON.stringify(JSON.parse(identities), undefined, 2)
        }

        var blob = new Blob([data], {type: 'text/json'}),
          e = document.createEvent('MouseEvents'),
          a = document.createElement('a');

        a.download = 'DIDkeys_'+date+'.json';
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window,
            0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
        });
    };

    self.balance = function(identity){
      return Web3.getBalance(identity.ethAddress()).toString(10);
    };

  });
