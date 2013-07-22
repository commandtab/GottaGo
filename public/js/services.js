// Generated by CoffeeScript 1.6.2
var GGAppAPIUrl, services;

services = angular.module('gottaGo.services', ['ngResource']);

GGAppAPIUrl = "/api";

services.factory("Status", function($http) {
  return {
    'get': function() {
      return $http({
        method: "GET",
        url: "/api/status"
      });
    }
  };
});

services.factory("Que", function($http) {
  return {
    'get': function(floor) {
      return $http({
        method: "GET",
        url: "/api/que/" + floor
      });
    },
    'post': function(floor, data) {
      return $http({
        method: "POST",
        url: "/api/que/" + floor,
        data: data
      });
    }
  };
});

services.factory('socket', function($rootScope) {
  var socket;

  socket = window.io.connect('/');
  return {
    on: function(eventName, callback) {
      return socket.on(eventName, function() {
        var args;

        args = arguments;
        return $rootScope.$apply(function() {
          return callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      return socket.emit(eventName, data, function() {
        var args;

        args = arguments;
        return $rootScope.$apply(function() {
          if (callback) {
            return callback.apply(socket, args);
          }
        });
      });
    }
  };
});
