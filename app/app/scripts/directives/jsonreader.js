'use strict';

/**
 * @ngdoc directive
 * @name angularApp.directive:jsonReader
 * @description
 * # jsonReader
 */
angular.module('angularApp')
  .directive('jsonReader', function ($rootScope, Identity, Exporter) {
	return {
	    scope: {
	      jsonReader:"="
	    },
	    link: function(scope, element) {
	      $(element).on('change', function(changeEvent) {
	        var files = changeEvent.target.files;
	        if (files.length) {
	          var r = new FileReader();
	          r.onload = function(e) {
	              var contents = e.target.result;
	              //convert contents to JSON
	              var data = JSON.parse(contents);
	              //convert JSON to an identity object
                $rootScope.progressbar.init(1, 'Importing identities');
		            var identity = Exporter.importIdentities(data).then(function(){
                    $rootScope.progressbar.bump();
                    scope.$apply();
                })
	              //store identity object in local storage
	              // Identity.store(identity);
	          };
	          r.readAsText(files[0]);
	        }
	      });
	    }
	  };
  });
