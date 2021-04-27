function initMap() {
    const API_Key = 'b8a21f2fb9d4446f8a2ab5396c651de7';
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var location = {
        lat: 19.997454,
        lng: 73.789803
    }
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: location
    });
    directionsRenderer.setMap(map);

    var origin, destination, originMarked, destinationMarked;
    originMarked = destinationMarked = false;
    google.maps.event.addListener(map, 'click', (e) => {
        if (!origin || !destination) {
            addMarker(e.latLng);
            if (!origin) {
                origin = e.latLng;
                var url = `${proxy}https://api.opencagedata.com/geocode/v1/json?q=${e.latLng.lat}+${e.latLng.lng}&key=${API_Key}`
                fetch(url)
                    .then(res => res.json())
                    .then(res => {
                        document.getElementById('origin').value = res.results.components.city;
                    })
                originMarked = true;
            } else if (!destination) {
                destination = e.latLng;
                var url = `${proxy}https://api.opencagedata.com/geocode/v1/json?q=${e.latLng.lat}+${e.latLng.lng}&key=${API_Key}`
                fetch(url)
                    .then(res => res.json())
                    .then(res => {
                        document.getElementById('destination').value = res.results.components.city;
                    })
                destinationMarked = true;
            }
        }
    })

    function addMarker(coords) {
        const marker = new google.maps.Marker({
            position: coords,
            map: map,
        });
    }

    document.getElementById('find-route').addEventListener('click', (e) => {
        var originLocation = document.getElementById('origin').value;
        var destinationLocation = document.getElementById('destination').value;
        origin = originLocation;
        destination = destinationLocation;
        if (!origin || !destination) alert('Please enter Origin and Destination')
        else {
            if (!originMarked || !destinationMarked) {
                var coords = {};
                var url = `${proxy}https://api.opencagedata.com/geocode/v1/json?q=${originLocation}&key=${API_Key}`
                fetch(url)
                    .then(res => res.json())
                    .then(res => {
                        coords.lat = res.results[0].geometry.lat;
                        coords.lng = res.results[0].geometry.lng;
                        addMarker(coords);
                    })
                url = `${proxy}https://api.opencagedata.com/geocode/v1/json?q=${destinationLocation}&key=${API_Key}`
                fetch(url)
                    .then(res => {
                        coords.lat = res.results[0].geometry.lat;
                        coords.lng = res.results[0].geometry.lng;
                        addMarker(coords);
                    })
            }
            calcRoute();
        }
    })

    function calcRoute() {
        var request = {
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
        };
        directionsService.route(request, function (response, status) {
            if (status == 'OK') {
                directionsRenderer.setDirections(response);
            }
        });
    }

    document.getElementById('go').addEventListener('click', (e) => {
        var speed = document.getElementById('speed').value
        var elevation = document.getElementById('elevation').value
        startJourney(speed, elevation)
    })
}