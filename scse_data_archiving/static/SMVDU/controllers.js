eshop.controller('EshopController', function($rootScope, $scope, $state, $stateParams, dataService, categoryService, $timeout) {
	dataService.getData().then(function() {
		$scope.appData = dataService.appData;
	});
	$scope.filterData = dataService.getFilter();
	$scope.resultData = dataService.getResultData();

	$scope.routingData = dataService.getRoutingData();

	$scope.countdownTimer = dataService.getCountdownTimer();

	if (!$rootScope.trainingTimer) {
		$rootScope.trainingTimer = {};
	}
	if ($state.current.data && $state.current.data.startCountdown) {
		$rootScope.timer = dataService.getTimer($state, $timeout);
	}
	if ($state.current.data && $state.current.data.stopCountdown && !dataService.eventRunning()) {
		dataService.stopTrainingTimer();
	}


});
eshop.controller('ProductsController', function($rootScope, $scope, $state, $stateParams, dataService, categoryService, $timeout) {
	$scope.productData = dataService.getProductData();
	$scope.routingData = dataService.getRoutingData();

	$scope.filter = {};
	$scope.filterData = dataService.getFilter();

	if ($state.params.categoryId) {
		dataService.setCategoryFilter($state.params.categoryId);
	}
	if ($state.params.productId) {
		dataService.setProductFilter($state.params.productId);
	}

	$scope.checkout = function(eventCode, productId, sizeId) {
		
		if (!productId || !sizeId) {
			dataService.setFlash(dataService.appData.data.messages.SPECIFY_PRODUCT);
			return;
		}
		

		if (!dataService.eventActive) {
			dataService.setResultTime();
			dataService.setResultProduct();
			dataService.itemWon = true;
			$state.go('training.success');
		} else {
			if(!$rootScope.checkoutInProgress) {
				$rootScope.checkoutInProgress = true;
				dataService.checkout(eventCode.toLowerCase(), productId, sizeId).then(function(response) {
					$rootScope.checkoutInProgress = false;
					if(response && response.data) {
						if (response.data.code === 0) {
							dataService.setResultTime();
							dataService.setResultProduct();
							$rootScope.timer.running = false;
							dataService.contestWon = true;
							dataService.stopEvent();
							$state.go('public.success');
						} else if (response.data.code === 3) {
							//dataService.setAvailableProducts(response.data.available);
							$state.go('event.detail.related');
						} else if (response.data.code === 4) {
							dataService.contestFailed = true;
							$state.go('public.lose');
						} else {
							$state.go('event.detail.related');
						}
					} else {
						$state.go('event.detail.related');
					}
				});
			}
		}
	};

	$scope.changeImage = function(image) {
		$scope.activeImage = image;
	};
});
eshop.controller('UsersController', function($rootScope, $scope, $state, $timeout, $stateParams, dataService) {

	$scope.errors = {};
	$scope.userData = dataService.getUser();
	$scope.loginData = dataService.getLoginData();
	dataService.getData().then(function() {
		$scope.appData = dataService.appData;
	});



	if ($state.params.recoveryToken) {
		var token = $state.params.recoveryToken;
		if (!$scope.userData.user) {
			$scope.userData.user = {};
		}
		$scope.userData.user.recoveryToken = token;
	}

	$scope.login = function() {
		$scope.loginForm.$submitted = true;
		if ($scope.loginForm.$valid) {
			dataService.login($scope.loginData).then(function(response) {
				$scope.loginForm.$submitted = false;
				dataService.setFlash(response.data.message);
				if (response.data.code === 0) {
					$scope.loginData.user = {};
				}
				if(dataService.eventRunning()) {
					$state.go('event.category-select');
				} else {
					$state.go('public.landing');
				}
			});
		}
	};
	$scope.logout = function() {
		dataService.logout().then(function(response) {
			dataService.setFlash(response.data.message);
			$state.go('public.landing');
		});
	};
	$scope.register = function() {
		$scope.registerForm.$submitted = true;
		if ($scope.registerForm.$valid) {
			dataService.register($scope.userData).then(function(response) {
				dataService.setFlash(response.data.message);
				$scope.errors = dataService.getErrors();
				if (response.data.code === 0) {
					$scope.userData.user = {};
					$state.go('public.user.register-success');
				} else {

				}
			});
		}
	};
	$scope.updateProfile = function() {
		$scope.registerForm.$submitted = true;
		if ($scope.registerForm.$valid) {
			dataService.updateProfile($scope.userData).then(function(response) {
				dataService.setFlash(response.data.message);
				//setFlash($rootScope, $timeout, response.data.message);
				$scope.errors = dataService.getErrors();
				delete $scope.userData.user.password;
				delete $scope.userData.user.passwordConfirm;
				if (response.data.code === 0) {
					//$state.go('landing.register-success');
				} else {

				}
			});
		}
	};
	$scope.passwordRecovery = function() {
		if ($scope.passwordRecoveryForm.$valid) {
			dataService.passwordRecovery($scope.userData).then(function(response) {
				//delete $scope.userData.user.recoveryToken;
				if (response.status === "error") {
					dataService.setFlash(response.message);
				} else {
					dataService.setFlash(response.data.message);
					if (response.data.code === 0) {
						$state.go('public.landing');
					} else if (response.data.code === 10) {
						$state.go('public.landing');
					} else {
						//$state.go('public.user.forgotten-password');
					}
				}
			});
		}
	};

});
