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
    },
    getEmail: function() {
      return window.localStorage.getItem("username");
    },
    getPassword: function() {
      return window.localStorage.getItem("password");
    },
    setAuthData: function(data) {
      window.localStorage.setItem("authData", JSON.stringify(data));
    }
  }
})


//****************************************************************************
//  LISTS
//****************************************************************************
.factory('Lists', ['$firebaseArray', function($firebaseArray) {
    var listsRef = new Firebase('https://zoy-client.firebaseio.com/lists');
    return {
      getAll: function() {
        return $firebaseArray(listsRef);
      }
    }
  }])
  //****************************************************************************
  //  POTS
  //****************************************************************************
  .factory('Pots', ['$firebaseArray', function($firebaseArray) {

    //var potsRef = new Firebase('https://zoy-client.firebaseio.com/pots');

    return {
      getAll: function(uid) {
        var userReference = fb.child("users/" + uid);
        var syncArray = $firebaseArray(userReference.child("pots"));
        return syncArray;
        //return $firebaseArray(potsRef);
      },
      getNew: function(uid) {
        var userReference = fb.child("users/" + uid);
        var syncArray = $firebaseArray(userReference.child("pots"));
        return syncArray;
      },
      get: function(uid) {
        console.log("call get");
      },
      add: function(pot) {
        var authData = JSON.parse(window.localStorage.getItem("authData"));
        var userReference = fb.child("users/" + authData.uid);
        var syncArray = $firebaseArray(userReference.child("pots"));
        syncArray.$add({
          'name': pot.name,
          'description': pot.description
        })

        /*$firebaseArray(potsRef).$add({
            'name': pot.name,
            'description': pot.description
        })*/
      },
      setStatus: function(pot, status) {
        var authData = JSON.parse(window.localStorage.getItem("authData"));
        var userReference = fb.child("users/" + authData.uid);
        var syncArray = $firebaseArray(userReference.child("pots/" + pot.$id));
        syncArray.child('status').set(status);


        /*var potRef = new Firebase('https://zoy-client.firebaseio.com/pots/' + pot.$id);
        potRef.child('status').set(status);*/

        if (status === 'removed') {
          potRef.remove();
        }
      },
      remove: function() {

      }
    }
  }]);
