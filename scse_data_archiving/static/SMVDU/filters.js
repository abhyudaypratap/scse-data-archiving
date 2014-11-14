eshop.filter('objectToArray', function() {
	return function(items) {
		var filtered = [];
		angular.forEach(items, function(item) {
			filtered.push(item);
		});
		return filtered;
	};
});

//eshop.filter('filterByCategory', function() {
//	return function(items, catId) {
//		var filtered = {};
//		angular.forEach(items, function(item, key) {
//			if (item.category_id == catId) {
//				filtered[key] = item;
//			}
//		});
//		return filtered;
//	};
//});
eshop.filter('filterByCategory', function() {
	return function(items, cats) {
		var filtered = {};
		if(!cats || !cats.length) return filtered;
		//console.log('called');
		angular.forEach(items, function(item, key) {
			//if (item.category_id === cats.id || item.category_id >= cats.lft && item.category_id <= cats.rght) {
			if (cats.indexOf(item.category_id) !== -1) {
				filtered[key] = item;
			}
		});
		return filtered;
	};
});

eshop.filter('nl2br', function() {
	return function(text) {
		//console.log('called nlbr');
		if (text) {
			return text.replace(/\n/g, '<br/>');
		} else {
			return '';
		}
	};
});

eshop.filter('to_trusted', ['$sce', function($sce) {
		return function(text) {
			if (text) {
				return $sce.trustAsHtml(text);
			} else {
				return '';
			}
		};
	}]);

eshop.filter('slice', function() {
	return function(arr, start, end) {
		return arr.slice(start, end);
	};
});

eshop.filter('elemOnIndex', function() {
	return function(arr, i) {
		if (arr[i]) {
			return arr[i];
		} else {
			return '';
		}
	};
});
eshop.filter('getProperty', function() {
	return function(object, prop) {
		if (object[prop]) {
			return object[prop];
		} else {
			return object;
		}
	};
});

eshop.filter('capitalize', function() {
 return function(input, scope) {
 if (input!=null)
 input = input.toLowerCase();
 return input.substring(0,1).toUpperCase()+input.substring(1);
 }
});