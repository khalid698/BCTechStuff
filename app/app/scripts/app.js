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
  .config(function ($stateProvider, $urlRouterProvider){
     $urlRouterProvider.otherwise('/id/personal');
     $stateProvider.state('id', {
        url: '/id',
        abstract: true,
        templateUrl: 'views/id/index.html',
        controller: 'IdentityCtrl as identity',
      })
      .state('id.request', {
        url: '/request?requestee&assertionTypes&publicKey&description',
        templateUrl: 'views/id/request.html',
        activetab: 'access',
        views: {
          'left': {
            template: ''
          },
          'right': {
            templateUrl: 'views/id/partial/request.html',
          }
        }
      })
      .state('id.settings', {
        url: '/settings',
        //controller: 'MainCtrl as main',
        activetab: 'settings',
        displayAssertionTypes: [1,2,4,5],
        views: {
          'right': {
            templateUrl: 'views/id/partial/settings.html',
          }
        }
      })

      .state('id.personal', {
        url: '/personal',
        // controller: 'MainCtrl as main',
        activetab: 'myidentity',
        displayAssertionTypes: [1,2,4,5],
        views: {
          'left': {
            templateUrl: 'views/id/partial/left_nav_my_identity.html',
          },
          'right': {
            templateUrl: 'views/id/partial/assertions.html',
          }
        }
      })
      .state('id.contact', {
        url: '/contact',
        templateUrl: 'views/id/partial/assertions.html',
        // controller: 'MainCtrl as main',
        activetab: 'myidentity',
        displayAssertionTypes: [3,6],
        views: {
          'left': {
            templateUrl: 'views/id/partial/left_nav_my_identity.html',
          },
          'right': {
            templateUrl: 'views/id/partial/assertions.html',
          }
        }
      })
      .state('id.access', {
        url: '/access',
        templateUrl: 'views/id/partial/assertions.html',
        // controller: 'MainCtrl as main',
        activetab: 'access',
        views: {
          'left': {
            templateUrl: 'views/id/partial/left_nav_access.html',
          },
          'right': {
            templateUrl: 'views/id/partial/grantee.html',
          }
        }
      })
      //
      // .state('sign', {
      //   url: '/sign',
      //   templateUrl: 'views/sign.html',
      //   controller: 'SignCtrl as sign'
      // })
      //
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
      .state('bank.request', {
        url: '/request',
        templateUrl: 'views/bank/request.html'
      })
      // Identity management page
      .state('identities', {
        url: '/identities',
        controller: 'IdentitiesCtrl as identities',
        templateUrl: 'views/identities.html'
      })
      .state('attest', {
        url: '/attest',
        controller: 'AttestationCtrl as attestation',
        templateUrl: 'views/attestation/index.html'
      })
      ;
  })
  .run(function ($log, $rootScope, $state, Identity, IdentityContract, Notification, localStorageService, Helpers){
    // 'Fixed' identities
    $rootScope.selectedIdentity = undefined; // Main user identity
    $rootScope.bankIdentity = undefined; // Bank ID
    $rootScope.attestationIdentity = undefined;

    $rootScope.$state = $state;

    $rootScope.assertionTypes = IdentityContract.assertionTypes;
    $rootScope.helpers = Helpers;

    $rootScope.selectIdentity = function(identity){
      $rootScope.selectedIdentity = Identity.get(identity);
      $log.info("Selected identity : ", $rootScope.selectedIdentity);
      // Notification.success("Selected identity : " + $rootScope.selectedIdentity.email);
      localStorageService.set('selectedIdentity', identity);
    };
    $rootScope.selectBankIdentity = function(identity){
      $rootScope.bankIdentity = Identity.get(identity);
      $log.info("Selected bank identity : ", $rootScope.bankIdentity);
      // Notification.success("Selected bank identity : " + $rootScope.bankIdentity.email);
      localStorageService.set('bankIdentity', identity);
    };

    $rootScope.selectAttestationIdentity = function(identity){
      $rootScope.attestationIdentity = Identity.get(identity);
      $log.info("Selected attestationIdentity identity : ", $rootScope.attestationIdentity);
      // Notification.success("Selected bank identity : " + $rootScope.bankIdentity.email);
      localStorageService.set('attestationIdentity', identity);
    };


    $rootScope.progressbar = {
      steps: 0,
      progress: 0,
      title: ''
    };
    $rootScope.progressbar.init = function(steps, title){
      $rootScope.progressbar.steps = steps;
      $rootScope.progressbar.progress = 0;
      $rootScope.progressbar.title = title;
    };

    $rootScope.progressbar.active = function(){
      return $rootScope.progressbar.steps > 0 && $rootScope.progressbar.progress < $rootScope.progressbar.steps;
    };
    $rootScope.progressbar.percentage = function(){
        if ($rootScope.progressbar.progress > 0) {
          return Math.round(($rootScope.progressbar.progress/$rootScope.progressbar.steps)*100);
        } else {
          return 0;
        }
    };
    $rootScope.progressbar.bump = function(){
      $rootScope.progressbar.progress++;
    };

    // Load stored identities
    var storedIdentity = localStorageService.get('selectedIdentity');
    if(storedIdentity){
      $rootScope.selectIdentity(storedIdentity);
    };
    storedIdentity = localStorageService.get('bankIdentity');
    if(storedIdentity){
      $rootScope.selectBankIdentity(storedIdentity);
    };
    storedIdentity = localStorageService.get('attestationIdentity');
    if(storedIdentity){
      $rootScope.selectAttestationIdentity(storedIdentity);
    };

  })

  ;
