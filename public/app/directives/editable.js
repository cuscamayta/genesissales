app.directive('scrollable', ['$window',
	function ($window) {
		return {
			restrict: 'A',

			link: function (scope, element, attrs) {

				var newSize = function () {
					var valor = $('body').height() - (parseInt($(element).offset().top) + $('#footer').height());
					return valor + 15;
				};

				executeResizeWithTime(200);

				function executeResizeWithTime(time) {
					setTimeout(function () {
						$(element).height(newSize());
					}, time);
				}

			}
		};
	}
]);


app.directive('editInPlace', function ($timeout) {
	return {
		restrict: 'E',
		scope: {
			value: '=',
			model: '=',
			blurEvent: '&blurEvent'
		},
		template: '<span  data-ng-bind="value" data-ng-click="editInput()" data-ng-show="!editMode"></span><input data-ng-model="value" ng-enter="editMode=false" style="width:60px;height: 20px;" data-ng-show="editMode"></input>',
		link: function ($scope, element, attrs) {
			var input = element.find('input');

			var blurEventHandler = $scope.blurEvent();

			$scope.editInput = function () {
				$scope.modelBeforeEdit = angular.copy($scope.model);
				$scope.editMode = true;
				$timeout(function () {
					$(input).focus().select();
				}, 0, false);
			};

			input.bind('blur', function () {
				$scope.$apply(function () {
					$scope.editMode = false;
					blurEventHandler($scope.value, $scope.model, $scope.modelBeforeEdit);
				});
			});


		}
	};
});


app.directive('cellEditable', ["$timeout", "$rootScope",
	function ($timeout, $rootScope) {
		return {
			restrict: 'E',
			template: ' <span  ng-hide="editMode" ng-click="onModeEdit()" style="float:left;">{{model}}</span>' +
			'<input id="{{index}}" onfocus="this.select();" type="text" class="testing" style="width:40px !important; maxlength=10;" ng-model="model" ' +
			'ng-show="editMode"  ng-blur="onModeEdit()" />',
			scope: {
				model: '=',
				mask: '=',
				fixed: '=',
				typecell: '=',
				data: '=',
				index: '=',
				icon: '@',
				iconEvent: '&',
				changed: '=',
				row: '@'
			},
			link: function (scope, element, attr) {

				var tdElement = element.parent(),
					tdStyle = $(tdElement).attr('class');
				var isFirstEdition = true;
				//scope.model1 = scope.model ? scope.model : 0;// || 0;      
				// scope.mask = scope.mask  || scope.model;

				$(element).find('input').blur(function (e) {
					scope.editMode = false;
					scope.$apply();
				})

				$(element).find('input').focus(function (e) {
					$(this).select();
				})

				scope.onModeEdit = function () {
					scope.editMode = true;
					setTimeout(function () {
						$(element).find('input').focus();
					}, 500);


					// scope.row = scope.$eval(attr.row);
					// scope.changed = attr.changed;
					// scope.typecell = attr.typecell;
					// scope.editMode = scope.fixed;
					// scope.lastValue = angular.copy(scope.model);
					// scope.originalValue = isFirstEdition ? angular.copy(scope.model) : scope.originalValue;
					// scope.value = scope.model;
					// scope.ngmodel = scope.data;
					// $(element).val(scope.value);
					// scope.environment = $(element).closest('table').attr('guid') ? $(element).closest('table').attr('guid') : '';
					// $(tdElement).find('.icon').remove();
					// $(element).children('input').css('margin-bottom', '0');
					// $(element).children('input').css('padding', '2');
					// $(element).children('input').css('text-align', 'right');

					// isFirstEdition = false;
					// //scope.$apply();

					// $(element).children('input').select();
				};

				$(element).children('input').on().keyup(function () {
					this.value = this.value.replace(/[^0-9\.]/g, '');
				});

				if (scope.fixed)
					$(tdElement).hover(function () {
						if (!scope.editMode)
							if (!scope.icon) scope.icon = 'icon-pencil';

						if (!scope.editMode)
							$(tdElement).css({
								'cursor': 'pointer'
							});

						onIconClick = function () {
							scope.iconEvent({ scope: scope, value: scope.originalValue, element: element });
							scope.onModeEdit();
						};
					}, function () {
						$(tdElement).find('.icon').remove();
					});
			}
		};
	}]);

app.directive('selectOnClick', ['$window', function ($window) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.on('click', function () {
				if (!$window.getSelection().toString()) {
					// Required for mobile Safari
					this.setSelectionRange(0, this.value.length)
				}
			});
		}
	};
}]);