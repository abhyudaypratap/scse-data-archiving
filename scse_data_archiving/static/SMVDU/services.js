eshop.service('dataService', function($http, $q, $timeout, categoryService, $rootScope, $state) {
	this.eventDuration = 30;
	this.dataRequested = false;
	this.eventActive = false;

	this.itemWon = false;
	this.trainingFailed = false;

	this.resultData = {
		resultTime: null
	},
	this.filterData = {
		filter: {
			productId: null,
			categoryId: null,
			product: null,
			category: null,
			breadcrumbs: null
		}
	};
	this.flashData = {
		flashCnt: 0,
		flashes: {}
	};
	this.appData = {
		data: {
		}
	};
	this.fbDeferred = $q.defer();
	this.productData = {
		data: {
			products: null,
			categories: null,
			categoryTree: null
		}
	};
	this.eventStartTime = null;
	this.countdownTimer = {
		time: {}
	};
	this.timer = {
		time: {}
	};
	this.errors = {};
	this.userData = {
		user: {
			gender: ''
		}
	};
	this.loginData = {
		user: {
			remember: true
		}
	};

	this.routingData = {
		routePrefix: 'training/'
	};

	this.trainingData = {
	};

	this.getData = function() {
		var that = this;
		if (!this.dataDeferred) {
			this.dataDeferred = $q.defer();
		}
		if (!this.dataRequested && !this.dataPresent) {
			//var queue = [];
			this.dataRequested = true;
			var basePath = window.location.pathname.split('/')[1];
			//this.d1 = $q.defer();

			//this.d2 = $q.defer();
			$http.get(window.GLOBALS.cdnBase + '/' + basePath + '/product-data?v12').then(function(result) {

				that.originalProductData = result;
				that.processProductData(that.originalProductData, basePath);

				$http.get('/' + basePath + '/data').then(function(result) {
					that.appData.data.event = result.data.data.event;
					that.appData.data.eventStartTime = moment().valueOf() + that.appData.data.event.startsInMilliseconds;
					if (that.appData.data.event.startsInMilliseconds <= 0) {
						that.startEvent();
					}
					if (that.appData.data.event.duration) {
						that.eventDuration = that.appData.data.event.duration;
					}

					//that.appData.data.categoryTree = that.buildCategoryTree(that.appData.data.categories);

					that.appData.data.voucher = result.data.data.voucher;
					that.appData.data.countries = result.data.data.countries;
					that.appData.data.messages = result.data.data.messages;
					that.appData.data.facebook = result.data.data.facebook;
					that.fbDeferred.resolve(that.appData.data.facebook);



					for (var f in result.data.data.flashes) {
						that.setFlash(result.data.data.flashes[f].data.message);
					}
					//that.appData.data.flashes = result.data.data.flashes;



					var monthnames = {
						HU: {
							April: 'April',
							May: 'May'
						},
						IT: {
							April: 'APRILE',
							May: 'MAGGIO'
						}
					};
					var countryadjectives = {
						IT: {
							Japanese: 'GIAPPONESE',
							Hungarian: 'UNGHERIA',
							Russian: 'RUSSO',
							Indian: 'INDIANO',
							European: 'EUROPEANO',
							Italian: 'ITALIANO'
						}
					};
					var countrynames = {
						IT: {
							Japanese: 'GIAPPONESE',
							Hungary: 'UNGHERIA',
							Russian: 'RUSSO',
							Indian: 'INDIANO',
							Europe: 'EUROPA',
							Italy: 'ITALIA'
						}
					};
					that.appData.data.events = result.data.data.events;
					for (var e in that.appData.data.events) {
						var time = moment(that.appData.data.events[e].start);
						that.appData.data.events[e].day = time.format('D');
						that.appData.data.events[e].month = time.format('MMMM');

						// nasty hacks
						if (monthnames[that.appData.data.event.code] && monthnames[that.appData.data.event.code][that.appData.data.events[e].month]) {
							that.appData.data.events[e].month = monthnames[that.appData.data.event.code][that.appData.data.events[e].month];
						}
						if (countryadjectives[that.appData.data.event.code] && countryadjectives[that.appData.data.event.code][that.appData.data.events[e].adjective]) {
							that.appData.data.events[e].adjective = countryadjectives[that.appData.data.event.code][that.appData.data.events[e].adjective];
						}
						if (countrynames[that.appData.data.event.code] && countrynames[that.appData.data.event.code][that.appData.data.events[e].area]) {
							that.appData.data.events[e].area = countrynames[that.appData.data.event.code][that.appData.data.events[e].area];
						}
						if (that.appData.data.event.code === 'IT') {
							that.appData.data.events[e].alternate_name = 'EVENTO ' + that.appData.data.events[e].adjective;
						}
					}

					that.appData.data.icalEventUrl = result.data.data.icalEventUrl;

					if (that.filterData.filter.categoryId) {
						that.setCategoryFilter(that.filterData.filter.categoryId);
					}
					if (that.filterData.filter.productId) {
						that.setProductFilter(that.filterData.filter.productId);
					}

					if (that.userData.user) {
						that.userData.user = angular.extend(that.userData.user, result.data.data.user);
						if (parseInt(that.userData.user.purchased_product_id, 10)) {
							that.stopEvent();
						}
					}
					// flag if voucher was requested
					if (result.data.data.user && result.data.data.user.voucherToken) {
						that.countdownTimer.voucherRequested = true;
					}


					that.countdownTimer.stage = 0;
					if (!that.eventEnded() && !that.eventRunning()) {
						that.startCountdownTimer();
					}

					if (that.eventRunning()) {
						that.countdownTimer.stage = 2;
					}
					if (that.eventEnded()) {
						that.countdownTimer.stage = 3;
						that.stopEvent();
					}


					//that.d1.resolve();
					that.dataDeferred.resolve();
				});

				//that.d2.resolve();
			});

//			queue.push(this.d1.promise);
//			queue.push(this.d2.promise);


//			$q.all(queue).then(function(ful) {
//				alert('DONE');
//				that.dataPresent = true;
//				that.dataDeferred.resolve();
//			});

		} else if (that.dataPresent) {
			that.dataDeferred.resolve();
		}

		this.countdownTimer.time.months = '00';
		this.countdownTimer.time.days = '00';
		this.countdownTimer.time.hours = '00';
		this.countdownTimer.time.minutes = '00';
		this.countdownTimer.time.seconds = '00';

		return that.dataDeferred.promise;
	};
	this.processProductData = function(result, basePath) {
		var that = this;
		var products = {};
		for (var i in result.data.data.products) {
			var sizes = {};
			var hasSize = false;
			for (var j in result.data.data.products[i].sizes) {
				result.data.data.products[i].sizes[j].id = parseInt(result.data.data.products[i].sizes[j].id, 10);
				result.data.data.products[i].sizes[j].quantity = parseInt(result.data.data.products[i].sizes[j].quantity, 10);
				sizes[result.data.data.products[i].sizes[j].id] = result.data.data.products[i].sizes[j];
				if (result.data.data.products[i].sizes[j].event && result.data.data.products[i].sizes[j].quantity) {
					hasSize = true;
				}
			}
			result.data.data.products[i].sizes = sizes;
			result.data.data.products[i].id = parseInt(result.data.data.products[i].id, 10);
			result.data.data.products[i].category_id = parseInt(result.data.data.products[i].category_id, 10);
			if (hasSize) {
				products[result.data.data.products[i].id] = result.data.data.products[i];
				if (!result.data.data.products[i].related) {
					result.data.data.products[i].related = false;
				}
			}
			//products[result.data.products[i].id].images = JSON.parse(products[result.data.products[i].id].images);
		}
		result.data.data.products = products;
		for (var i in result.data.data.categories) {
			result.data.data.categories[i].id = parseInt(result.data.data.categories[i].id, 10);
			if (result.data.data.categories[i].id === 200007 && (basePath === 'it' || basePath === 'eu')) {
				delete result.data.data.categories[i];
			}
			if (result.data.data.categories[i] &&
					(
					result.data.data.categories[i].id === 200006 ||
					result.data.data.categories[i].id === 2000019 || 
					result.data.data.categories[i].id === 1000013 ||
					result.data.data.categories[i].id === 1000016
					) && (basePath === 'jp')) {
				delete result.data.data.categories[i];
			}
			if (result.data.data.categories[i] &&
					(
					result.data.data.categories[i].id === 1000013 ||
					result.data.data.categories[i].id === 1000014 || 
					result.data.data.categories[i].id === 1000020 ||
					result.data.data.categories[i].id === 1000023 ||
					result.data.data.categories[i].id === 200005 ||
					result.data.data.categories[i].id === 200006 ||
					result.data.data.categories[i].id === 2000014 ||
					result.data.data.categories[i].id === 2000019 ||
					result.data.data.categories[i].id === 2000017
					) && (basePath === 'in')) {
				delete result.data.data.categories[i];
			}
		}


		that.productData.data.products = result.data.data.products;
		that.productData.data.categories = result.data.data.categories;
		that.productData.data.categoryTree = that.buildCategoryTree(that.productData.data.categories);

	};
	this.startEvent = function() {
		this.timer.event = true;
		this.eventActive = true;
		this.appData.data.eventActive = true;
		this.appData.data.event.started = true;
		this.appData.data.event.userCanParticipate = this.userCanParticipate();
		this.routingData.routePrefix = 'event//';
	};
	this.stopEvent = function() {
		this.timer.event = false;
		this.eventActive = false;
		this.appData.data.eventActive = false;
		this.appData.data.event.ended = true;
		this.countdownTimer.stage = 3;
		this.routingData.routePrefix = 'training/';
	};
	this.invalidateData = function() {
		delete this.productData.data.products;
		delete this.productData.data.categories;
		delete this.productData.data.categoryTree;
		this.processProductData(this.originalProductData, window.location.pathname.split('/')[1]);
	};
	this.eventRunning = function() {
		return this.appData.data.event.started && !this.appData.data.event.ended;
	};
	this.eventEnded = function() {
		return this.appData.data.event.ended;
	};
	this.eventKeyMatches = function(key) {
		//console.log(key);
		return true;
	};
	this.userCanParticipate = function() {
		return !(!this.userData.user.eventCode || this.userData.user.eventCode !== this.appData.data.event.code);
	};
	this.setResultTime = function() {
		this.resultData.resultTime = this.eventDuration - this.timer.seconds;
	};
	this.setResultProduct = function() {
		this.resultData.resultProduct = this.filterData.filter.product;
	};

	this.getResultData = function() {
		return this.resultData;
	};
	this.getProductData = function() {
		return this.productData;
	};
	this.getRoutingData = function() {
		return this.routingData;
	};
	this.getUser = function() {
		return this.userData;
	};
	this.getLoginData = function() {
		return this.loginData;
	};
	this.getFacebookAppInfo = function() {
		return this.fbDeferred.promise;
	};


	this.checkout = function(eventCode, productId, sizeId) {
		var that = this;
		return $http.post('/checkout/' + eventCode + '/' + productId + '/' + sizeId).then(function(result) {
			return that.digestResult(result);
		});
	};
	this.requestVoucher = function() {
		var that = this;
		var eventCode = this.userData.user.eventCode;
		if (eventCode) {
			return $http.post('/' + eventCode.toLowerCase() + '/request-voucher').then(function(result) {
				return that.digestResult(result);
			});
		}
		return null;
	};
	this.logTraining = function() {
		var that = this;
		return $http.post('/log-training').then(function(result) {
			return that.digestResult(result);
		});
	};
	this.login = function(data) {
		var that = this;
		return $http.post('/login', data).then(function(result) {
			if (result.data.data.user) {
				that.userData.user = result.data.data.user;
				if (result.data.data.user && result.data.data.user.voucherToken) {
					that.countdownTimer.voucherRequested = true;
				}
				if (parseInt(result.data.data.user.purchased_product_id, 10)) {
					that.stopEvent();
				}
			}
			return that.digestResult(result);
		});
	};
	this.logout = function() {
		var that = this;
		return $http.get('/logout').then(function(result) {
			that.userData.user = {};
			return that.digestResult(result);
		});
	};
	this.register = function(data) {
		var that = this;
		return $http.post('/sign-up', data).then(function(result) {
			return that.digestResult(result);
		});
	};
	this.updateProfile = function(data) {
		var that = this;
		return $http.post('/update-profile', data).then(function(result) {
			return that.digestResult(result);
		});
	};
	this.passwordRecovery = function(data) {
		var that = this;
		return $http.post('/password-recovery', data).then(function(result) {
			return that.digestResult(result);
		});
	};
	this.activateAccount = function(token) {
		var that = this;
		return $http.post('/activate-account/' + token).then(function(result) {
			return that.digestResult(result);
		});
	};

	this.startCountdownTimer = function() {
		var that = this;
		this.countdownTimer.time.days = '00';
		this.countdownTimer.time.hours = '00';
		this.countdownTimer.time.minutes = '00';
		this.countdownTimer.time.seconds = '00';
		this.countdown = function(eventStartTime, callback) {
			var eventStartTime = moment(eventStartTime);
			that.countdownTimerHandle = $timeout(function tick() {
				var delta = moment.duration(eventStartTime.diff(moment()));
				if (delta < 0) {
					$timeout.cancel(that.countdownTimerHandle);
					if (typeof callback === 'function') {
						that.countdownTimer.stage = 2;
						callback();
					}
					return;
				}
				//that.countdownTimer.time.months = ('00' + delta.months()).slice(-2);
				//that.countdownTimer.time.days = ('00' + delta.days()).slice(-2);
				that.countdownTimer.time.months = '00';
				that.countdownTimer.time.days = ('00' + (delta.days() + delta.months() * 30)).slice(-2);
				that.countdownTimer.time.hours = ('00' + delta.hours()).slice(-2);
				that.countdownTimer.time.minutes = ('00' + delta.minutes()).slice(-2);
				that.countdownTimer.time.seconds = ('00' + delta.seconds()).slice(-2);
				that.countdownTimer.stage = 0;
				if (delta.asHours() < 2) {
					that.countdownTimer.stage = 1;
					if (!that.countdownTimer.voucherRequested && that.userData.user.id) {
						that.countdownTimer.voucherRequested = true;
						var rvtimeout = Math.floor(Math.random() * 3600 * 1000);
						$timeout(function() {
							that.requestVoucher();
						}, rvtimeout);
					}
				}
				that.countdownTimerHandle = $timeout(tick, 100);
			}, 100);
		};

		if (!this.countdownTimerHandle && !that.eventRunning()) {
			//var eventStartTime = new Date(this.data.eventStartTime);
			this.countdown(this.appData.data.eventStartTime, function() {
				that.stopTrainingTimer();
				that.getTimer($state, $timeout);
				that.startEvent();
				$state.go('event');
			});
		}
	};
	this.getCountdownTimer = function() {
		return this.countdownTimer;
	};
	this.getTimer = function($state, $timeout) {
		var that = this;
		var seconds = 0;
		this.timer = {
			event: false
		};
		this.timer.seconds = '00';
		this.timer.durationSeconds = that.eventDuration;
		this.shoppingTimer = function(eventStartTime, callback) {
			that.timerHandle = $timeout(function tick() {
				var delta = eventStartTime - moment().utc().valueOf();
				if (delta <= 0) {
					that.timer.running = false;
					$timeout.cancel(that.timerHandle);
					that.timerHandle = null;
					if (typeof callback === 'function') {
						callback();
					}
					return;
				}
				seconds = Math.round(delta / 1000);
				that.timer.stage = Math.floor((that.eventDuration - seconds) / 7);
				that.timer.seconds = ('0' + seconds).slice(-2);
				that.timer.year = 1984 + (that.eventDuration - seconds);

				that.timerHandle = $timeout(tick, 100);
			}, 100);
		};

		if (!that.timerHandle) {
			$timeout.cancel(that.timerHandle);
			that.timer.running = true;
			var endTime = moment().utc().valueOf();
			if (that.eventActive) {
				endTime += (that.eventDuration * 1000);
				if (that.appData.data.event.startsInMilliseconds < 0) {
					endTime += that.appData.data.event.startsInMilliseconds;
				}
			} else {
				endTime += that.eventDuration * 1000;
			}
			this.shoppingTimer(endTime, function() {
				that.timer.running = false;
				if (that.eventActive && that.userCanParticipate()) {
					that.eventFailed = true;
					$state.go('public.lose');
				} else if (!that.eventActive) {
					that.trainingFailed = true;
					$state.go('training.lose');
				}
				that.stopEvent();
			});
			//this.logTraining();
		}
		return this.timer;
	};
	this.stopTrainingTimer = function() {
		$timeout.cancel(this.timerHandle);
		this.timerHandle = null;
	};
	this.setAvailableProducts = function(available) {
		var inCategory = [];
		for (var aic = 0; aic < available.length; aic++) {
			if (aic % 2 === 0 && parseInt(available[aic + 1], 10) > 0) {
				inCategory.push(available[aic]);
			}
		}
		var availableIds = [];
		var incat = $.map(inCategory, function(value, index) {
			return [value];
		});
		incat.sort(function() {
			return 0.5 - Math.random();
		});
		availableIds = incat.slice(0, 3);
		this.appData.data.available = [];
		for (var k in availableIds) {
			var ids = availableIds[k].split('-');
			this.appData.data.available.push(this.productData.data.products[ids[0]]);
		}
	};


	this.digestResult = function(result) {
		//var deferred = $q.defer();
		if (!result.data) {
			result.data = {};
		}
		if (result.data && result.data.data && result.data.data.errors) {
			this.errors = {};
			angular.extend(this.errors, this.parseErrors(result.data.data.errors));
		}
		//return deferred.promise;
		return result.data;
	};
	this.parseErrors = function(errors) {
		var outErrors = {};
		for (var i in errors) {
			this.setErrorFromKey(i, errors[i], outErrors);
		}
		return outErrors;
	};
	this.getErrors = function() {
		return this.errors;
	};
	this.setErrorFromKey = function(key, error, errors) {
		// left of the = is the key path
		var keyPath = key;
		// right of the = is the value to set
		var value = error;
		// split keyPath into an array of keys
		var keys = keyPath.split('.');
		var key; // used in loop
		// the current level of object we are drilling into.
		// Starts as the main root config object.
		var currentObj = errors;
		// Loop through all keys in the key path, except the last one (note the -1).
		// This creates the object structure implied by the key path.
		// We want to do something different on the last iteration.
		for (var i = 0; i < keys.length - 1; i++) {
			// Get the current key we are looping
			key = keys[i];
			// If the requested level on the current object doesn't exist,
			// make a blank object.
			if (typeof currentObj[key] === 'undefined') {
				currentObj[key] = {};
			}
			// Set the current object to the next level of the keypath,
			// allowing us to drill in.
			currentObj = currentObj[key];
		}
		// Our loop doesn't handle the last key, because that's when we
		// want to set the actual value. So find the last key in the path.
		var lastKey = keys[keys.length - 1];
		// Set the property of the deepest object to the value.
		currentObj[lastKey] = value;
	};



	this.buildCategoryTree = function(categories) {
		var catTree = {};
		var map = {};
		for (var i in categories) {
			categories[i].children = {};
			map[i] = categories[i];
			if (!categories[i].parent_id || parseInt(categories[i].parent_id, 10) === 0) {
				catTree[i] = categories[i];
			} else {
				categories[categories[i].parent_id].children[categories[i].id] = categories[i];
			}
		}

		this.index = 0;
		for (var i in catTree) {
			this.index++;
			this.lrLabelWalk(catTree[i]);
		}
		return catTree;
	};
	this.lrLabelWalk = function(root) {
		//if(!left) left = root.id;
		root.lft = this.index;
		for (var i in root.children) {
			this.lrLabelWalk(root.children[i], ++this.index);
		}
		root.rght = this.index;
	};
	this.getCategoriesStates = function(categories) {
		var catTree = this.buildCategoryTree(categories);
		var states = {};
		this.buildStates(catTree, states, 'product');
		return states;
	};


	this.setFlash = function(message) {
		var that = this;
		var key = that.flashData.flashCnt++;
		that.flashData.flashes[key] = message;
		$timeout(function() {
			delete that.flashData.flashes[key];
		}, 5000);
	};


	this.setCategoryFilter = function(id) {
		var that = this;
		this.filterData.filter.categoryId = id;
		if (this.productData.data.categories) {
			this.filterData.filter.category = this.productData.data.categories[this.filterData.filter.categoryId];
			this.filterData.filter.categories = [];
			angular.forEach(this.productData.data.categories, function(item, key) {
				if (item.lft >= that.filterData.filter.category.lft && item.rght <= that.filterData.filter.category.rght) {
					that.filterData.filter.categories.push(item.id);
				}
			});
			this.filterData.filter.breadcrumbs = categoryService.generateBreadcrumbs(this.filterData.filter.categoryId, this.productData.data.categories);
		}
	};
	this.setProductFilter = function(id) {
		this.filterData.filter.productId = id;
		if (this.productData.data.products) {
			this.filterData.filter.product = this.productData.data.products[this.filterData.filter.productId];
			this.setCategoryFilter(this.filterData.filter.product.category_id);
			// merge cat sizes with product sizes
			if (!this.filterData.filter.product.tcsizesGenerated) {
				var tcsizes = [];
				var in_sizes = null;
				var skey = 'product_sizes_' + (this.filterData.filter.product.display_sizes === '2' ? '2' : '1');

				if (this.eventActive) {
					for (var i in this.filterData.filter.category[skey]) {
						var val = this.filterData.filter.category[skey][i];
						in_sizes = null;
						for (var j in this.filterData.filter.product.sizes) {
							if (val.toLowerCase() === this.filterData.filter.product.sizes[j].value.toLowerCase() || val.toLowerCase() === this.filterData.filter.product.sizes[j].label.toLowerCase()) {
								in_sizes = this.filterData.filter.product.sizes[j];
								in_sizes.quantity = 1;
							}
						}
						if (in_sizes) {
							tcsizes.push(in_sizes);
						} else {
							tcsizes.push({
								id: '',
								quantity: 0,
								value: val,
								label: val
							});
						}
					}
				} else {
					for (var i in this.filterData.filter.category[skey]) {
						var val = this.filterData.filter.category[skey][i];
						tcsizes.push({
							id: i,
							quantity: (Math.random() > 0.5 ? 1 : 0),
							value: val,
							label: val
						});
					}
				}
				this.filterData.filter.product.sizes = tcsizes;
				this.filterData.filter.product.tcsizesGenerated = true;
			}

//			var this.filterData.filter.category.product_sizes;
//			this.filterData.filter.product

		}
	};
	this.getFilter = function() {
		return this.filterData;
	};
});


eshop.factory('categoryService', function() {
	return {
		buildCategoryTree: function(categories) {
			var catTree = {};
			var map = {};
			for (var i in categories) {
				categories[i].children = {};
				map[i] = categories[i];
				if (!categories[i].parent_id) {
					catTree[i] = categories[i];
				} else {
					categories[categories[i].parent_id].children[categories[i].id] = categories[i];
				}
			}

			this.index = 0;
			for (var i in catTree) {
				this.index++;
				this.lrLabelWalk(catTree[i]);
			}
			return catTree;
		},
		lrLabelWalk: function(root) {
			//if(!left) left = root.id;
			root.lft = this.index;
			for (var i in root.children) {
				this.lrLabelWalk(root.children[i], ++this.index);
			}
			root.rght = this.index;
		},
		getCategoriesStates: function(categories) {
			var catTree = this.buildCategoryTree(categories);
			var states = {};
			this.buildStates(catTree, states, 'product');
			return states;
		},
		buildStates: function(subtree, states, path) {
			for (var i in subtree) {
				var newpath = path + (path ? '.' : '') + subtree[i].name;
				states[subtree[i].id] = {
					name: newpath,
					parent: states[subtree[i].parent_id], //mandatory
					templateUrl: 'product-list.html'
				};

				this.buildStates(subtree[i].children, states, newpath);
			}
		},
		generateBreadcrumbs: function(categoryId, categories) {
			var crumbs = [];
			var ccid = categoryId;
			while (categories[ccid].parent_id && parseInt(categories[ccid].parent_id, 10) !== 0) {
				crumbs.unshift(categories[categories[ccid].parent_id]);
				ccid = categories[ccid].parent_id;
			}
			return crumbs;
		}
	};
});

eshop.factory('$FB', ['$rootScope', function($rootScope) {

		var fbLoaded = false;

		// Our own customisations
		var _fb = {
			loaded: fbLoaded,
			_init: function(params) {
				if (window.FB) {
					// FIXME: Ugly hack to maintain both window.FB
					// and our AngularJS-wrapped $FB with our customisations
					angular.extend(window.FB, _fb);
					angular.extend(_fb, window.FB);

					// Set the flag
					_fb.loaded = true;

					// Initialise FB SDK
					window.FB.init(params);

					if (!$rootScope.$$phase) {
						$rootScope.$apply();
					}
				}
			}
		};

		return _fb;
	}]);
	