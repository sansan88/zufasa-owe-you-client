angular.module('starter.services', [])
  //****************************************************************************
  //  USER
  //****************************************************************************
  .factory('User', ['$timeout', '$ionicPopup', '$firebaseArray', function($timeout, $ionicPopup, $firebaseArray) {
    /*******************************************************/
    // Create a callback which logs the current auth state
    /*******************************************************/
    function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
      } else {
        console.log("User is logged out");
      }
    };
    /*******************************************************/
    // Globale Funktionen                START
    /*******************************************************/
    function showAlert(message) {
      var alertPopup = $ionicPopup.alert({
        title: message.title,
        template: message.template
      });
      alertPopup.then(function(res) {
        console.log(message.logText);
      });
    };
    // ENDE
    //ENDE

    //Public Return Methods
    return {
      setUsername: function(username) {
        window.localStorage.setItem("username", username);
      },
      setPassword: function(password) {
        window.localStorage.setItem("password", password);
      },
      setBudget: function(budget) {
        Number.parseInt(window.localStorage.setItem("budget"), budget);
      },
      getUsername: function() {
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
          username: this.getUsername(),
          password: this.getPassword(),
          budget: this.getBudget()
        };
        return user;
      },
      setUser: function(user) {
        this.setUsername(user.username);
        this.setPassword(user.password);
        this.setBudget(user.budget);
      },

      loginUser: function(username, password) {
        fb.onAuth(authDataCallback);
        if (username && password) {
          fb.authWithPassword({
            email: username,
            password: password
          }, function(error, authData) {
            if (error) {
              var message = {
                title: "Login failed",
                template: "",
                logText: "Login failed" + error
              };
              showAlert(message);

            } else {
              var message = {
                title: "Authenticated successfully",
                template: "",
                logText: "Authenticated successfully"
              };
              showAlert(message);
            }
          });
        } else {
          var message = {
            title: 'No logindata available',
            template: '',
            logText: "No logindata available"
          };
          showAlert(message);
        }
      },
      logoutUser: function() {
        fb.unauth();
      },
      registerUser: function(register) {
        fb.createUser({
          email: register.username,
          password: register.pw
        }, function(error, userData) {
          if (error) {
            var title = 'Error creating user:';
            var template = error;
            var logText = "Error creating user:" + error;
            showAlert(message);

          } else {
            var message = {
              title: 'Successfully created user account',
              template: '',
              logText: "Successfully created user account with uid:" + userData.uid
            }
            showAlert(message);

            //$scope.showAlert(title, template, logText);

            /*$scope.user.password = $scope.register.pw;
            $scope.user.username = $scope.register.email;*/
            //$scope.saveUser();--> SET USER
          }
        });

      },
      changeUserPassword: function(user, newPW) {
        fb.changePassword({
          email: user.username,
          oldPassword: user.password,
          newPassword: newPW
        }, function(error) {
          if (error === null) {
            //console.log("Password changed successfully");
            var message = {
              title: 'Password changed successfully',
              template: '',
              logText: "Password changed successfully"
            }
            showAlert(message);

            //$scope.showAlert(title, template, logText);


            //$scope.user.password = newPW;
            //$scope.user.username = newEmail;
          } else {
            var message = {
              title: 'Error changing password',
              template: '',
              logText: "Error changing password" + error
            }
            showAlert(message);

            //$scope.showAlert(title, template, logText);

            //console.log("Error changing password:", error);
          }
        });

      },
      changeUserEmail: function(user, newEmail) {
        fb.changeEmail({
          oldEmail: user.username,
          newEmail: newEmail,
          password: user.password
        }, function(error) {
          if (error === null) {
            //console.log("Email changed successfully");
            var message = {
              title: 'Email changed successfully',
              template: '',
              logText: "Email changed successfully"
            }
            showAlert(message);

            //$scope.showAlert(title, template, logText);
            //$scope.user.username = newEmail;

          } else {
            //console.log("Error changing email:", error);
            var message = {
              title: 'Error changing email',
              template: '',
              logText: "Error changing email" + error
            }
            showAlert(message);
            //  $scope.showAlert(title, template, logText);
          }
        });
      },
      resetUserPW: function() {
        var username = this.getEmail();
        fb.resetPassword({
          email: username
        }, function(error) {
          if (error === null) {
            //console.log("Password reset email sent successfully");
            var title = 'Password reset email sent successfully';
            var template = '';
            var logText = "Password reset email sent successfully";
            //$scope.showAlert(title, template, logText);
          } else {
            var title = 'Error sending password reset email';
            var template = '';
            var logText = "Error sending password reset email" + error;
            //$scope.showAlert(title, template, logText);
            //console.log("Error sending password reset email:", error);
          }
        });
      },
      deleteUserData: function() {
        User.setBudget("");
        User.setPassword("");
        User.setEmail("");
      }
    }
  }])
  //****************************************************************************
  //  POTS
  //****************************************************************************
  .factory('Pots', ['$firebaseArray', '$ionicPopup', '$ionicListDelegate', function($firebaseArray, $ionicPopup, $ionicListDelegate) {

    //var potsRef = new Firebase('https://zoy-client.firebaseio.com/pots');

    return {
      getAll: function() {
        var fbAuth = fb.getAuth();
        if (fbAuth) {
          var uR = fb.child("users/" + fbAuth.uid);
          var sync = $firebaseArray(uR.child("pots"));
          sync.$loaded().then(function(data) {
            return data;
          });
        } else {
          var message = {
            title: 'Please Login first',
            template: '',
            logText: "Please Login first"
          }
          $scope.showAlert(message);
        }
      },
      getNew: function() {
        var fbAuth = fb.getAuth();
        if (fbAuth) {
          var uR = fb.child("users/" + fbAuth.uid);
          var sync = $firebaseArray(uR.child("pots"));
          sync.$loaded().then(function(data) {
            return data;
          });
        } else {
          var message = {
            title: 'Please Login first',
            template: '',
            logText: "Please Login first"
          }
          $scope.showAlert(message);
        }
      },
      get: function(potId) {
        var fbAuth = fb.getAuth();
        if (fbAuth) {
          console.log("call Pots.get() for more details with Pot ID: " + potId);
          //          var authData = JSON.parse(window.localStorage.getItem("authData"));
          var uR = fb.child("users/" + fbAuth.uid + "/pots/" + potId);
          return uR;
        }

      },
      add: function(pot) {
        var fbAuth = fb.getAuth();
        if (fbAuth) {
          //var authData = JSON.parse(window.localStorage.getItem("authData"));
          var uR = fb.child("users/" + fbAuth.uid);
          var syncArray = $firebaseArray(uR.child("pots"));
          syncArray.$add({
            'name': pot.name,
            'description': pot.description
          });
        }
      },
      addItem: function(pot) {
        var fbAuth = fb.getAuth();
        if (fbAuth) {
          var uR = fb.child("users/" + fbAuth.uid);
          var syncArray = $firebaseArray(uR.child("pots/" + pot.potId));
          syncArray.$add({
            'name': pot.name,
            'date': pot.date.toString(),
            'amount': pot.amount,
            'isItem': true
          });
        }
      },
      setStatus: function(pot, status) {
        var fbAuth = fb.getAuth();
        if (fbAuth) {
          var userReference = fb.child("users/" + fbAuth.uid + "/pots/" + pot.$id);
          userReference.child('status').set(status);

          if (status === 'removed') {
            userReference.remove();
          }
        }
      }
    }
  }]);
