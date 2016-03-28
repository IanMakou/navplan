/**
 * Traffix Service
 */

navplanApp
	.factory('trafficService', trafficService);

trafficService.$inject = ['$http'];

function trafficService($http)
{
	// return api reference
	return {
		readTraffic: readTraffic,
		readCallSign: readCallSign
	};


	function readTraffic(extent, maxagesec)
	{
		return $http.post('php/ogntraffic.php', obj2json({ action: 'read', minlon: extent[0], minlat: extent[1], maxlon: extent[2], maxlat: extent[3], maxagesec: maxagesec }));
	}
	
	
	function readCallSign(icaoCode)
	{
		return $http.get('php/lfr_ch.php?icaohex=' + icaoCode);
	}
}