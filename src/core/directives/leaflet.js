angular.module("leaflet-ng-core").directive('leaflet', ['$q', 'leafletData', function ($q, leafletData) {
    return {
        restrict: "EA",
        replace: true,
        scope: {
            lfDefaults: '=',
            lfLayers: '=',
            lfCenter: '=',
            lfMarkers: '=',
            lfBounds: '=',
            lfEvents: '='
        },
        transclude: true,
        template: '<div class="angular-leaflet-map"><div ng-transclude></div></div>',
        controller: function ($scope) {
            this._leafletMap = $q.defer();
            this.getMap = function () {
                return this._leafletMap.promise;
            };

            this.getScope = function () {
                return $scope;
            };
        },
        link: function (scope, element, attrs, ctrl) {

            // Create the Leaflet Map Object with the options
            var map = new L.Map(element[0], scope.lfDefaults);
            leafletData.set('map', map, attrs.id);
            ctrl._leafletMap.resolve(map);

            // Resolve the map object to the promises
            map.whenReady(function () {
                console.log('map ready');
                leafletData.set('map', map, attrs.id);

                // add events
                angular.forEach(scope.lfEvents, function (f, event) {
                    console.log(event);
                    map.on(event, f);
                })

            });

            scope.$on('$destroy', function () {
                map.remove();
                leafletData.destroy(attrs.id);
            });
        }
    }
}]);
