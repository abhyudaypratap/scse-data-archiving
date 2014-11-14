$(document).ready(function() {
	if ($('.lt-ie10').length) {
		if ($('.lt-ie9').length) {
			window.location.href = '/' + window.location.pathname.split('/')[1] + '/please-update-your-browser';
		} else {
			window.location = '/' + window.location.pathname.split('/')[1] + '/please-update-your-browser';
		}
		return;
	}
});


var eshop = angular.module('Eshop', ['ui.router']).value('$anchorScroll', angular.noop);

eshop.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

		$httpProvider.interceptors.push(function($q, $rootScope) {
			return {
				request: function(config) {
					if (config.url.indexOf('.html') === -1) {
						$('#spinner').fadeIn(200);
					}
					return config;
				},
				response: function(response) {
					$('#spinner').fadeOut(200);
					return response;
				},
				responseError: function(response) {
					$('#spinner').fadeOut(200);
					return response;
				}
			};
		});



		$urlRouterProvider.otherwise('/');
		$stateProvider
				.state('public', {
					template: '<div data-ui-view data-autoscroll="false"></div>',
					resolve: {
						appData: function(dataService, $rootScope, $state) {
							return dataService.getData();
						},
						bindEventStart: function($rootScope, $state, appData, dataService) {
							$rootScope.$on('eventStarted', function() {
								$state.go('event');
							});
						}
					},
					data: {stopCountdown: true},
					controller: function($scope, $state, appData, bindEventStart, dataService) {
						//console.log('some ctrl');
					}
				})
				.state('public.user', {
					template: '<div data-ui-view data-autoscroll="false"></div>',
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.user.login', {
					url: '^/user/login',
					templateUrl: 'login.html',
					data: {bodyClass: "home register", navClass: "white"},
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.user.register', {
					url: '^/user/sign-up',
					templateUrl: 'register.html',
					data: {bodyClass: "home register register-form", navClass: "white"},
					controller: function($scope, $state) {
					}
				})
				.state('public.user.edit', {
					url: '^/user/edit-profile',
					templateUrl: 'edit-profile.html',
					data: {bodyClass: "home register register-form", navClass: "white"},
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.user.forgotten-password', {
					url: '^/user/password-recovery',
					templateUrl: 'forgotten-password.html',
					data: {bodyClass: "other", navClass: "white"},
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.user.forgottenpassword-reset', {
					url: '^/user/password-recovery/reset/:recoveryToken',
					templateUrl: 'forgotten-password-reset.html',
					data: {bodyClass: "other", navClass: "white"},
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.user.register-success', {
					url: '^/user/sign-up/success',
					templateUrl: 'register-success.html',
					data: {bodyClass: "other", navClass: "white", footerClass: ''},
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.user.activation', {
					url: '^/user/activate-account/:activationToken',
					data: {bodyClass: "other", navClass: "white"},
					controller: function($scope, $state, $timeout, $rootScope, dataService) {
						if ($state.params.activationToken) {
							var token = $state.params.activationToken;
							dataService.activateAccount(token).then(function(response) {
								$state.go('public.user.activation-success');
							});
						}
					}
				})
				.state('public.user.activation-success', {
					url: '^/user/activation-success',
					templateUrl: 'activation-success.html',
					data: {bodyClass: "hp activation-success", navClass: "white"},
					controller: function($scope, $state, $timeout, $rootScope, dataService) {
					}
				})

				.state('public.landing', {
					url: '/',
					templateUrl: 'landing-page.html',
					data: {bodyClass: "hp", navClass: "white"},
					controller: function($scope, $state, dataService) {
//						if (dataService.eventRunning() && dataService.userCanParticipate()) {
//							dataService.setFlash('Event in progress!');
//							$state.go('event');
//						}
					}
				})
				.state('public.cannot-play', {
					url: '/not-enlisted',
					templateUrl: 'cannot-play.html',
					data: {bodyClass: "other", navClass: "white"},
					controller: function($scope, $state, dataService) {
					}
				})
				.state('public.landing.timing-info', {
					url: '^/timing-info',
					templateUrl: 'timing-info.html',
					data: {bodyClass: "hp modal-open", navClass: "white"},
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.anniversary', {
					url: '/anniversary',
					templateUrl: 'anniversary.html',
					data: {bodyClass: "parallax active", navClass: "white", stopCountdown: true},
					controller: function($scope, $state, dataService) {
//						if (dataService.eventRunning() && dataService.userCanParticipate()) {
//							dataService.setFlash('Event in progress!');
//							$state.go('event');
//						}
					}
				})
				.state('public.event-unavailiable', {
					url: '/event-unavailiable',
					templateUrl: 'events.html',
					data: {bodyClass: "hp", navClass: "white"},
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.event-started', {
					url: '/event-started',
					templateUrl: 'events.html',
					data: {bodyClass: "hp", navClass: "white"},
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.howto', {
					template: '<div ui-view autoscroll="false"></div>',
					data: {bodyClass: "hp", navClass: "white", stopCountdown: true},
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.howto.page1', {
					url: '^/how-to/step-1',
					templateUrl: 'how-to-1.html',
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.howto.page2', {
					url: '^/how-to/step-2',
					templateUrl: 'how-to-2.html',
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.howto.page3', {
					url: '^/how-to/step-3',
					templateUrl: 'how-to-3.html',
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.winners', {
					url: '^/winners',
					templateUrl: 'winners.html',
					data: {bodyClass: "training-sec event-select winners-page", navClass: "white", stopCountdown: true},
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})



				// training
				.state('training', {
					template: '<div ui-view autoscroll="false"></div>',
					resolve: {
						appData: function(dataService, $rootScope, $state) {
							return dataService.getData();
						},
						bindEventStart: function($rootScope, $state, appData, dataService) {
							$rootScope.$on('eventStarted', function() {
								$state.go('event');
							});
						}
					},
					controller: function($scope, $state, appData, bindEventStart, dataService) {
						if (dataService.eventRunning() && dataService.userCanParticipate()) {
							dataService.setFlash('Event in progress!');
							$state.go('event');
							return;
						}
						if (dataService.eventEnded()) {
							//$state.go('public.landing');
							//return;
						}
						//dataService.logTraining();
					}
				})
				.state('training.start', {
					url: '^/training-welcome',
					templateUrl: 'training-welcome.html',
					data: {bodyClass: "training-sec", navClass: "white", startCountdown: false, stopCountdown: true},
					controller: function($scope, $state) {
						//console.log('training welcome ctrl');
					}
				})
				.state('training.category-select', {
					url: '^/training/categories',
					templateUrl: 'category-list.html',
					data: {bodyClass: "home", navClass: "training", startCountdown: true, stopCountdown: false},
					controller: function($scope, $state, dataService) {
						if (!dataService.userData.user.id) {
							dataService.setFlash(dataService.appData.data.messages.LOGIN_REQUIRED_FOR_TRAINING);
							$state.go('training.start');
						}
					}
				})
				.state('training.category', {
					url: '^/training/category/:categoryId/products',
					templateUrl: 'product-list.html',
					data: {bodyClass: "home", navClass: "training", startCountdown: true},
					controller: function($scope, $state, dataService) {
						if (!dataService.userData.user.id) {
							dataService.setFlash(dataService.appData.data.messages.LOGIN_REQUIRED_FOR_TRAINING);
							$state.go('training.start');
						}
					}
				})
				.state('training.detail', {
					url: '^/training/product/:productId',
					templateUrl: 'product-detail.html',
					data: {bodyClass: "home", navClass: "training", startCountdown: true},
					controller: function($scope, $state, dataService) {
						if (!dataService.userData.user.id) {
							dataService.setFlash(dataService.appData.data.messages.LOGIN_REQUIRED_FOR_TRAINING);
							$state.go('training.start');
						}
					}
				})
				.state('training.lose', {
					url: '^/training/too-late',
					templateUrl: 'training-lose.html',
					data: {bodyClass: "other", navClass: "white"},
					controller: function($scope, $state, dataService) {
						if (!dataService.trainingFailed) {
							dataService.trainingFailed = false;
							$state.go('public.landing');
						}
					}
				})
				.state('training.success', {
					url: '^/training/success',
					templateUrl: 'training-win.html',
					data: {bodyClass: "other", navClass: "white", stopCountdown: true},
					controller: function($scope, $state, dataService) {
						var rd = dataService.getResultData();
						if (!rd.resultProduct) {
							$state.go('public.landing');
						}
					}
				})



				// event
				.state('event', {
					template: '<div data-ui-view data-autoscroll="false" />',
					data: {bodyClass: "", navClass: "", startCountdown: true, stopCountdown: false},
					resolve: {
						appData: function(dataService, $state) {
							return dataService.getData();
						}
					},
					controller: function($scope, $state, appData, dataService) {
						if (!dataService.userData.user || !dataService.userData.user.id) {
							$state.go('public.user.login');
							return;
						}
						if (!dataService.userCanParticipate()) {
							$state.go('public.cannot-play');
							return;
						}
						if (dataService.contestWon || dataService.eventFailed) {
							$state.go('public.landing');
							return;
						}
						dataService.invalidateData();
						$state.go('event.category-select');
					}
				})
//				.state('event.start', {
//					url: '^/training-welcome',
//					templateUrl: 'training-welcome.html',
//					data: {bodyClass: "training-sec", navClass: "white", startCountdown: false, stopCountdown: true},
//					controller: function($scope, $state) {
//						//console.log('training welcome ctrl');
//					}
//				})
				.state('event.category-select', {
					url: '^/event/:key/categories',
					templateUrl: 'category-list.html',
					data: {bodyClass: "home", navClass: "", startCountdown: true, stopCountdown: false},
					controller: function($scope, $state, appData, dataService) {
						//console.log(dataService);
					}
				})
				.state('event.category', {
					url: '^/event/:key/category/:categoryId/products',
					templateUrl: 'product-list.html',
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('event.detail', {
					url: '^/event/:key/product/:productId',
					templateUrl: 'product-detail.html',
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('event.detail.related', {
					templateUrl: 'products-related.html',
					url: '^/event/:key/product/:productId/related',
					data: {bodyClass: "modal-open", navClass: ""},
					controller: function($scope, $state) {
						//console.log('some ctrl');
					}
				})
				.state('public.lose', {
					url: '^/event/:key/gift',
					templateUrl: 'event-lose.html',
					data: {bodyClass: "other", navClass: "white"},
					controller: function($scope, $state, dataService, $timeout) {
						if (!dataService.eventFailed) {
							$state.go('public.landing');
						}
					}
				})
				.state('public.success', {
					url: '^/event/:key/congratulations',
					templateUrl: 'event-success.html',
					data: {bodyClass: "other", navClass: "white", stopCountdown: true},
					controller: function($scope, $state, dataService, $timeout) {
						if (!dataService.contestWon) {
							$state.go('public.landing');
						}
					}
				})
				.state('public.ended', {
					url: '^/event/:key/ended',
					templateUrl: 'event-ended.html',
					data: {stopCountdown: true},
					controller: function($scope, $state, dataService) {
						if (!dataService.appData.data.event.ended) {
							$state.go('public.landing');
						}
					}
				})
				.state('public.video', {
					url: '^/gas-in-barcelona',
					templateUrl: 'video.html',
					data: {bodyClass: "video", navClass: "white"},
					controller: function($scope, $state, dataService) {

					}
				})



//				.state('event.detail.related', {
//					url: '^/product/:productId/related',
//					templateUrl: 'products-related.html',
//					data: {bodyClass: "modal-open", navClass: "white"},
//					controller: function($scope, $state) {
//						//console.log('some ctrl');
//					}
//				})
//				.state('finished', {
//					template: '<div ui-view autoscroll="false"></div>',
//					controller: function($scope, $state) {
//						//console.log('some ctrl');
//					}
//				})
//				.state('finished.success', {
//					url: '^/congratulations',
//					templateUrl: 'success.html',
//					controller: function($scope, $state) {
//						//console.log('some ctrl');
//					}
//				})
//				.state('finished.lose', {
//					url: '^/gift',
//					templateUrl: 'lose.html',
//					controller: function($scope, $state) {
//						//console.log('some ctrl');
//					}
//				})


				;


		//$locationProvider.html5Mode(true);
	}]);
eshop.run(['$rootScope', '$window', 'dataService', function($rootScope, $window, dataService) {
		$rootScope.$on('$viewContentLoaded', function(event, toState, toParams, fromState, fromParams) {
			$('input, textarea').placeholder();
		});
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			$('.dropdown').removeClass('open');
			if (toState.data) {
				var turl = window.location.pathname + "#" + toState.url.replace('^', '');
				ga('send', 'pageview', {
					title: toState.name,
					page: turl
				});
				ga('trackerIndia.send', 'pageview', {
					title: toState.name,
					page: turl
				});
				
				$rootScope.eshopUi = {};
				$rootScope.eshopUi.bodyClass = toState.data.bodyClass;
				$rootScope.eshopUi.navClass = toState.data.navClass;
				if (!(toState.data.footerClass || toState.data.footerClass === '')) {
					$rootScope.eshopUi.footerClass = $rootScope.eshopUi.navClass;
				}
				if (toState.data.stopCountdown && !dataService.eventActive) {
					dataService.stopTrainingTimer();
				}

				if (toState.data.bodyClass.indexOf('register-form') !== -1) {
					$('#metaViewportTag').attr('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
					window.nonResponsiveCss = $('.non-responsive-css').remove();
				} else {
					if (!$('.non-responsive-css').length) {
						$('#metaViewportTag').attr('content', 'width=1200, user-scalable=yes');
						$('.bootstrap-css').after(window.nonResponsiveCss);
					}
				}
			}

		});

	}]);
