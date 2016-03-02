/**
 * Created by tangliang on 16/3/2.
 */
;(function(){
  angular.module('kfwApp',['ngRoute'])
    .config(['$routeProvider',function($routeProvider){
      $routeProvider
        .when('/login',{
          templateUrl:'login.html',
          controller:'loginControl'
        })
        .when('/register',{
          templateUrl:'register.html',
          controller:'registerControl'
        })
        .when('/friend',{
          templateUrl:'friend.list.html',
          controller: 'friendControl'
        })
        .when('/room/:name',{
          templateUrl:'room.html',
          controller:'roomControl'
        })
        .otherwise({
          redirectTo:'/register'
        });
    }])
    .factory('EasemobService',['$rootScope','$location',function($rootScope,$location){
      var conn = new Easemob.im.Connection();
      var friendObj = {};
      var msgObj = {};
      var userObj = {};
      friendObj.people = [];
      Easemob.im.config = {
        xmppURL: 'wss://im-api.easemob.com/ws/',
        apiURL: '',
        appkey: "baotang#test",
        https : true
      };
      conn.init({
        wait:'60',
        //当连接成功时的回调方法
        onOpened : function(){
          conn.getRoster({
            success : function(roster) {
              for(var i in roster){
                if(roster[i].subscription =='both' || roster[i].subscription=='to'){
                  friendObj.people.push(roster[i]);
                }else if(roster[i].subscription =='from'){
                  conn.subscribe({
                    to : roster[i].name,
                    message : "加个好友呗"
                  });
                }
              }
              $rootScope.$apply(function(){
                $location.path('/friend');
              });
              conn.setPresence();//设置用户上线状态，必须调用
            }
          });
          userObj.username = conn.context.userId;
          console.log(conn.isOpened());
          if (conn.isOpened()) {
            conn.heartBeat(conn);
          }
        },
        //当连接关闭时的回调方法
        onClosed : function() {
          alert("connection closed");
          conn.clear();
          conn.onClosed();
          conn = null;
        },
        //收到文本消息时的回调方法
        onTextMessage : function(message) {
          console.log(message);
          var link = message.from;
          if(!msgObj[link]){
            msgObj[link] = [];
          }
          $rootScope.$apply(function(){
            msgObj[link].push(message);
          });
          if($location.path().indexOf('room') < 0){
            alert("您有新消息:来自" + link);
          }
        },
        //异常时的回调方法
        onError : function(message) {
          alert(message.msg);
        },
        //收到联系人订阅请求的回调方法
        onPresence : function(message) {
          console.log(message);
          function agreeFriend(){
            var newFriendName = message.from;
            var newFriend = {
              name: newFriendName
            };
            //同意添加好友操作的实现方法
            conn.subscribed({
              to : message.from,
              message : "[resp:true]"
            });
            $rootScope.$apply(function(){
              friendObj.people.push(newFriend);
            });
          }
          if (message.type == 'subscribe') {
            //同意添加好友操作的实现方法
            agreeFriend();
            //反向加好友
            conn.subscribe({
              to : message.from,
              message : "[resp:true]"
            });
          }
        }
      });
      return {
        Easemob: Easemob,
        conn: conn,
        friend: friendObj,
        msgObj: msgObj,
        userObj: userObj
      };
    }])
    .controller('loginControl',['$scope','$location','EasemobService',function($scope,$location,EasemobService){
      $scope.loginUser = {};
      $scope.login = function(){
        EasemobService.conn.open({
          apiUrl : EasemobService.Easemob.im.config.apiURL,
          user : $scope.loginUser.name,
          pwd : $scope.loginUser.pwd,
          appKey : EasemobService.Easemob.im.config.appkey
        });
      };
      $scope.goRegister = function(){
        $location.path('/register');
      }
    }])
    .controller('registerControl',['$scope','$location','EasemobService',function($scope,$location,EasemobService){
      $scope.regUser = {};
      $scope.register = function(){
        var opt = {
          username : $scope.regUser.name,
          password : $scope.regUser.pwd,
          appKey : EasemobService.Easemob.im.config.appkey,
          success : function(result) {
            alert("注册成功!");
            console.log(result);
            EasemobService.conn.open({
              user : opt.username,
              pwd : opt.password,
              appKey : opt.appKey
            });
            $scope.$apply(function(){
              $location.path('/friend');
            });
          },
          error : function(e) {
            alert(e.error);
          }
        };
        EasemobService.Easemob.im.Helper.registerUser(opt);
      };
      $scope.goLogin = function(){
        $location.path('/login');
      };
    }])
    .controller('roomControl',['$scope','$routeParams','EasemobService',function($scope,$routeParams,EasemobService){
      $scope.friendName = $routeParams.name;
      $scope.userObj = EasemobService.userObj;
      $scope.msgArrObj = EasemobService.msgObj;
      $scope.myMsg = {};
      $scope.sendMsg = function(){
        var link = $scope.friendName;
        var sendMsgObj = {
          from:$scope.userObj.username,
          to:link,
          data: $scope.myMsg.content
        };
        EasemobService.conn.sendTextMessage({
          to : link,
          msg : sendMsgObj.data,
          type:'chat'
        });
        $scope.myMsg.content = "";
        if(!EasemobService.msgObj[link]){
          EasemobService.msgObj[link] = [];
        }
        EasemobService.msgObj[link].push(sendMsgObj);
        console.log(EasemobService.msgObj[link]);
      };
    }])
    .controller('friendControl',['$scope','$location','EasemobService',function($scope,$location,EasemobService){
      $scope.friend = {};
      $scope.friends = EasemobService.friend.people;
      $scope.goChartRoom = function(name){
        $location.path('/room/'+ name);
      };
      $scope.addFriend = function(){
        EasemobService.conn.subscribe({
          to : $scope.friend.name,
          message : "加个好友呗"
        });
      };
    }]);
})();