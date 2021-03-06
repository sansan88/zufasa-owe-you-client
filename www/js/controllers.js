angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Pots, User, $state, $ionicPopup, $firebaseArray, $firebaseAuth) {
    console.log("Dash Ctrl");
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
    function getData() {
      var fbAuth = fb.getAuth();
      if (fbAuth) {
        Pots.getAll(fbAuth.uid).then(function(data) {
          //data.$bindTo($scope, "pots");

          $scope.pots = data;

          $scope.noPots = data.length;
          $scope.noPotItems = 0;
          $scope.totalSpendingsThisMonth = 0;

          var pots = data;
          var potItems = [];
          var date = new Date();
          var spendings = {};

          var month = date.getMonth() + 1;
          month = "" + month;
          if (month.slice(1) == false) {
            month = "0" + month;
          }

          //Loop über Alle Pots
          for (var i = 0; i < pots.length; i++) {
            //Position Data
            Pots.getItemArray(pots[i].$id, fbAuth.uid).then(function(items) {
              for (var i = 0; i <= items.length; i++) {
                try {
                  if (items[i].hasOwnProperty("isItem")) { // richtige position?
                    $scope.noPotItems++;

                    //spendings this month
                    if (items[i].date.slice(4, 6) == month && items[i].date.slice(0, 4) == date.getFullYear()) {
                      $scope.totalSpendingsThisMonth = $scope.totalSpendingsThisMonth + items[i].amount;
                    }

                    //spendingsarray init
                    if (!spendings[items[i].date.slice(0, 4) + items[i].date.slice(4, 6)]) {
                      spendings[items[i].date.slice(0, 4) + items[i].date.slice(4, 6)] = 0;
                    }
                    spendings[items[i].date.slice(0, 4) + items[i].date.slice(4, 6)] = spendings[items[i].date.slice(0, 4) + items[i].date.slice(4, 6)] + items[i].amount;
                  }
                } catch (err) {
                  console.log("no isItem property");
                }
              } //for
            }); //Get Ref from each pot
          };

          $scope.spendings = spendings;
          var chart = document.getElementById("myChart");
          if (chart) {
            var ctx = chart.getContext("2d");

            var label = [];
            var data = [];

            for (var i = 0; i < $scope.spendings.length; i++) {
              label.push($scope.spendings[i].key);
              data.push($scope.spendings[i].value);
            }

            var data = {
              labels: label,
              datasets: [{
                  label: "My spendings",
                  fillColor: "rgba(220,220,220,0.5)",
                  strokeColor: "rgba(220,220,220,0.8)",
                  highlightFill: "rgba(220,220,220,0.75)",
                  highlightStroke: "rgba(220,220,220,1)",
                  data: data
                }

                /*, {
                  label: "My Second dataset",
                  fillColor: "rgba(151,187,205,0.5)",
                  strokeColor: "rgba(151,187,205,0.8)",
                  highlightFill: "rgba(151,187,205,0.75)",
                  highlightStroke: "rgba(151,187,205,1)",
                  data: [28, 48, 40, 19, 86, 27, 90]
                }*/
              ]
            };
            var myBarChart = new Chart(ctx).Bar(data);
          }
          $scope.$apply();


        });
      } else {
        var message = {
          title: 'Please Login first',
          template: '',
          logText: "Please Login first"
        }
        showAlert(message);
        $state.go('tab.account');
      }


    };
    //Init
    $scope.refresh = function() {
        getData();
      }
      // Code mal noch beahlten!!!!!
      /*
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<label>Username:</label><input type="email" ng-model="data.username"><label>Password:</label><input type="password" ng-model="data.password">',
        title: 'Enter Logindata',
        subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Login</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.username || !$scope.data.password) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data;
            }
          }
        }]
      });
      myPopup.then(function(res) {
        console.log('Tapped!', res);
        User.loginUser(res.username, res.password);
        $state.go("dash");
      });
      $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 20000);*/

  })
  //****************************************************************************
  //  CONTROLLER POTS
  //****************************************************************************
  .controller('PotsCtrl', function($scope, Pots, $ionicModal, $state, $ionicListDelegate, $ionicPopup) {
    console.log("Pots Ctrl");

    /*******************************************************/
    // Globale Funktionen pro controller               START
    /*******************************************************/
    showAlert = function(message) {
      var alertPopup = $ionicPopup.alert({
        title: message.title,
        template: message.template
      });
      alertPopup.then(function(res) {
        console.log(message.logText);
      });
    };
    //   ENDE
    /*******************************************************/
    //init
    /*******************************************************/
    var fbAuth = fb.getAuth();
    if (fbAuth) {
      Pots.getAll(fbAuth.uid).then(function(data) {
        $scope.pots = data;
        $scope.$apply();

        //FREE
        if (data == false) {
          var pot = {};
          pot["name"] = "Free Pot";
          pot["description"] = "First free pot";
          Pots.add(pot);
        }
      });

    } else {
      var message = {
        title: 'Please Login first',
        template: '',
        logText: "Please Login first"
      }
      showAlert(message);
      $state.go('tab.account');
    }

    /*******************************************************/
    // View Methoden
    /*******************************************************/
    //Get Data from Store
    $scope.doRefresh = function() {
      var fbAuth = fb.getAuth();
      if (fbAuth) {
        Pots.getNew(fbAuth.uid).then(function(data) {
          $scope.pots = data;
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$apply();
          //FREE
          if (data == false) {
            var pot = {};
            pot["name"] = "Free Pot";
            pot["description"] = "First free pot";
            Pots.add(pot);
          }

        });

      } else {
        $scope.$broadcast('scroll.refreshComplete');
        var message = {
          title: 'Please Login first',
          template: '',
          logText: "Please Login first"
        }
        showAlert(message);
        $state.go('tab.account');
      }
    };

    $scope.addPot = function() { //Pots.add();
      if ($scope.modal.description && $scope.modal.name) {
        Pots.add($scope.modal);
        $scope.modal.hide();
      } else {
        var title = 'No values provided';
        var template = '';
        var logText = "No values provided";
        $scope.showAlert(title, template, logText);
      }
    };
    $scope.archive = function(pot) {
      Pots.setStatus(pot, 'archived');
      $ionicListDelegate.closeOptionButtons();
    };
    $scope.remove = function(pot) {
      Pots.setStatus(pot, 'removed');
      $ionicListDelegate.closeOptionButtons();
    };
    /*************************************************/
    //  MODAL POT
    /*************************************************/
    $ionicModal.fromTemplateUrl('templates/modal-pot.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: false,
      backdropClickToClose: false,
      hardwareBackButtonClose: false,
      focusFirstInput: true
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    $scope.openModal = function() {
      $scope.modal.show();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      try {
        $scope.modal.remove();
      } catch (error) {}
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      $scope.modal.name = null;
      $scope.modal.description = null;

    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
      //$scope.modal = null;
      $scope.modal.name = null;
      $scope.modal.description = null;
    });
  })

//****************************************************************************
//  CONTROLLER POTS DETAIL
//****************************************************************************
.controller('PotDetailCtrl', function($scope, $ionicModal, $stateParams, Pots, $firebaseArray, $firebaseObject, $ionicPopup, $ionicListDelegate) {
    console.log("Pots Detail Ctrl");
    /*******************************************************/
    // Globale Funktionen pro controller               START
    /*******************************************************/
    showAlert = function(message) {
      var alertPopup = $ionicPopup.alert({
        title: message.title,
        template: message.template
      });
      alertPopup.then(function(res) {
        console.log(message.logText);
      });
    };
    //   ENDE
    var fbAuth = fb.getAuth();
    if (fbAuth) {
      Pots.getItemObject($stateParams.potId, fbAuth.uid).then(function(data) {
        $scope.pot = data; //Kopfdaten
        if (data.status === "archived") {
          $scope.pot.statusClass = "badge badge-assertive";
        } else {
          $scope.pot.statusClass = "badge badge-balanced";
          $scope.pot.status = "active"
        }
      }); //Get Ref from each pot

      Pots.getItemArray($stateParams.potId, fbAuth.uid).then(function(data) {

        $scope.pot.items = [];
        $scope.pot.amount = 0;

        for (var i = 0; i <= data.length; i++) {
          try {
            if (data[i].hasOwnProperty("isItem")) { // richtige position?
              $scope.pot.items.push(data[i]);
              $scope.pot.amount = $scope.pot.amount + data[i].amount;
            }
          } catch (err) {
            console.log("no isItem property");
          }
        } //for

        $scope.$apply();

      });


    } else {
      var message = {
        title: 'Please Login first',
        template: '',
        logText: "Please Login first"
      }
      showAlert(message);
      $state.go('tab.account');
    }

    /******************************************************/
    //  Modal Pot Item
    /******************************************************/
    $ionicModal.fromTemplateUrl('./templates/modal-pot-item.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: false,
      backdropClickToClose: false
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.addPotItem = function() {
      if ($scope.modal.name && $scope.modal.amount && $scope.modal.date) {
        $scope.modal.potId = $scope.pot.$id;
        Pots.addItem($scope.modal);
        $scope.modal.hide();
      } else {
        //alert("keine werte eingegeben.");
        var title = 'No values provided';
        var template = '';
        var logText = "No values provided";
        showAlert(title, template, logText);
      }
    };
    $scope.remove = function(potId, potItem) {
      //Pots.setStatus(pot, 'removed');
      Pots.removePotItem(potId, potItem);
      $ionicListDelegate.closeOptionButtons();
    }
    $scope.openModal = function() {
      $scope.modal.show();
    }
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      try {
        $scope.modal.remove();
      } catch (error) {}
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      //init fields
      $scope.modal.name = null;
      $scope.modal.amount = null;
      $scope.modal.date = null;
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
      //$scope.modal = null;
      $scope.modal.name = null;
      $scope.modal.amount = null;
      $scope.modal.date = null;
    });
  })
  //****************************************************************************
  //  CONTROLLER ACCOUNT
  //****************************************************************************
  .controller('AccountCtrl', function($scope, User, $ionicActionSheet, $state, $firebaseAuth, $ionicPopup) {
    console.log("Account Ctrl");
    //init
    $scope.user = User.getUser(); //Get User Data
    $scope.register = {};
    $scope.register.username = "";
    $scope.register.password = "";

    /*******************************************************/
    // Globale Funktionen pro controller               START
    /*******************************************************/
    $scope.showAlert = function(message) {
      var alertPopup = $ionicPopup.alert({
        title: message.title,
        template: message.template
      }).then(function(res) {
        console.log(message.logText);
      });
    };
    //ENDE

    /**********************************************/
    // VIEW Mehtoden
    /**********************************************/
    $scope.registerUser = function() {
      var myPopup = $ionicPopup.show({
        template: '<label>Email:</label><input type="email" ng-model="register.username" ng-model-instant><br><label>Password:</label><input type="password" ng-model="register.password" ng-model-instant>',
        title: 'Enter Username and Password',
        subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Register new User</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.register.password && !$scope.register.username) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.register;
            }
          }
        }]
      }).then(function(res) { //neu, für das oben
        if (res) {
          User.registerUser(res)
        };
      });
    };
    $scope.changeUserPassword = function() {
      var newPW = prompt("Set new password", "enter new password here");
      if (newPW) {
        User.changeUserPassword(User.getUser(), newPW);
      }
    };
    $scope.changeUserEmail = function() {
      var newEmail = prompt("Set new email", "enter new email here");
      if (newEmail) {
        User.changeUserEmail(User.getUser(), newEmail);
      }
    };
    $scope.resetUserPW = function() {
      User.resetUserPW();
    };
    $scope.logoutUser = function() {
      User.logoutUser();
    };

    /*********************************************
      RESET USERDATEN(Lokal)
    *********************************************/
    $scope.deleteUser = function() {
      User.deleteUserData();

      var title = 'Deleted Userdata on device';
      var template = '';
      var logText = "Deleted Userdata on device";
      $scope.showAlert(title, template, logText);
    };
    /*********************************************
      SAVE USERDATEN (Lokal)
    *********************************************/
    $scope.saveUser = function() {

      User.setUser($scope.user);
      /*
            if ($scope.user.username !== null) {
              window.localStorage.setItem("username", $scope.user.username); //sollte auch in store..
            }
            if ($scope.user.password !== null) {
              window.localStorage.setItem("password", $scope.user.password); //sollte auch in store..
            }
            if ($scope.user.budget !== null) {
              window.localStorage.setItem("budget", $scope.user.budget); //sollte auch in store..
            }*/
      var authData = fb.getAuth();
      if (authData) {
        // save the user's profile into Firebase so we can list users,
        // use them in Security and Firebase Rules, and show profiles

        fb.child("users").child(authData.uid + '/userData').set({
          provider: authData.provider,
          username: User.getUsername(),
          name: User.getName(),
          firstname: User.getFirstname(),
          budget: User.getBudget()

        });
      }

      var message = {
        title: 'Saved userdata on device',
        template: '',
        logText: "Saved userdata on device"
      }
      $scope.showAlert(message);
    };
    /*********************************************
      Login User
    *********************************************/
    $scope.loginUser = function() {
      User.loginUser($scope.user.username, $scope.user.password);


      /*fb.authWithPassword({
          email: username,
          password: password
        }, function(error, authData) {
          if (error) {
            //          alert("Login Failed!", error);
            var title = 'Login Failed';
            var template = '';
            var logText = "Login failed" + error;
            $scope.showAlert(title, template, logText);
          } else {
            var title = 'Authenticated successfully';
            var template = '';
            var logText = "Authenticated successfully";
            $scope.showAlert(title, template, logText);

            //alert("Authenticated successfully"); //with payload:", authData);
            //console.log(authData);
            User.setAuthData(authData);
          }
        });
      } else {
        var title = 'No logindata available';
        var template = '';
        var logText = "No logindata available";
        $scope.showAlert(title, template, logText);
      }*/
    };
    /*****************************************************
      // Triggered on a button click, or some other target
    *****************************************************/
    $scope.show = function() {
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        titleText: 'Account settings',
        buttons: [{
          text: 'Save userdata'
        }, {
          text: 'Change email'
        }, {
          text: 'Change password'
        }, {
          text: 'Reset password'
        }],
        destructiveText: 'Delete userdata',
        destructiveButtonClicked: function() {
          $scope.deleteUser();
          return true;
        },

        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          if (index === 0) {
            $scope.saveUser();
          }
          if (index === 1) {
            $scope.changeUserEmail();
          }
          if (index === 2) {
            $scope.changeUserPassword();
          }
          if (index === 3) {
            $scope.resetUserPW();
          }
          return true;
        }
      });
    }

  });
