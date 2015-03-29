angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Pots, Lists) {
  $scope.noLists = Lists.all().length;
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
  }
})

.controller('PotsCtrl', function($scope,$ionicModal, Pots) {
  $scope.pots = Pots.all();
  $scope.remove = function(pot) {
    Pots.remove(pot);
  }

//****************************************************************************
//  MODAL FENSTER POT
//****************************************************************************
  $ionicModal.fromTemplateUrl('./templates/modal-pot.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: false,
    backdropClickToClose: false
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.addPot = function(){
    $scope.modal.show();
  }
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    try{
      $scope.modal.remove();
    }catch(error){
    }
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

.controller('PotDetailCtrl', function($scope, $ionicModal, $stateParams, Pots) {
  $scope.pot = Pots.get($stateParams.potId);

//****************************************************************************
//  MODAL FENSTER POT DETAIL ITEM
//****************************************************************************
  $ionicModal.fromTemplateUrl('./templates/modal-pot-item.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: false,
    backdropClickToClose: false
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.addPotItem = function(){
    $scope.modal.show();
  }
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    try{
      $scope.modal.remove();
    }catch(error){
    }
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

.controller('ListsCtrl', function($scope,$ionicModal, Lists) {
  $scope.lists = Lists.all();
  $scope.remove = function(list) {
    Lists.remove(list);
  }
//****************************************************************************
//  MODAL FENSTER LIST
//****************************************************************************
    $ionicModal.fromTemplateUrl('./templates/modal-list.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: false,
      backdropClickToClose: false
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.addList = function(){
      $scope.modal.show();
    }
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      try{
        $scope.modal.remove();
      }catch(error){
      }
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

.controller('ListDetailCtrl', function($scope, $ionicModal, $stateParams, Lists) {
  $scope.list = Lists.get($stateParams.listId);

//****************************************************************************
//  MODAL FENSTER LIST
//****************************************************************************
  $ionicModal.fromTemplateUrl('./templates/modal-list-item.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: false,
    backdropClickToClose: false
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.addListItem = function(){
    $scope.modal.show();
  }
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    try{
      $scope.modal.remove();
    }catch(error){
    }
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
	$scope.saveUser = function(){
		if ($scope.user.username !== null){
			window.localStorage.setItem("username", $scope.user.username); //sollte auch in store..
		}

		if ($scope.user.password !== null){
			window.localStorage.setItem("password", $scope.user.password); //sollte auch in store..
		}
	}

	$scope.saveUser();


  $scope.settings = {
    enableFriends: true
  };
});
