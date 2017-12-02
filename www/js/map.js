var map;
var infowindow;

function getMapLocation() {
    var gpsOptions = {maximumAge: 300000, timeout: 5000, enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition
    (gpsSuccess, gpsError, gpsOptions);
}

function gpsRetry(gpsOptions) {
    navigator.geolocation.getCurrentPosition(gpsSuccess, gpsError, gpsOptions);
}

// onError Callback receives a PositionError object
//
function gpsError(error, gpsOptions) {
    alert('code: '    + error.code    + "\n" +
        'message: ' + error.message + "\n" +
        "Attiva la geolocalizzazione per usare al meglio la tua app!");
    gpsRetry(gpsOptions);
}

function gpsSuccess(position) {
    Singleton.getInstance().position = {'lat' : position.coords.latitude, 'lon' : position.coords.longitude}
    console.log("gps success!!")
}

function placeMarker(person) {
    //TODO Inserire la propria posizione. Verificare che la posizione non sia NUL.
    //TODO Aggiornare i valori degli amici
    var latLng = new google.maps.LatLng(person.position.lat, person.position.lon);
    var marker = new google.maps.Marker({
        position: latLng,
        map: map
    })
    google.maps.event.addListener(marker, 'click', function(){
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent( "<div id='infowindow'>"+ person.msg +"</div>");
        infowindow.open(map, marker);
    });
}

function initMap(pos) {
    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center:{lat: 45, lng: 9}
    });
    console.log(Singleton.getInstance().username)
    console.log(Singleton.getInstance().position);
    console.log(Singleton.getInstance().session_id);

    if (Singleton.getInstance().position != null)
        placeMarker(Singleton.getInstance());

    for(var i=0; i < people.length; i++) {
        placeMarker(people[i])
    }

}

function watchMapPosition() {
    return navigator.geolocation.watchPosition
    (onMapWatchSuccess, onMapError, { enableHighAccuracy: true });
}