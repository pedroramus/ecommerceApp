'use strict'
angular.module("myApp", ['ngResource', 'ui.router', 'ui.bootstrap', 'ngCookies'])

.run(function($rootScope, $state, authentication, $cookies) {

    //Check if user is loggedin (cookies)
    $rootScope.loggedIn = false;
    authentication.isloggedin(function(response) {
        console.log(!response.user);
        if (response.user !== false) {
            console.log(response)
            $rootScope.loggedIn = true;
            $state.go("app.dashboard");
            $rootScope.loggedUser = $cookies.get('usuario');
        }
    });

    $rootScope.logOut = function() {
        authentication.logOut(function(data) {
            console.log(data);
            $cookies.remove('usuario');
            $state.go("app.home");
            $rootScope.loggedIn = false;
        });
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, fromState, toParams) {
        console.log('mudei de estado', toState)
        var isLoggedIn = $rootScope.loggedIn;
        //check if client is trying to access a restricted page
        //toState.authenticate = true and is
        if (toState.authenticate && !isLoggedIn) {
            event.preventDefault();
            //if toState.authenticate = true and isLoggedIn = false
            //Redirect to login page
            $state.go("app.login");
        }
    })
    console.log('Hello')
})
    .config(function($stateProvider, $urlRouterProvider) {


        $stateProvider
            .state('app', {
                abstract: true,
                url: "/app",
                template: '<ui-view/>',

            })

        .state('app.home', {
            url: "/home",
            templateUrl: 'components/home/home.view.html',
            controller: 'HomeCtrl'
        })


        .state('app.produtos', {
            url: "/produtos",
            templateUrl: 'components/produtos/produtos.view.html',
            controller: 'ProdutosCtrl as vm',
            authenticate: true
            //            template : '<h1>Funciona</h1>',

        })
        
            .state('app.produtosDetail', {
            url: "/produtos/:id",
            templateUrl: 'components/produtos/produtoDetail.view.html',
            controller: 'produtoDetailCtrl as vm',
            authenticate: true

        })

        .state('app.search', {
            url: "/search",
            templateUrl: 'components/search/search.view.html',
            controller: 'SearchResultsCtrl as vm'
            //            template : '<h1>Funciona</h1>',

        })

        .state('app.signup', {
            url: "/signup",
            templateUrl: 'components/signup/signup.view.html',
            controller: 'SignupCtrl as vm'
            //            template : '<h1>Funciona</h1>',

        })

        .state('app.login', {
            url: "/login",
            templateUrl: 'components/login/login.view.html',
            controller: 'LoginCtrl as vm',
            //            template : '<h1>Funciona</h1>',



        })

        .state('app.dashboard', {
            url: "/dashboard",
            templateUrl: 'components/dashboard/dashboard.view.html',
            controller: 'Dashboard as vm',
            //            template : '<h1>Funciona</h1>',
            authenticate: true


        })
        console.log('router')
        $urlRouterProvider.otherwise('home/home');
    });