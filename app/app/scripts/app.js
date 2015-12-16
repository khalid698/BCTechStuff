'use strict';

/**
 * @ngdoc overview
 * @name angularApp
 * @description
 * # angularApp
 *
 * Main module of the application.
 */

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

//var CryptoJS = require('crypto-js');

angular
  .module('angularApp', [
    'ngRoute',
    'LocalStorageModule'
  ])
  .constant('Config', {

  })
  .constant('moment', window.moment)
  .constant('web3', web3)
  .constant('pgp', window.openpgp)
  .constant('CryptoJS', window.crypto)
  .constant('LightWallet', window.lightwallet)
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
      .otherwise({
        redirectTo: '/'
      });
  });
