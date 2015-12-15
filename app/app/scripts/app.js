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
web3.setProvider();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

angular
  .module('angularApp', [
    'ngRoute',
    'LocalStorageModule'
  ])
  .constant('kbpgp', window.kbpgp )
  .constant('web3', web3)
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
