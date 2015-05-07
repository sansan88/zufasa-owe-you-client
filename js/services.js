angular.module('starter.services', [])
.factory('Firebase', function() {
  var myDataRef = new Firebase('https://zoy-client.firebaseio.com/');
  //Methods
  return {
    setItem2Pot: function(item) {
      myDataRef.push(item);
    },
  }
})

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

.factory('Lists', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var lists = [{
    id: 0,
    name: 'Einkaufen WG',
    description: 'Migros Coop und so',
    items: [{
        id: 0,
        name: "Milch",
        menge: "1",
        einheit: "liter"
      }, {
        id: 1,
        name: "Brot",
        menge: "1",
        einheit: "kg"
      }

    ]
  }, {
    id: 1,
    name: 'BBQ Party',
    description: 'Sommerparty Yeah!',
    items: [{

    }]
  }];

  return {
    all: function() {
      return lists;
    },
    remove: function(list) {
      lists.splice(lists.indexOf(list), 1);
    },
    get: function(listId) {
      for (var i = 0; i < lists.length; i++) {
        if (lists[i].id === parseInt(listId)) {
          return lists[i];
        }
      }
      return null;
    },
    add: function(list) {
      lists.push(list);
    }
  };
})
//****************************************************************************
//  POTS
//****************************************************************************

.factory('Pots', ['$firebaseArray', function($firebaseArray){
  var potsRef = new Firebase('https://zoy-client.firebaseio.com/pots');
  return $firebaseArray(potsRef);



}]  /*,function() {
  // Might use a resource here that returns a JSON arrayb

  // Some fake testing data
  var pots = [{
    id: 0,
    name: 'WG Allgemein',
    description: '',
    creator: 1,
    datetime: "",
    archive: false,
    changedatetime: "",
    changer: 1,
    img: "", //allgemeines bild
    items: [{
      id: 0,
      value: "1.90",
      curr: "CHF",
      description: "",
      creator: 1,
      datetime: "",
      archive: false,
      changedatetime: "",
      changer: 1,
      data: "" // bild der Quittung
    }, {
      id: 1,
      value: "1.90",
      curr: "CHF",
      description: "",
      creator: 1,
      datetime: "",
      archive: false,
      changedatetime: "",
      changer: 1,
      data: ""
    }]

  }, {
    id: 1,
    name: 'WG Parties',
    description: '',
    creator: 1,
    datetime: "",
    archive: false,
    changedatetime: "",
    changer: 1,
    img: "",
    items: [{}]
  }];

  return {
    all: function() {
      return pots;
    },
    remove: function(pot) {
      pots.splice(pots.indexOf(pot), 1);
    },
    get: function(potId) {
      for (var i = 0; i < pots.length; i++) {
        if (pots[i].id === parseInt(potId)) {
          return pots[i];
        }
      }
      return null;
    },
    add: function(pot) {
      pots.push(pot);
    }
  };

}*/
);
