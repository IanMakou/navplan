/**
 * Map Controller
 */

navplanApp
	.controller('mapCtrl', [ '$scope', 'mapService', 'locationService', 'geonameService', 'globalData', mapCtrl ]);


function mapCtrl($scope, mapService, locationService, geonameService, globalData) {
	$scope.globalData = globalData;
	$scope.showPlanes = false;

	
	$scope.focusSearchWpInput = function()
	{
		document.getElementById('searchWpInput').focus();
	};
	

	$scope.searchGeonamesByValue = function(search)
	{
		return geonameService.searchGeonamesByValue(search, $scope.globalData.user.email, $scope.globalData.user.token);
	};

	
	// select geopoint from search 
	$scope.onGeonameSelect = function ($item)
	{
		$scope.globalData.navplan.selectedWaypoint = {
			type: $item.type,
			freq: $item.frequency,
			callsign: $item.callsign,
			checkpoint: $item.wpname,
			latitude: $item.latitude,
			longitude: $item.longitude
		};

		mapService.setMapPosition($item.latitude, $item.longitude, 12);
		mapService.drawGeopointSelection([ $item ], [0, 0]);
	};
	
	
	// adding geopoint from search with (+) sign 
	$scope.onGeonameSearch = function()
	{
		/*
		var wp = {
			type: $scope.globalData.navplan.selectedWaypoint.type,
			freq: $scope.globalData.navplan.selectedWaypoint.freq,
			callsign: $scope.globalData.navplan.selectedWaypoint.callsign,
			checkpoint: $scope.globalData.navplan.selectedWaypoint.checkpoint,
			latitude: $scope.globalData.navplan.selectedWaypoint.latitude,
			longitude: $scope.globalData.navplan.selectedWaypoint.longitude,
			mt: '',
			dist: '',
			alt: '',
			remark: ''
		};
			
		$scope.addWaypoint(wp);
		
		$scope.globalData.navplan.selectedWaypoint = undefined;*/
	};

	
	$scope.onMapClicked = function(event, clickCoordinates, maxRadius)
	{
		geonameService.searchGeonamesByPosition(clickCoordinates[1], clickCoordinates[0], maxRadius, $scope.globalData.user.email, $scope.globalData.user.token)
			.success(function(data) {
				if (data.geonames)
				{
					mapService.hideFeaturePopup();
					mapService.drawGeopointSelection(data.geonames, event.pixel);
				}
				else
					console.error("ERROR", data);
			})
			.error(function(data, status) {
				console.error("ERROR", status, data);
			});
	};
	
	
	$scope.onFeatureSelected = function(event, feature)
	{
		if (feature.geopoint)
		{
			$scope.globalData.selectedWp = {
				type: feature.geopoint.type,
				geopoint: feature.geopoint,
				id: feature.geopoint.id,
				freq: feature.geopoint.frequency,
				callsign: feature.geopoint.callsign,
				checkpoint: feature.geopoint.wpname,
				latitude: feature.geopoint.latitude,
				longitude: feature.geopoint.longitude,
				mt: '',
				dist: '',
				alt: '',
				remark: '',
				isNew: true
			};
			$scope.$apply();

			mapService.showFeaturePopup($scope.globalData.selectedWp.latitude, $scope.globalData.selectedWp.longitude);
		}
		else if (feature.airport)
		{
			$scope.globalData.selectedWp = {
				type: 'airport',
				airport: feature.airport,
				freq: feature.airport.frequency,
				callsign: feature.airport.callsign,
				checkpoint: feature.airport.icao,
				latitude: feature.airport.latitude,
				longitude: feature.airport.longitude,
				mt: '',
				dist: '',
				alt: '',
				remark: '',
				isNew: true
			};
			$scope.$apply();
				
			mapService.showFeaturePopup($scope.globalData.selectedWp.latitude, $scope.globalData.selectedWp.longitude);
		}
		else if (feature.navaid)
		{
			$scope.globalData.selectedWp = {
				type: 'navaid',
				navaid: feature.navaid,
				freq: feature.navaid.frequency,
				callsign: feature.navaid.kuerzel,
				checkpoint: feature.navaid.kuerzel + ' ' + feature.navaid.type,
				latitude: feature.navaid.latitude,
				longitude: feature.navaid.longitude,
				mt: '',
				dist: '',
				alt: '',
				remark: '',
				isNew: true
			};
			$scope.$apply();
				
			mapService.showFeaturePopup($scope.globalData.selectedWp.latitude, $scope.globalData.selectedWp.longitude);
		}
		else if (feature.globalWaypoint)
		{
			$scope.globalData.selectedWp = {
				type: 'global',
				globalWaypoint: feature.globalWaypoint,
				freq: '',
				callsign: '',
				checkpoint: feature.globalWaypoint.name,
				latitude: feature.globalWaypoint.latitude,
				longitude: feature.globalWaypoint.longitude,
				mt: '',
				dist: '',
				alt: '',
				remark: feature.globalWaypoint.remark,
				isNew: true
			};
			$scope.$apply();
				
			mapService.showFeaturePopup($scope.globalData.selectedWp.latitude, $scope.globalData.selectedWp.longitude);
		}
		else if (feature.userWaypoint)
		{
			$scope.globalData.selectedWp = {
				type: 'user',
				userWaypoint: feature.userWaypoint,
				id: feature.userWaypoint.id,
				freq: '',
				callsign: '',
				checkpoint: feature.userWaypoint.name,
				latitude: feature.userWaypoint.latitude,
				longitude: feature.userWaypoint.longitude,
				mt: '',
				dist: '',
				alt: '',
				remark: feature.userWaypoint.remark,
				isNew: true
			};
			$scope.$apply();
				
			mapService.showFeaturePopup($scope.globalData.selectedWp.latitude, $scope.globalData.selectedWp.longitude);
		}
		else if (feature.waypoint)
		{
			$scope.globalData.selectedWp = feature.waypoint;
			$scope.$apply();
			
			mapService.showFeaturePopup($scope.globalData.selectedWp.latitude, $scope.globalData.selectedWp.longitude);
		}
	};
	
	
	$scope.onMapMoveEnd = function(event)
	{
		var view = event.map.getView();
		
		$scope.globalData.currentMapPos = {
			center: view.getCenter(),
			zoom: view.getZoom()
		}
	};
	
	
	$scope.onAddSelectedWaypointClicked = function()
	{
		$scope.globalData.selectedWp.isNew = false;
		$scope.addWaypoint($scope.globalData.selectedWp);
		$scope.globalData.selectedWp = undefined;

		mapService.hideFeaturePopup();
	};
	

	$scope.onSetAsAlternateClicked = function()
	{
		$scope.globalData.selectedWp.isNew = false;
		$scope.setAlternate($scope.globalData.selectedWp);
		$scope.globalData.selectedWp = undefined;

		mapService.hideFeaturePopup();
	};
	

	
	$scope.onRemoveSelectedWaypointClicked = function()
	{
		if ($scope.globalData.selectedWp == $scope.globalData.navplan.alternate)
			$scope.globalData.navplan.alternate = undefined;
		else
			removeFromArray($scope.globalData.navplan.waypoints, $scope.globalData.selectedWp);
			
		$scope.globalData.selectedWp = undefined;
		$scope.updateWpList();

		mapService.hideFeaturePopup();
	};
	

	$scope.onEditSelectedWaypointClicked = function()
	{
		$scope.editSelectedWaypoint();
	};


	$scope.onEditUserWaypointClicked = function()
	{
		$scope.editUserWaypoint();
	};
	
	
	$scope.addWaypoint = function(newWp)
	{
		var wps = $scope.globalData.navplan.waypoints;
		var numWp = wps.length;
		
		// skip if same coordinates as last waypoint
		if (numWp > 1 && wps[numWp - 1].latitude == newWp.latitude && wps[numWp - 1].longitude == newWp.longitude)				
			return;
			
		$scope.globalData.navplan.waypoints.push(newWp);
		
		$scope.updateWpList();
	};
	
	
	$scope.setAlternate = function(altWp)
	{
		$scope.globalData.navplan.alternate = altWp;
		
		$scope.updateWpList();
	};
	
	
	$scope.onDisplayChartClicked = function(chartId)
	{
		mapService.displayChart(chartId);
		mapService.hideFeaturePopup();
	};


	$scope.onKmlClicked = function()
	{
		var navplanData = {
			waypoints: $scope.globalData.navplan.waypoints
		};
	
		var kmlLink = document.getElementById("dlKmlLink");
		kmlLink.href = 'php/navplanKml.php?data=' + encodeURIComponent(JSON.stringify(navplanData))
	};


	$scope.onTogglePlanesClicked = function() {
		$scope.showPlanes = !$scope.showPlanes;

		if ($scope.showPlanes) {
			locationService.startWatching();
			mapService.highightPlaneControl(true);
		}
		else
		{
			locationService.stopWatching();
			mapService.highightPlaneControl(false);
		}
	};

	$scope.onLocationChanged = function(lastPositions) {
		var lastPos = lastPositions[lastPositions.length - 1];

		mapService.drawPlaneTrack(lastPositions);
		mapService.setMapPosition(lastPos.latitude, lastPos.longitude);
	};


	// init feature popup
	var featureContainer = document.getElementById('feature-popup');
	var featureContent = document.getElementById('feature-popup-content');
	var featureCloser = document.getElementById('feature-popup-closer');

	// init mapservice
	mapService.init($scope.onMapClicked, $scope.onFeatureSelected, $scope.onMapMoveEnd, $scope.onKmlClicked, $scope.onTogglePlanesClicked, $scope.globalData.currentMapPos, featureContainer, $scope.globalData.user.email, $scope.globalData.user.token);

	// init locationservice
	locationService.init($scope.onLocationChanged);

	featureCloser.onclick = function() {
		mapService.hideFeaturePopup();
		featureCloser.blur();
		return false;
	};
	
	$scope.updateWpList();
}
