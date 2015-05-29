angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Pots, Lists) {

    $scope.noLists = Lists.getAll().length;
    $scope.noListItems = 0;
    var lists = Lists.getAll();
    for (var i = 0; i < lists.length; i++) {
      $scope.noListItems = $scope.noListItems + lists[i].items.length;
    }

    $scope.noPots = Pots.getAll().length;
    $scope.noPotItems = 0;
    var pots = Pots.getAll();
    for (var i = 0; i < pots.length; i++) {
      $scope.noPotItems = $scope.noPotItems + pots[i].items.length;;
    }
  })
  //****************************************************************************
  //  CONTROLLER POTS
  //****************************************************************************
  .controller('PotsCtrl', function($scope, $ionicModal, Pots, $firebaseAuth, $firebaseArray, $state, $ionicListDelegate, $ionicPopup) {

    $scope.showAlert = function(title, template, logText) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: template
      });
      alertPopup.then(function(res) {
        console.log(logText);
      });
    };

    var fbAuth = fb.getAuth();
    if (fbAuth) {
      /*var userReference = fb.child("users/" + fbAuth.uid);
      var syncArray = $firebaseArray(userReference.child("pots"));
      $scope.pots = syncArray;*/
      $scope.pots = Pots.getAll(fbAuth.uid);

    } else {
      var title = 'Please Login first';
      var template = '';
      var logText = "Please Login first";
      $scope.showAlert(title, template, logText);
      $state.go("tab.account");
    }

    //Get Data from Store
    $scope.doRefresh = function() {
      var fbAuth = fb.getAuth();
      if (fbAuth) {
        var data = Pots.getNew(fbAuth.uid);
        $scope.pots = data; //.concat($scope.pots);
        $scope.$broadcast('scroll.refreshComplete');

      } else {
        $scope.$broadcast('scroll.refreshComplete');
        var title = 'Please Login first';
        var template = '';
        var logText = "Please Login first";
        $scope.showAlert(title, template, logText);
        $state.go("tab.account");
      }
    };

    //Pot Functions
    $scope.addPot = function() { //Pots.add();
      if ($scope.modal.description && $scope.modal.name) {
        Pots.add($scope.modal);
        $scope.modal.hide();
      } else {
        //alert("keine werte eingegeben.");
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

    //  MODAL FENSTER POT
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
      var fbAuth = fb.getAuth();
      if (fbAuth) {

        $scope.modal.show();

        //get Picture
        var takePicture = document.querySelector("#take-picture");
        takePicture.onchange = function(event) {
          // Get a reference to the taken picture or chosen file
          var files = event.target.files,
            file;
          if (files && files.length > 0) {
            file = files[0];
            $scope.modal.picture = window.URL.createObjectURL(file);
            var URL = window.URL || window.webkitURL;
            // Create ObjectURL
            var imgURL = URL.createObjectURL(file);

            var reader = new window.FileReader();
            reader.readAsDataURL(imgURL);
            reader.onloadend = function() {
              var base64data = reader.result;
              console.log(base64data);
              $scope.modal.picture = base64data;
            }
          }
        };
      } else {
        var title = 'Please Login first';
        var template = '';
        var logText = "Please Login first";
        $scope.showAlert(title, template, logText);


        //alert("Please Login first");
        $state.go("tab.account");
      }
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
      //$scope.modal = null;
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
  var uR = Pots.get($stateParams.potId);
  var daten = $firebaseObject(uR);
  $scope.pot = daten;

  // Array mit Items?
  var items = $firebaseArray(uR);
  $scope.items = [];

  $scope.items.push(items["-JqUfd7JcyD-ixWd2Hoy"]);

  //$scope.pot.potId = $stateParams.potId;

  //  Modal Pot Item
  $ionicModal.fromTemplateUrl('./templates/modal-pot-item.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: false,
    backdropClickToClose: false
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.addPotItem = function() {
    if ($scope.modal.description && $scope.modal.name && $scope.modal.amount) {
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
    $scope.modal.description = null;
    $scope.modal.amount = null;
    $scope.modal.date = null;
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
    //$scope.modal = null;
    $scope.modal.name = null;
    $scope.modal.description = null;
    $scope.modal.amount = null;
    $scope.modal.date = null;
  });
})

//****************************************************************************
//  LIST
//****************************************************************************
.controller('ListsCtrl', function($scope, $ionicModal, Lists) {
  $scope.lists = Lists.getAll();

  //List Functions
  $scope.addList = function() {
    if ($scope.modal.description && $scope.modal.name) {
      $scope.lists.$add({
        'name': $scope.modal.name,
        'description': $scope.modal.description
          //'picture': $scope.modal.picture
      });
      $scope.modal.hide();
    } else {
      var title = 'No values provided';
      var template = '';
      var logText = "No values provided";
      $scope.showAlert(title, template, logText);
      //alert("keine werte eingegeben.");
    }

  };
  $scope.archive = function(list) {
    var listRef = new Firebase('https://zoy-client.firebaseio.com/lists/' + list.$id);
    listRef.child('status').set('archived');
    $ionicListDelegate.closeOptionButtons();
  };
  $scope.remove = function(list) {
    var listRef = new Firebase('https://zoy-client.firebaseio.com/lists/' + list.$id);
    listRef.child('status').set('removed');
    listRef.remove();
    $ionicListDelegate.closeOptionButtons();
  };

  $ionicModal.fromTemplateUrl('templates/modal-list.html', {
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
    $scope.modal.show()
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
    //$scope.modal = null;
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
//  MODAL FENSTER LIST ITEM
//****************************************************************************
/*.controller('ListDetailCtrl', function($scope, $ionicModal, $stateParams, Lists) {
  $scope.list = Lists.get($stateParams.listId);


  $ionicModal.fromTemplateUrl('./templates/modal-list-item.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: false,
    backdropClickToClose: false
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.addListItem = function() {
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
    $scope.modal = null;
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
    $scope.modal = null;
  });

})
*/
.controller('AccountCtrl', function($scope, User, $ionicActionSheet, $timeout, $state, $firebaseAuth, $ionicPopup) {

  //Get Auth Object
  var fbAuth = $firebaseAuth(fb);

  //Get User Data
  $scope.user = User.getUser();

  // Create a callback which logs the current auth state
  function authDataCallback(authData) {
    if (authData) {
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
    } else {
      console.log("User is logged out");
    }
  }

  //Create Alert Popup
  // An alert dialog
  $scope.showAlert = function(title, template, logText) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: template
    });
    alertPopup.then(function(res) {
      console.log(logText);
    });
  };

  $scope.register = function() {
    //var newEmail = prompt("Set new email", "enter new email here");
    //var newPW = prompt("Set new password", "enter new password here");

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<label>Email:</label><input type="email" ng-model="register.email"><br><label>Password:</label><input type="password" ng-model="register.pw">',
      title: 'Enter Username and Password',
      subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
      }, {
        text: '<b>Register new User</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.register.pw && !$scope.register.email) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.register;
          }
        }
      }]
    });
    myPopup.then(function(res) {

      fb.createUser({
        email: $scope.register.email,
        password: $scope.register.pw
      }, function(error, userData) {
        if (error) {
          var title = 'Error creating user:';
          var template = error;
          var logText = "Error creating user:" + error;

          $scope.showAlert(title, template, logText);

        } else {
          var title = 'Successfully created user account';
          var template = '';
          var logText = "Successfully created user account with uid:" + userData.uid;

          $scope.showAlert(title, template, logText);

          $scope.user.password = $scope.register.pw;
          $scope.user.username = $scope.register.email;
          $scope.saveUser();
        }
      });

    });
    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 30000);


  }

  $scope.changePW = function() {
    var newPW = prompt("Set new password", "enter new password here");
    fb.changePassword({
      email: $scope.user.username,
      oldPassword: $scope.user.password,
      newPassword: newPW
    }, function(error) {
      if (error === null) {
        //console.log("Password changed successfully");

        var title = 'Password changed successfully';
        var template = '';
        var logText = "Password changed successfully";

        $scope.showAlert(title, template, logText);


        $scope.user.password = newPW;
        $scope.user.username = newEmail;
      } else {
        var title = 'Error changing password';
        var template = '';
        var logText = "Error changing password" + error;

        $scope.showAlert(title, template, logText);

        //console.log("Error changing password:", error);
      }
    });
  }

  $scope.changeEmail = function() {
    var newEmail = prompt("Set new email", "enter new email here");
    fb.changeEmail({
      oldEmail: $scope.user.username,
      newEmail: newEmail,
      password: $scope.user.password
    }, function(error) {
      if (error === null) {
        //console.log("Email changed successfully");
        var title = 'Email changed successfully';
        var template = '';
        var logText = "Email changed successfully";

        $scope.showAlert(title, template, logText);
        $scope.user.username = newEmail;

      } else {
        //console.log("Error changing email:", error);
        var title = 'Error changing email';
        var template = '';
        var logText = "Error changing email" + error;
        $scope.showAlert(title, template, logText);
      }
    });
  }

  $scope.resetPW = function() {
    fb.resetPassword({
      email: $scope.user.username
    }, function(error) {
      if (error === null) {
        //console.log("Password reset email sent successfully");
        var title = 'Password reset email sent successfully';
        var template = '';
        var logText = "Password reset email sent successfully";
        $scope.showAlert(title, template, logText);
      } else {
        var title = 'Error sending password reset email';
        var template = '';
        var logText = "Error sending password reset email" + error;
        $scope.showAlert(title, template, logText);
        //console.log("Error sending password reset email:", error);
      }
    });
  }

  $scope.logout = function() {
    fb.unauth();
    User.setAuthData(null);
  }

  /*********************************************
    RESET USERDATEN(Lokal)
  *********************************************/
  $scope.deleteUser = function() {
      window.localStorage.setItem("username", "");
      window.localStorage.setItem("password", "");
      $scope.user.password = "";
      $scope.user.username = "";
      //alert("Deleted Logindata");

      var title = 'Deleted Logindata on device';
      var template = '';
      var logText = "Deleted Logindata on device";
      $scope.showAlert(title, template, logText);
    }
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
      var title = 'Saved Logindata on device';
      var template = '';
      var logText = "Saved Logindata on device";
      $scope.showAlert(title, template, logText);
    }
    /*********************************************
      Login User
    *********************************************/
  $scope.loginUser = function() {
      fb.onAuth(authDataCallback);
      fb.authWithPassword({
        email: User.getEmail(),
        password: User.getPassword()
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
    }
    /*****************************************************
      // Triggered on a button click, or some other target
    *****************************************************/
  $scope.show = function() {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({

      titleText: 'Account settings',

      buttons: [{
          text: 'Save logindata'
        }, {
          text: 'Change email'
        }, {
          text: 'Change password'
        }, {
          text: 'Reset password'
        }

      ],

      destructiveText: 'Delete logindata',
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
