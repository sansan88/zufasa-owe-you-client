angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Pots, User, $state, $timeout, $ionicPopup, $firebaseArray) {

    /*******************************************************/
    // Globale Funktionen pro controller               START
    /*******************************************************/
    $scope.showAlert = function(title, template, logText) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: template
      });
      alertPopup.then(function(res) {
        console.log(logText);
      });
    };
    // ENDE
    var ref = Pots.getAll().$loaded().then(function(data) {

      $scope.noPots = data.length;
      $scope.noPotItems = 0;
      $scope.totalSpendingsThisMonth = 0;

      var pots = data;
      var potItems = [];

      //Loop über Alle Pots
      for (var i = 0; i < pots.length; i++) {
        var uR = Pots.get(pots[i].$id); //Get Ref from each pot

        //Position Data
        var items = $firebaseArray(uR);
        items.$loaded().then(function(data) { // data = positemarray

          for (var i = 0; i <= data.length; i++) {
            try {
              if (data[i].hasOwnProperty("isItem")) { // richtige position?
                $scope.noPotItems++;
                $scope.totalSpendingsThisMonth = $scope.totalSpendingsThisMonth + data[i].amount;
              }
            } catch (err) {
              console.log("no isItem property");
            }
          } //for
        }); //items loaded
      };
    });
  })
  //****************************************************************************
  //  CONTROLLER POTS
  //****************************************************************************
  .controller('PotsCtrl', function($scope, Pots, $ionicModal, $state, $ionicListDelegate, $ionicPopup) {
    /*******************************************************/
    // Globale Funktionen pro controller               START
    /*******************************************************/
    $scope.showAlert = function(title, template, logText) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: template
      });
      alertPopup.then(function(res) {
        console.log(logText);
      });
    };
    //   ENDE

    /*******************************************************/
    //init
    /*******************************************************/
    var ref = Pots.getAll();
    ref.$loaded().then(function(data) {
      $scope.pots = data;
    });

    /*******************************************************/
    // View Methoden
    /*******************************************************/
    //Get Data from Store
    $scope.doRefresh = function() {
      Pots.getNew(fbAuth.uid).$loaded().then(function(data) {
        //$scope.pots = _.uniq($scope.pots, data) ;
        $scope.pots = data;
        $scope.$broadcast('scroll.refreshComplete');
      });

      /*  $scope.$broadcast('scroll.refreshComplete');
        var title = 'Please Login first';
        var template = '';
        var logText = "Please Login first";
        $scope.showAlert(title, template, logText);*/
      //$state.go("tab.account");
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
.controller('PotDetailCtrl', function($scope, $ionicModal, $stateParams, Pots, $firebaseArray, $firebaseObject) {

    //init
    var uR = Pots.get($stateParams.potId);
    //Header Data
    var daten = $firebaseObject(uR);
    daten.$loaded().then(function(sync) {
      $scope.pot = sync;
      $scope.pot.items = [];

      //Position Data
      var items = $firebaseArray(uR);
      items.$loaded().then(function(data) {

        for (var i = 0; i <= data.length; i++) {
          try {
            if (data[i].hasOwnProperty("isItem")) {
              $scope.pot.items.push(data[i]);
              $scope.pot.amount = $scope.pot.amount + data[i].amount;
            }
          } catch (err) {
            console.log("no isItem property");
          }
        }

      });
    });
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
        $scope.showAlert(title, template, logText);
      }
    };
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
  .controller('AccountCtrl', function($scope, User, $ionicActionSheet, $timeout, $state, $firebaseAuth, $ionicPopup) {

    //init
    $scope.user = User.getUser(); //Get User Data

    /*******************************************************/
    // Globale Funktionen pro controller               START
    /*******************************************************/
    $scope.showAlert = function(message) {
      var alertPopup = $ionicPopup.alert({
        title: message.title,
        template: message.template
      }).then(function(res) {
        console.log(res.logText);
      });
    };
    //ENDE

    /**********************************************/
    // VIEW Mehtoden
    /**********************************************/
    $scope.registerUser = function() {
      var myPopup = $ionicPopup.show({
        template: '<label>Email:</label><input type="email" ng-model="register.username"><br><label>Password:</label><input type="password" ng-model="register.password">',
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
          //      });
          //      myPopup.then(function(res) {
      }).then(function(res) { //neu, für das oben
        if (res) {
          User.registerUser(res)
        };
      });
      $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 30000);
    };

    $scope.changeUserPassword = function() {
      var newPW = prompt("Set new password", "enter new password here");
      User.changeUserPassword(User.getUser(), newPW);
    };

    $scope.changeUserEmail = function() {
      var newEmail = prompt("Set new email", "enter new email here");
      User.changeUserEmail(User.getUser(), newEmail);
    };

    $scope.resetUserPW = function() {
      User.resetUserPW();
    };

    $scope.logoutUser = function() {
      User.logoutUser();
      //clear Data in Scope
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
      if ($scope.user.username !== null) {
        window.localStorage.setItem("username", $scope.user.username); //sollte auch in store..
      }
      if ($scope.user.password !== null) {
        window.localStorage.setItem("password", $scope.user.password); //sollte auch in store..
      }
      if ($scope.user.budget !== null) {
        window.localStorage.setItem("budget", $scope.user.budget); //sollte auch in store..
      }
      var title = 'Saved userdata on device';
      var template = '';
      var logText = "Saved userdata on device";
      $scope.showAlert(title, template, logText);
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
            $scope.changeEmail();
          }
          if (index === 2) {
            $scope.changePW();
          }
          if (index === 3) {
            $scope.resetPW();
          }
          return true;
        }
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function() {
        hideSheet();
      }, 5000);
    }

  });
