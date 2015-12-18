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
        templateUrl: 'views/main.html',
        controller: 'MainCtrl as main'
      })
      .state('assert', {
        url: '/assert',
        templateUrl: 'views/assert.html',
        controller: 'AssertCtrl as assert'
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
      .state('bank.identities', {
        url: '/identities',
        templateUrl: 'views/bank/identities.html'
      })
      .state('bank.request', {
        url: '/request',
        templateUrl: 'views/bank/request.html'
      })
  })
  .run(function ($log, $rootScope, Identity, IdentityContract, Notification, localStorageService, Helpers){
    $rootScope.identities = Identity.getIdentities();
    $rootScope.selectedIdentity = undefined;
    $rootScope.assertionTypes = IdentityContract.assertionTypes;
    $rootScope.helpers = Helpers;

    $rootScope.selectIdentity = function(identity){
      $rootScope.selectedIdentity = Identity.get(identity);
      $log.info("Selected identity : ", $rootScope.selectedIdentity);
      Notification.success("Selected identity : " + $rootScope.selectedIdentity.email);
      localStorageService.set('selectedIdentity', identity);
    };

    $rootScope.loading = false;
    // Load stored identity
    var storedIdentity = localStorageService.get('selectedIdentity');
    if(storedIdentity){
      $rootScope.selectIdentity(storedIdentity);
    }
  })

  ;
