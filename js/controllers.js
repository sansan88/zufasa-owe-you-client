angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Pots, Lists) {
    /*$scope.noLists = Lists.all().length;
    $scope.noListItems = 0;
    var lists = Lists.all();

    for(var i = 0; i < lists.length; i++){
      $scope.noListItems = $scope.noListItems + lists[i].items.length;
    }

    $scope.noPots  = Pots.all().length;
    $scope.noPotItems = 0;
    var pots = Pots.all();

    for(var i = 0; i < pots.length; i++){
      $scope.noPotItems = $scope.noPotItems + pots[i].items.length;;
    }*/
  })
  //****************************************************************************
  //  CONTROLLER POTS
  //****************************************************************************
  .controller('PotsCtrl', function($scope, $ionicModal, Pots, $ionicListDelegate) {
    //Get Data from Store
    $scope.pots = Pots.getAll();

    $scope.doRefresh: function(){
      Pots.getNew().then(function(pots){
        $scope.pots = pots.concat($scope.pots);
        $scope.$broadcast('scroll.refreshComplete');//Stop pull2refresh
      });
    };

    //Pot Functions
    $scope.addPot = function() { //Pots.add();
      if ($scope.modal.description && $scope.modal.name) {
        Pots.add(modal);
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
  //  LIST
  //****************************************************************************
  .controller('ListsCtrl', function($scope, $ionicModal, Lists) {
    $scope.lists = Lists.getAll;

    //Pot Functions
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
//  MODAL FENSTER LIST ITEM
//****************************************************************************
.controller('ListDetailCtrl', function($scope, $ionicModal, $stateParams, Lists) {
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

.controller('AccountCtrl', function($scope, User) {
  $scope.user = User.getUser();
  $scope.saveUser = function() {
    if ($scope.user.username !== null) {
      window.localStorage.setItem("username", $scope.user.username); //sollte auch in store..
    }
    if ($scope.user.password !== null) {
      window.localStorage.setItem("password", $scope.user.password); //sollte auch in store..
    }
  }

  $scope.saveUser();

  $scope.settings = {
    enableFriends: true
  };
});
