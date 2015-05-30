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
    getEmail: function() {
      return window.localStorage.getItem("username");
    },
    getPassword: function() {
      return window.localStorage.getItem("password");
    },
    getBudget: function() {
      return Number.parseInt(window.localStorage.getItem("budget"));
    },
    getUser: function() {
      var user = {
        username: this.getEmail(),
        password: this.getPassword(),
        budget: this.getBudget()
      };
      return user;
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
        var uR = fb.child("users/" + uid);
        var sync = $firebaseArray(uR.child("pots"));
        return sync;
      },
      getNew: function(uid) {
        var uR = fb.child("users/" + uid);
        var sync = $firebaseArray(uR.child("pots"));
        return sync;
      },
      get: function(potId) {
        console.log("call Pots.get() for more details with Pot ID: " + potId);
        var authData = JSON.parse(window.localStorage.getItem("authData"));
        var uR = fb.child("users/" + authData.uid + "/pots/" + potId);
        return uR;

      },
      add: function(pot) {
        var authData = JSON.parse(window.localStorage.getItem("authData"));
        var uR = fb.child("users/" + authData.uid);
        var syncArray = $firebaseArray(uR.child("pots"));
        syncArray.$add({
          'name': pot.name,
          'description': pot.description
        });
      },
      addItem: function(pot) {
        var authData = JSON.parse(window.localStorage.getItem("authData"));
        var uR = fb.child("users/" + authData.uid);
        var syncArray = $firebaseArray(uR.child("pots/" + pot.potId));
        syncArray.$add({
          'name': pot.name,
          'date': pot.date.toString(),
          'amount': pot.amount,
          'isItem': true
        });
      },
      setStatus: function(pot, status) {
        var authData = JSON.parse(window.localStorage.getItem("authData"));
        var userReference = fb.child("users/" + authData.uid + "/pots/" + pot.$id);
        userReference.child('status').set(status);


        /*var authData = JSON.parse(window.localStorage.getItem("authData"));
        var userReference = fb.child("users/" + authData.uid);
        var syncArray = $firebaseArray(userReference.child("pots/" + pot.$id));
        syncArray.child('status').set(status);*/

        /*var potRef = new Firebase('https://zoy-client.firebaseio.com/pots/' + pot.$id);
        potRef.child('status').set(status);*/

        if (status === 'removed') {
          userReference.remove();
        }
      },
      remove: function() {

      }
    }
  }]);
