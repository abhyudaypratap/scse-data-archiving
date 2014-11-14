eshop.directive('navbar', function () {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'navbar.html'
	};
});
eshop.directive('banner', function () {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'banner.html'
	};
});
eshop.directive('breadcrumbs', function () {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'breadcrumbs.html'
	};
});
eshop.directive('footer', function () {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'footer.html'
	};
});
eshop.directive('fbRoot', ['$FB', 'dataService', function ($FB, dataService) {
		return {
			restrict: "A",
			replace: true,
			template: "<div id='fb-root'></div>",
			priority: 5,
			link: function (scope, elem, attrs, controller) {

				dataService.getFacebookAppInfo().then(function (appInfo) {

					var fbAppId = appInfo.app.APP_ID || '';

					var fb_params = {
						appId: appInfo.app.APP_ID || "",
						cookie: appInfo.app.cookie || true,
						status: appInfo.app.status || true,
						xfbml: appInfo.app.xfbml || true
					};

					// Setup the post-load callback
					window.fbAsyncInit = function () {
						FB.init(fb_params);

						// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
						// for any authentication related change, such as login, logout or session refresh. This means that
						// whenever someone who was previously logged out tries to log in again, the correct case below 
						// will be handled. 
//								FB.Event.subscribe('auth.authResponseChange', function(response) {
//									// Here we specify what we do with the response anytime this event occurs. 
//									if (response.status === 'connected') {
//										// The response object is returned with a status field that lets the app know the current
//										// login status of the person. In this case, we're handling the situation where they 
//										// have logged in to the app.
//										// Here we run a very simple test of the Graph API after login is successful. 
//										// This testAPI() function is only called in those cases. 
//										function testAPI() {
//											//console.log('Welcome!  Fetching your information.... ');
//											FB.api('/me', function(response) {
//												//console.log('Good to see you, ' + response.name + '.');
//											});
//										}
//										testAPI();
//									}
//								});
					};

					(function (d, s, id, fbAppId) {
						var js, fjs = d.getElementsByTagName(s)[0];
						if (d.getElementById(id))
							return;
						js = d.createElement(s);
						js.id = id;
						js.async = true;
						js.src = "//connect.facebook.net/en_US/all.js";
						fjs.parentNode.insertBefore(js, fjs);
					}(document, 'script', 'facebook-jssdk', fbAppId));
				});

			}
		};
	}]);
eshop.directive('fbLoginButton', function ($q, dataService) {
	return {
		priority: 1,
		replace: true,
		restrict: 'E',
		link: function (scope, elem, attrs) {
			elem.click(function (e) {
				e.preventDefault();
				FB.login();
			});
		},
//		compile: function(scope, element, attrs) {
//			var deferred = $q.defer();
//			dataService.getFacebookAppInfo().then(function(appInfo) {
//				scope.facebookScope = appInfo.APP_SCOPE;
//				deferred.resolve();
//			});
//			return deferred.promise;
//		},
		//template: '<div class="fb-login-button" scope="email">FB Connect</div>'
		template: '<a href="#">FB Connect</div>'
	};
});
eshop.directive('paralaxSwitches', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {


			$('a.go-top-link').click(function (e) {

				e.preventDefault();
				var position = 0;

				$('html, body').animate({
					scrollTop: position
				}, 1000);

			});


			$(document).on('click', '.right-menu a', function (e) {
				var href = $(this).attr('data-href');

				var $this = $(href);
				e.preventDefault();
				var position = $this.offset().top;
				$('.right-menu li').removeClass('active');
				$(this).parents().addClass('active');
				$('html, body').animate({
					scrollTop: position
				}, 800);

			});




			var lastId,
					topMenu = $(".right-menu"),
					// All list items
					menuItems = topMenu.find(" a"),
					// Anchors corresponding to menu items
					scrollItems = menuItems.map(function () {

						var item = $($(this).attr("data-href"));


						//console.log(item);
						if (item.length) {
							return item;
						}
					});


			$(window).scroll(function () {
				// Get container scroll position


				var fromTop = $(this).scrollTop();
				var topPx = 0;
				// Get id of current scroll item

				var cur = scrollItems.map(function () {

					if ($(this).offset().top - 10 < fromTop) {
						return this;
					}
				});





				// Get the id of the current element
				cur = cur[cur.length - 1];

				var id = cur && cur.length ? cur[0].id : "";





				if (lastId !== id) {
					lastId = id;
					// Set/remove active class
					$(".right-menu li").removeClass("active");
					$(".right-menu a[data-href=#" + id + "]").parent().addClass("active");
				}
			});


		}
	};
});

eshop.directive('categoryTabs', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {


			$('.menu-items .dropdown-toggle').click(function (e) {

				e.preventDefault();
				if ($(this).parent().hasClass("open")) {
					$(".menu-items").addClass("start");
				} else if ($(".menu-items .dropdown.open")) {
					$(".menu-items").removeClass("start");

				} else {
					$(".menu-items").addClass("start");
				}

			});


		}
	};
});

eshop.directive('digitsOnly', function () {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {
			if (!ngModelCtrl) {
				return;
			}
			var min = parseInt(attrs['min'], 10);
			var max = parseInt(attrs['max'], 10);

			ngModelCtrl.$parsers.unshift((function (min, max) {
				var min = min;
				var max = max;
				return function (val) {
					var value = parseInt(val, 10);
					var changed = false;
					if (value > max) {
						changed = true;
						value = max;
					}
					if (value < min) {
						changed = true;
						value = min;
					}
					if (changed) {
						ngModelCtrl.$setViewValue(value);
						ngModelCtrl.$render();
					}
					return value;
				};
			})(min, max));

			element.bind('keypress', function (event) {
				if (!(event.originalEvent.charCode >= 48 && event.originalEvent.charCode <= 57)) {
					event.preventDefault();
				}
			});
		}
	};
});


eshop.directive('niceCheckbox', function ($timeout) {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {
			if (!ngModelCtrl) {
				return;
			}

			element.wrap($('<div class="checkbox-wrap" />'));
			element.parent().append('<span />');
			element.bind('change', function (event) {
				var $this = $(this);
				if ($this.is(':checked')) {
					$this.parent().addClass('checked');
				} else {
					$this.parent().removeClass('checked');
				}
			});
			$timeout(function () {
				element.trigger('change');
			});
		}
	};
});
eshop.directive('niceRadio', function ($timeout) {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {
			if (!ngModelCtrl) {
				return;
			}

			element.wrap($('<div class="radio-wrap" />'));
			element.parent().append('<span />');
			var sameNamed = null;

			element.bind('change', function (event) {
				var $this = $(this);
				if ($this.is(':checked')) {
					sameNamed.parent().removeClass('checked');
					$this.parent().addClass('checked');
				} else {
					$this.parent().removeClass('checked');
				}
			});
			$timeout(function () {
				sameNamed = $('[name="' + element.attr('name') + '"]', element.parents('form'));
				element.trigger('change');
			}, 500);
		}
	};
});


eshop.directive('trainingTimer', function (dataService) {
	return {
		restrict: 'A',
		template: '<canvas class="doughnut" width="131" height="131"></canvas>',
		replace: true,
		link: function (scope, element, attrs) {

			var options = {
				//Boolean - Whether we should show a stroke on each segment
				segmentShowStroke: false,
				//String - The colour of each segment stroke
				segmentStrokeWidth: 2,
				//The percentage of the chart that we cut out of the middle.
				percentageInnerCutout: 80,
				//Boolean - Whether we should animate the chart	
				animation: false
			};


			var ctx = element[0].getContext("2d");
			var chart = new Chart(ctx);

			scope.$watch('timer', function (data) {
				var seconds = parseInt(data.seconds, 10);
				var duration = parseInt(data.durationSeconds, 10);
				var elapsedPercent = Math.floor((seconds / duration) * 100);
				var data = [
					{
						value: 100 - elapsedPercent,
						color: "#491b6f"
					},
					{
						value: elapsedPercent,
						color: "transparent"
					}
				];
				chart.Doughnut(data, options);
			}, true);

		}
	};
});
eshop.directive('goTopBtn', function () {
	return {
		restrict: 'C',
		templateUrl: 'go-top-link.html',
		link: function (scope, element, attrs) {
			element.on('click', function (e) {
				e.preventDefault();
				$("body, html").animate({scrollTop: 0}, "slow");
			});
		}
	};
});
eshop.directive('fpProcess', function ($timeout) {
	return {
		restrict: 'A',
		templateUrl: 'how-to-manual.html',
		link: function (scope, element, attrs) {
			$timeout(function () {
				if (!(('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch) || ((typeof hash !== 'undefined' && hash['touch'] && hash['touch'].offsetTop) === 9))) {
					var s = $('html').data('scrollr');
					if (s) {
						s.destroy();
						$('html, body').attr('style', '');
					}
					s = skrollr.init({
						edgeStrategy: 'set',
						forceHeight: false
					});
					$('html').data('scrollr', s);
				}
			});
		}
	};
});
eshop.directive('timerStripe', function ($timeout) {
	return {
		restrict: 'A',
		templateUrl: 'timer-stripe.html',
		replace: true
	};
});
eshop.directive('flashes', function (dataService) {
	return {
		restrict: 'A',
		replace: true,
		scope: {},
		//template: '<ul><li ng-repeat="flash in flashes" class="flashmessage" ng-show="flash.fresh">{{flash.text}}</li></ul>',
		template: '<ul class="flashmessages"><li ng-repeat="flash in flashData.flashes">{{flash}}</li></ul>',
//		scope: {
//			flashes: '=ngModel'
//		},
		link: function (scope, element, attrs) {
			scope.flashData = dataService.flashData;
		}
	};
});

eshop.directive('img', function (dataService) {
	return {
		restrict: 'E',
		link: function (scope, element, attrs) {
			element.bind('error', function (e) {
				e.preventDefault();
				element.parents('.item').hide();
			})
		}
	};
});

eshop.directive('hideBadImg', function (dataService) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.bind('error', function (e) {
				e.preventDefault();
				element.parents('.item-category').hide();
			});
		}
	};
});

eshop.directive('shareButton', function (dataService) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.bind('click', function (e) {
				e.preventDefault();
				var link = window.location.protocol + '//' + window.location.host;
				if (link.indexOf('localhost') !== -1) {
					link = 'http://gasjeans.com';
				}
				var ssettings = {
					method: 'feed',
					name: attrs.title,
					link: link,
					//caption: attrs.title,
					description: attrs.description
				};

				var picture = '';
				try {
					picture = link + '/img/products' + dataService.resultData.resultProduct.images[0];
				} catch (e) {
				}
				if (picture) {
					ssettings.picture = picture;
				}

				FB.ui(ssettings, function (response) {
					if (response && response.post_id) {
						//alert('Post was published.');
					} else {
						//alert('Post was not published.');
					}
				});

			});
		}
	};
});

eshop.directive('fixHowtoHeight', function (dataService, $timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var nh = 78;//$('.navbar').height();
			var fh = $('#footer').outerHeight();
			$timeout(function () {
				var h = $(window).height();

				h = h - nh - fh;
				if (h > 542) {
					element.css({height: h + 'px'});
				} else {
					element.css({height: 542 + 'px'});
				}
			}, 0);
			//element.css({height: h + 'px'});
			$(window).resize(function () {
				h = $(window).height();
				h = h - nh - fh;
				if (h > 542) {
					element.css({height: h + 'px'});
				} else {
					element.css({height: 542 + 'px'});
				}
			});
		}
	};
});

eshop.directive('googleAnalyticsBase', function (dataService) {
	return {
		restrict: 'A',
		priority: 1,
		link: function (scope, element, attrs) {
			(function (i, s, o, g, r, a, m) {
				i['GoogleAnalyticsObject'] = r;
				i[r] = i[r] || function () {
					(i[r].q = i[r].q || []).push(arguments);
				}, i[r].l = 1 * new Date();
				a = s.createElement(o),
						m = s.getElementsByTagName(o)[0];
				a.async = 1;
				a.src = g;
				m.parentNode.insertBefore(a, m);
			})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

			ga('create', 'UA-49477272-1', 'gasjeans.com');

		}
	};
});

eshop.directive('googleAnalyticsPageview', function (dataService) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			
		}
	};
});

eshop.directive('googleRemarketing', function (dataService) {
	return {
		restrict: 'A',
		templateUrl: 'google-remarketing.html',
		link: function (scope, element, attrs) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = '//b90.yahoo.co.jp/conv.js';
			$("body").append(script);
			//<script type="text/javascript" language="javascript" charset="UTF-8" src="//b90.yahoo.co.jp/conv.js"></script>
		}
	};
});
eshop.directive('yahooConversion', function (dataService) {
	return {
		restrict: 'A',
		templateUrl: 'yahoo-conversion.html',
		link: function (scope, element, attrs) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = '//b92.yahoo.co.jp/js/s_retargeting.js';
			$("body").append(script);
			//<script type="text/javascript" language="javascript" src="//b92.yahoo.co.jp/js/s_retargeting.js"></script>
		
		}
	};
});
eshop.directive('pixelRemarketing', function (dataService) {
	return {
		restrict: 'A',
		templateUrl: 'pixel-remarketing.html',
		link: function (scope, element, attrs) {
		}
	};
});
eshop.directive('pixelRemarketingFirst', function (dataService) {
	return {
		restrict: 'A',
		templateUrl: 'pixel-remarketing-first.html',
		link: function (scope, element, attrs) {
		}
	};
});
eshop.directive('pixelRemarketingSecond', function (dataService) {
	return {
		restrict: 'A',
		templateUrl: 'pixel-remarketing-second.html',
		link: function (scope, element, attrs) {
		}
	};
});
eshop.directive('pixelRemarketingForm', function (dataService) {
	return {
		restrict: 'A',
		templateUrl: 'pixel-remarketing-form.html',
		link: function (scope, element, attrs) {
		}
	};
});
