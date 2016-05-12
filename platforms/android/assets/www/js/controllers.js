angular.module('starter.controllers', ['ionic', 'ionic.contrib.ui.tinderCards'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log($scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, $http) {
  var toto = $http.get('http://94.23.200.181:1337/user').then(function(value){
    $scope.playlists = value.data;
  })
})

.controller('PlaylistCtrl', function($http, $scope, $stateParams) {
  console.log($stateParams);
  var details = $http.get('http://94.23.200.181:1337/user/find?id='+$stateParams.playlistId).then(function(value){
    $scope.user = value.data;

  })
})

.controller('UserCtrl', ['$http', '$scope', '$stateParams', function($http, $scope, $stateParams) {

  $scope.user = null;
  $scope.previous = null;

  $scope.url = 'http://94.23.200.181:1337/user/4';

  $http.get($scope.url).then(function(value) {
    $scope.user = value.data;
    $scope.previous = value.data;
  }, function(error) {
    console.log('a marche po', error);
  });

  $scope.save = function() {
    $http.post($scope.url, $scope.user
      ).then(function(value) {
        console.log(value);
      }, function(error) {
        console.log('error', error);
      });

    };


    $scope.search = function() {
      $scope.searchAge = 18;
      console.log($scope.searchAge);
      $http.get('http://94.23.200.181:1337/user?age='+ $scope.searchAge).then(function(value) {
        console.log(value);
        $scope.results = value.data;
      });
    };

    $scope.like = function() {
      alert('I like user '+$scope.randomUser.id);
      $scope.nextRandom();
    };

    $scope.nextRandom = function() {

      $http.get('http://94.23.200.181:1337/user').then(
        function(value) {
          var users = value.data;
          var index = Math.floor(Math.random()*users.length);
          $scope.randomUser = users[index];
        });
    };

    $scope.nextRandom();


  }])

.controller('CardsCtrl', function($scope, $http, TDCardDelegate) {
 $scope.cardTypes = $http.get('http://94.23.200.181:1337/user').then(function(value){
  $scope.cardTypes= value.data;
  $scope.cards = value.data;
})

 $scope.cardDestroyed = function(index) {
  $scope.cards.splice(index, 1);
};

$scope.addCard = function(test) {
  var newCard = $scope.cardTypes[Math.floor(Math.random() * $scope.cardTypes.length)];
  newCard.id = Math.random();
  $scope.cards.push(angular.extend({}, newCard));
  console.log(test)
}
$scope.cardSwipedLeft = function(index) {
  $scope.addCard('Je te like pas');
};

$scope.cardSwipedRight = function(index) {
  $scope.addCard('Je te like');
};
})
;
