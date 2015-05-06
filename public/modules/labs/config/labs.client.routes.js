'use strict';

// Setting up route
angular.module('labs').config(['$stateProvider',
  function($stateProvider) {
    // Articles state routing
    $stateProvider
    .state('bookLabs', {
        url: '/labs',
        templateUrl: 'modules/labs/views/labs.client.view.html'
    })
    // .state('allLabsInfo', {
    //     url: '/labs/info',
    //     templateUrl: 'modules/labs/views/labs-info.client.view.html'
    // })
    .state('labsInfo', {
        url: '/labs/info?private',
        templateUrl: 'modules/labs/views/labs-info.client.view.html'
    })
    .state('labsManage', {
        url: '/labs/management',
        templateUrl: 'modules/labs/views/labs-management.client.view.html'
    });
    // state('listArticles', {
    //   url: '/articles',
    //   templateUrl: 'modules/articles/views/list-articles.client.view.html'
    // }).
    // state('createArticle', {
    //   url: '/articles/create',
    //   templateUrl: 'modules/articles/views/create-article.client.view.html'
    // }).
    // state('viewArticle', {
    //   url: '/articles/:articleId',
    //   templateUrl: 'modules/articles/views/view-article.client.view.html'
    // }).
    // state('editArticle', {
    //   url: '/articles/:articleId/edit',
    //   templateUrl: 'modules/articles/views/edit-article.client.view.html'
    // });
  }
]);
