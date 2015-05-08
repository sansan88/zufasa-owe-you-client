angular.module('starter.services', [])
  /*.factory('Firebase', function() {
    var myDataRef = new Firebase('https://zoy-client.firebaseio.com/');
    //Methods
    return {
      setItem2Pot: function(item) {
        myDataRef.push(item);
      },
    }
  })*/

//****************************************************************************
//  USER
//****************************************************************************
.factory('User', function() {
  //Public Return Methods
  return {
    getUser: function() {
      var user = {
        username: window.localStorage.getItem("username"),
        password: window.localStorage.getItem("password")
      };
      return user;
    }
  }
})


//****************************************************************************
//  LISTS
//****************************************************************************
.factory('Lists', ['$firebaseArray', function($firebaseArray) {
    var listsRef = new Firebase('https://zoy-client.firebaseio.com/lists');
    return {
      getAll: function(){
        $firebaseArray(listsRef);
      }
    }
  }])
//****************************************************************************
//  POTS
//****************************************************************************
.factory('Pots', ['$firebaseArray', function($firebaseArray) {
    var potsRef = new Firebase('https://zoy-client.firebaseio.com/pots');
    return {
        getAll: function(){
          $firebaseArray(potsRef);
        },
        getNew: function(){
          $firebaseArray(potsRef);
        },
        add: function(pot){
          $scope.pots.$add({
            'name': pot.name,
            'description': pot.description
        })},
        setStatus: function(pot, status){
          var potRef = new Firebase('https://zoy-client.firebaseio.com/pots/' + pot.$id);
          potRef.child('status').set(status);

          if (status === 'removed'){
            potRef.remove();
          }
        },
        remove: function(){

        }
    }
  }]
);
