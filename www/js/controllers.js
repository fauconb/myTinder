angular.module('starter.controllers', ['ionic', 'ionic.contrib.ui.tinderCards'])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

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
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log($scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('PlaylistsCtrl', function ($scope, $http) {
    var toto = $http.get('http://94.23.200.181:1337/user').then(function (value) {
      $scope.playlists = value.data;
    })
  })

  //Sujet de test
  .controller('PlaylistCtrl', function ($http, $scope, $stateParams) {
    console.log($stateParams);
    var details = $http.get('http://94.23.200.181:1337/user/find?id=' + $stateParams.playlistId).then(function (value) {
      $scope.user = value.data;

    })
  })

  //Sujet de Test 2
  .controller('UserCtrl', ['$http', '$scope', '$stateParams', function ($http, $scope, $stateParams) {

    $scope.user = null;
    $scope.previous = null;

    $scope.url = 'http://94.23.200.181:1337/user/4';

    $http.get($scope.url).then(function (value) {
      $scope.user = value.data;
      $scope.previous = value.data;
    }, function (error) {
      console.log('a marche po', error);
    });

    $scope.save = function () {
      $http.post($scope.url, $scope.user
      ).then(function (value) {
        console.log(value);
      }, function (error) {
        console.log('error', error);
      });

    };


    $scope.search = function () {
      $scope.searchAge = 18;
      console.log($scope.searchAge);
      $http.get('http://94.23.200.181:1337/user?age=' + $scope.searchAge).then(function (value) {
        console.log(value);
        $scope.results = value.data;
      });
    };

    $scope.like = function () {
      alert('I like user ' + $scope.randomUser.id);
      $scope.nextRandom();
    };

    $scope.nextRandom = function () {

      $http.get('http://94.23.200.181:1337/user').then(
        function (value) {
          var users = value.data;
          var index = Math.floor(Math.random() * users.length);
          $scope.randomUser = users[index];
        });
    };

    $scope.nextRandom();


  }])
  //Cards Controller
  .controller('CardsCtrl', function ($scope, $http, $timeout, TDCardDelegate) {
    var notvoted = {};
    var voted = [];
    $http.get('http://94.23.200.181:1337/user').then(function (value) {
      for (var i in value.data) {
        notvoted['id_' + value.data[i].id] = value.data[i];
      }
      $http.get('http://94.23.200.181:1337/like').then(function (value) {
        angular.forEach(value.data, function (like) {
          if (notvoted['id_' + like.user_id]) {
            voted.push(notvoted['id_' + like.user_id]);
          }
          delete notvoted['id_' + like.user_id];
        });

        $scope.cards = [];
        angular.forEach(notvoted, function (value) {
          $scope.cards.push(value);
        });
        $scope.cardTypes = $scope.cards;
        $scope.alreadyVoted = voted;
      });
    });


    $scope.cardDestroyed = function (index) {
      $scope.cards.splice(index, 1);
    };

    $scope.addCard = function (index) {
      var newCard = $scope.cardTypes[Math.floor(Math.random() * $scope.cardTypes.length)];
    };

    $scope.cardSwipedLeft = function (index) {
      $scope.addCard(index);
      $scope.cardDestroyed(index);
      $http.post('http://94.23.200.181:1337/like?user_id=' + $scope.cards[index].id + '&status=0');
    };

    $scope.cardSwipedRight = function (index) {
      $http.post('http://94.23.200.181:1337/like?user_id=' + $scope.cards[index].id + '&status=1');
      $scope.cardDestroyed(index);
      $scope.addCard(index);
    };

    $scope.cardPauseVote = function (index) {
      $http.post('http://94.23.200.181:1337/like?user_id=' + $scope.cards[index].id + '&status=2');
      $scope.cardDestroyed(index);
      $scope.addCard(index);
    };
  })

  //Like Controller
  .controller('VoteCtrl', function ($scope, $http, $ionicLoading, $window) {

    var notvoted = {};
    var voted = [];
    $scope.showLoad = function () {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };
    $scope.hideLoad = function () {
      $ionicLoading.hide();
    };
    $http.get('http://94.23.200.181:1337/like/find?status=1').then(function (value) {
      $scope.liked = value.data;
    });

    $http.get('http://94.23.200.181:1337/user').then(function (value) {
      for (var i in value.data) {
        notvoted['id_' + value.data[i].id] = value.data[i];
      }
      // here: voted = [], not_voted = {all users}
      $http.get('http://94.23.200.181:1337/like').then(function (value) {
        angular.forEach(value.data, function (like) {
          if (notvoted['id_' + like.user_id]) {
            voted.push(notvoted['id_' + like.user_id]);
          }
          delete notvoted['id_' + like.user_id];
        });

        $scope.cards = [];
        angular.forEach(notvoted, function (value) {
          $scope.cards.push(value);
        });
        $scope.cardTypes = $scope.cards;
        $scope.alreadyVoted = voted;
      });
    });

    //Delete du like
    $scope.deleteLike = function (id) {

      var url = 'http://94.23.200.181:1337/like/destroy/' + id;
      $http.delete(url);
      $scope.showLoad();
      setTimeout(function () {
        $http.get('http://94.23.200.181:1337/like/find?status=1').then(function (value) {
          $scope.liked = value.data;
          $scope.hideLoad();
        });
      }, 200);
    };

    $scope.refreshList = function () {
      $window.location.reload();
    }
  })

  //Dislike Controller
  .controller('DislikeCtrl', function ($scope, $http, $ionicLoading, $window) {
    var notvoted = {};
    var voted = [];
    $http.get('http://94.23.200.181:1337/like/find?status=0').then(function (value) {
      $scope.liked = value.data;
    });

    $http.get('http://94.23.200.181:1337/user').then(function (value) {
      for (var i in value.data) {
        notvoted['id_' + value.data[i].id] = value.data[i];
      }
      // here: voted = [], not_voted = {all users}
      $http.get('http://94.23.200.181:1337/like').then(function (value) {
        angular.forEach(value.data, function (like) {
          if (notvoted['id_' + like.user_id]) {
            voted.push(notvoted['id_' + like.user_id]);
          }
          delete notvoted['id_' + like.user_id];
        });

        $scope.cards = [];
        angular.forEach(notvoted, function (value) {
          $scope.cards.push(value);
        });
        $scope.cardTypes = $scope.cards;
        $scope.alreadyVoted = voted;
      });
    });

    $scope.show = function () {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };
    $scope.hide = function () {
      $ionicLoading.hide();
    };

    $scope.refreshList = function () {
      $window.location.reload();
    };
    //Delete du Dislike
    $scope.deleteDislike = function (id) {


      var url = 'http://94.23.200.181:1337/like/destroy/' + id;
      $http.delete(url);
      $scope.show();


      setTimeout(function () {
        $http.get('http://94.23.200.181:1337/like/find?status=0').then(function (value) {
          $scope.liked = value.data;
          $scope.hide();
        });
      }, 200);
    };
  })
  .controller('WaitingCtrl', function ($scope, $http, $ionicLoading, $window) {
    $scope.showLoad = function () {
     $ionicLoading.show({
       template: 'Loading...'
     });
    };
    $scope.hideLoad = function () {
     $ionicLoading.hide();
    };
    var notvoted = {};
    var voted = [];
    $http.get('http://94.23.200.181:1337/like/find?status=2').then(function (value) {
     $scope.liked = value.data;
    });

    $http.get('http://94.23.200.181:1337/user').then(function (value) {
     for (var i in value.data) {
       notvoted['id_' + value.data[i].id] = value.data[i];
     }

     $http.get('http://94.23.200.181:1337/like').then(function (value) {
       angular.forEach(value.data, function (like) {
         if (notvoted['id_' + like.user_id]) {
           voted.push(notvoted['id_' + like.user_id]);
         }
         delete notvoted['id_' + like.user_id];
       });

       $scope.cards = [];
       angular.forEach(notvoted, function (value) {
         $scope.cards.push(value);
       });
       $scope.cardTypes = $scope.cards;
       $scope.alreadyVoted = voted;
     });
    });

    $scope.dislike = function (index) {
     $http.post('http://94.23.200.181:1337/like?user_id=' + index + '&status=0');
     var url = 'http://94.23.200.181:1337/like/destroy/' + index;
     $http.delete(url);
     $scope.showLoad();
     setTimeout(function () {
       $http.get('http://94.23.200.181:1337/like/find?status=1').then(function (value) {
         $scope.liked = value.data;
         $scope.hideLoad();
       });
     }, 200);
    };

    $scope.like = function (index) {
     $http.post('http://94.23.200.181:1337/like?user_id=' + index + '&status=1');
    };
  })
;
