'use strict';

/**
 * @ngdoc directive
 * @name angularApp.directive:jsonReader
 * @description
 * # jsonReader
 */
angular.module('angularApp')
  .directive('jsonReader', function (Identity) {
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
	              //convert contents to JSON object
	              var data = JSON.parse(contents);
	              //load object to localStorage
	              Identity.restoreIdentity(data);
	          };
	          r.readAsText(files[0]);
	        }
	      });
	    }
	  };
  });
