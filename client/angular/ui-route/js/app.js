var app = angular.module('myApp',['ui.router']);
app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
  $stateProvider
    .state('inbox',{
      views:{
        'filters':{
          template:'<h4>Filter inbox</h4>',
          controller:function($scope){}
        },
        'mailbox':{
          templateUrl: './templates/mailbox.html'
        },
        'priority':{
          template: '<h4>Priority inbox</h4>',
          resolve: {
            facebook: function() {
              return {
                name:'facebook'
              };
            }
          }
        }
      },
      url:'/inbox'
    })
    .state('inbox.priority',{
      url:'/priority',
      template:'<h2>Your Priority inbox</h2>'
    })
    .state('home',{
        resolve: {
          //这个函数的值会被直接返回，因为它不是数据保证
          person: function () {
            return {
              name: "Ari",
              email: "ari@fullstack.io"
            };
          },
          //这个函数为数据保证, 因此它将在控制器被实例化之前载入。
          currentDetails: function($http) {
            return $http({
              method: 'GET',
              url:'http://mofanghr.com/api/internal/onsite-jobs/solr-search-info?deleted=false&start=0&count=15&province=北京'
            });

          }
        },
      template:'<h1>Hello {{person.name}}</h1>',
      controller: function($scope, person, currentDetails) {
        $scope.person = person;
        console.log(currentDetails);
      },
      url:'/home'
    })
    .state('admin', {
      abstract: true,
      url: '/admin',
      template: '<div ui-view></div>'
    })
    .state('admin.index', {
      url: '/index',
      template: '<h3>Admin index</h3>'
    })
    .state('admin.users', {
      url: '/users',
      template: '<ul>{{mf.name}}</ul>',
      resolve:{
        mf:function(){
        return {
          name:"mofang"
        };
      }},
      controller: function($scope,mf){
        $scope.mf = mf;
        console.log(mf);
      }
    });
}]);