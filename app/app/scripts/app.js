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
    'LocalStorageModule'
  ])
  .constant('Config', {

  })
  .constant('moment', window.moment)
//  .constant('web3', web3)
  .constant('pgp', window.openpgp)
  .constant('CryptoJS', window.crypto)
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
  });
