/**
 * Created by tangliang on 16/2/28.
 */
requirejs.config({
  baseUrl:'../bower_components',
  paths:{
    'angular': 'angular/angular.min',
    'angular-route':'angular-route/angular-route.min'
  },
  shim:{
    'angular':{
      exports:'angular'
    }
  }
});
requirejs(['angular','angular-route'],function(angular){
  angular.module('KFW',['ngRoute'])
    .config(['$routeProvider',function($routeProvider){
      $routeProvider
        .when('/login',{
          templateUrl:'login.html',
          controller:'loginControl'
        })
        .when('./register',{
          templateUrl:'register.html',
          controller:'registerControl'
        })
        .when('./room',{
          templateUrl:'room.html',
          controller:'roomControl'
        })
        .otherwise({
          redirectTo:'/login'
        });
    }])
    .controller('loginControl',['$scope',function($scope){
      $scope.user = {};
    }])
    .controller('registerControl',['$scope',function($scope){

  }])
    .controller('roomControl',['$scope',function($scope){

    }]);
  angular.bootstrap(document,['KFW']);
});