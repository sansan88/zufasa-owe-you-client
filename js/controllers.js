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
  .controller('PotsCtrl', function($scope, $ionicModal, Pots, $firebaseAuth, $state, $ionicListDelegate) {

    var fbAuth = fb.getAuth();
    if (fbAuth) {
      /*var userReference = fb.child("users/" + fbAuth.uid);
      var syncArray = $firebaseArray(userReference.child("pots"));
      $scope.pots = syncArray;*/
      $scope.pots = Pots.getAll(fbAuth.uid);

    } else {
      alert("Please Login first");
      $state.go("tab.account");
    }

    //Get Data from Store
    $scope.doRefresh = function() {
      var fbAuth = fb.getAuth();
      if (fbAuth) {
        var data = Pots.getNew(fbAuth.uid);
        $scope.pots = data.concat($scope.pots);
        $scope.$broadcast('scroll.refreshComplete');

      } else {
        $scope.$broadcast('scroll.refreshComplete');
        alert("Please Login first");
        $state.go("tab.account");
      }
    };

    $scope.get = function(){
      console.log("call get");
    };

    //Pot Functions
    $scope.addPot = function() { //Pots.add();
      if ($scope.modal.description && $scope.modal.name) {
        Pots.add($scope.modal);
        $scope.modal.hide();
      } else {
        alert("keine werte eingegeben.");
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
        alert("Please Login first");
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
        alert("keine werte eingegeben.");
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
//  CONTROLLER POTS DETAIL
//****************************************************************************
.controller('PotDetailCtrl', function($scope, $ionicModal, $stateParams, Pots) {
  $scope.pot = Pots.get($stateParams.potId);

  //  Modal Item
  $ionicModal.fromTemplateUrl('./templates/modal-pot-item.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: false,
    backdropClickToClose: false
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.addPotItem = function() {
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
.controller('AccountCtrl', function($scope, User, $ionicActionSheet, $timeout, $state, $firebaseAuth) {

  var fbAuth = $firebaseAuth(fb);

  $scope.user = User.getUser();

  // Create a callback which logs the current auth state
  function authDataCallback(authData) {
    if (authData) {
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
    } else {
      console.log("User is logged out");
    }
  }

  $scope.changePW = function() {
    var newPW = prompt("Set new password", "enter new password here");
    fb.changePassword({
      email: $scope.user.username,
      oldPassword: $scope.user.password,
      newPassword: newPW
    }, function(error) {
      if (error === null) {
        console.log("Password changed successfully");
        $scope.user.password = newPW;

      } else {
        console.log("Error changing password:", error);
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
        console.log("Email changed successfully");
        $scope.user.username = newEmail;

      } else {
        console.log("Error changing email:", error);
      }
    });
  }

  $scope.resetPW = function() {
    fb.resetPassword({
      email: $scope.user.username
    }, function(error) {
      if (error === null) {
        console.log("Password reset email sent successfully");
      } else {
        console.log("Error sending password reset email:", error);
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
      alert("Deleted Logindata");
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
      alert("Saved Logindata");
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
          alert("Login Failed!", error);
        } else {
          alert("Authenticated successfully"); //with payload:", authData);
          console.log(authData);
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
          text: 'reset password'
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
