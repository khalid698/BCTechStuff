'use strict';

/**
 * @ngdoc overview
 * @name angularApp
 * @description
 * # angularApp
 *
 * Main module of the application.
 */

angular
  .module('angularApp', [
    'LocalStorageModule',
    'ngProgress',
    'ui.router',
    'ui-notification'
  ])
  .constant('moment', window.moment)
  .constant('pgp', window.openpgp)
  .constant('CryptoJS', window.CryptoJS)
  .constant('LightWallet', window.lightwallet)
  .constant('Config', {gethEndpoint: 'http://localhost:8545'})
  .config(function ($stateProvider){
     $stateProvider.state('account', {
        url: '/',
        templateUrl: 'views/id/overview.html',
        controller: 'MainCtrl as main'
      })
      // Request entrypoint, pass in [requestee, assertionTypes and publicKey]
      .state('id', {
        url: '/id',
        abstract: true,
        template: '<ui-view/>',
        controller: 'IdentityCtrl as identity'
      })
      .state('id.assert', {
        url: '/assert',
        templateUrl: 'views/id/assert.html',
      })
      .state('id.request', {
        url: '/request?requestee&assertionTypes&publicKey',
        templateUrl: 'views/id/request.html',
      })

      .state('sign', {
        url: '/sign',
        templateUrl: 'views/sign.html',
        controller: 'SignCtrl as sign'
      })
      .state('bank', {
        url: '/bank',
        abstract: true,
        template: '<ui-view/>',
        controller: 'BankCtrl as bank'
      })
      // ALSO url '/home', overriding its parent's activation
      .state('bank.index', {
        url: '',
        templateUrl: 'views/bank/index.html'
      })
      // .state('bank.identities', {
      //   url: '/identities',
      //   templateUrl: 'views/bank/identities.html'
      // })
      .state('bank.request', {
        url: '/request',
        templateUrl: 'views/bank/request.html'
      })
      .state('identities', {
        url: '/identities',
        controller: 'IdentitiesCtrl as identities',
        templateUrl: 'views/identities.html'
      });
  })
  .run(function ($log, $rootScope, Identity, IdentityContract, Notification, localStorageService, Helpers){
    // 'Fixed' identities
    $rootScope.selectedIdentity = undefined; // Main user identity
    $rootScope.bankIdentity = undefined; // Bank ID


    $rootScope.assertionTypes = IdentityContract.assertionTypes;
    $rootScope.helpers = Helpers;

    $rootScope.selectIdentity = function(identity){
      $rootScope.selectedIdentity = Identity.get(identity);
      $log.info("Selected identity : ", $rootScope.selectedIdentity);
      Notification.success("Selected identity : " + $rootScope.selectedIdentity.email);
      localStorageService.set('selectedIdentity', identity);
    };
    $rootScope.selectBankIdentity = function(identity){
      $rootScope.bankIdentity = Identity.get(identity);
      $log.info("Selected bank identity : ", $rootScope.bankIdentity);
      Notification.success("Selected bank identity : " + $rootScope.bankIdentity.email);
      localStorageService.set('bankIdentity', identity);
    };


    $rootScope.loading = false;
    // Load stored identities
    var storedIdentity = localStorageService.get('selectedIdentity');
    if(storedIdentity){
      $rootScope.selectIdentity(storedIdentity);
    }
    storedIdentity = localStorageService.get('bankIdentity');
    if(storedIdentity){
      $rootScope.selectBankIdentity(storedIdentity);
    }

  })

  ;
