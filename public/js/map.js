mapboxgl.accessToken = mapTocken;

const map = new mapboxgl.Map({
	container: "map", // container ID
	center: [77.216721, 28.6448], // starting position [lng, lat]. Note that lat must be set between -90 and 90
	zoom: 9, // starting zoom
});
