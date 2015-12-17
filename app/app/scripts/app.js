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
    'ngRoute',
    'LocalStorageModule',
    'ngProgress',
    'ui-notification'
  ])
  .constant('Config', {

  })
  .constant('moment', window.moment)
  .constant('pgp', window.openpgp)
  .constant('CryptoJS', window.CryptoJS)
  .constant('LightWallet', window.lightwallet)
  .constant('Config', {gethEndpoint: 'http://localhost:8545'})
  .config(function ($routeProvider) {
    $routeProvider
      .when('/assert', {
        templateUrl: 'views/assert.html',
        controller: 'AssertCtrl',
        controllerAs: 'assert'
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/bank', {
        templateUrl: 'views/bank.html',
        controller: 'BankCtrl',
        controllerAs: 'bank'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function ($log, $rootScope, Identity, Notification){
    $rootScope.identities = Identity.getIdentities();
    $rootScope.selectedIdentity = undefined;

    $rootScope.selectIdentity = function(identity){
      $rootScope.selectedIdentity = Identity.get(identity);
      $log.info("Selected identity : ", $rootScope.selectedIdentity);
      Notification.success("Selected identity : " + $rootScope.selectedIdentity.email);
    };

  })

  ;
