/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/


people = []

function Person(first, age, post, lat, long) {
    this.username = username;
    this.msg = post
    this.position = {'lat' : lat,  'long' : long}
}

var Singleton = (function () {
    var instance;

    function createInstance(username, session_id, position) {
        var myProfile = Object.create(Person);
        return myProfile
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();


function onLoad() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
}


function onDeviceReady() {
    this.receivedEvent('deviceready');
    document.addEventListener('pause', this.onPause.bind(this), false)
}


function onPause () {
        console.log("pausaaa")
    }

// Update DOM on a Received Event
function receivedEvent(id) {
    $("#sub").click(function () {
        login()
    })
}


function login () {
    // username = $("#inputUsername").val();
    // password = $("#inputPassword").val();
    var username = "giuse";
    var password = "bigs123qwert";
    console.log(username)
    console.log(password)
    $.ajax({
        type: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        url: "   https://ewserver.di.unimi.it/mobicomp/geopost/login",
        data: {
            'username': username,
            'password': password
        },
        error: function(xhr, textStatus, error){
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        success: function(session_id){
            console.log(session_id);
            Singleton.getInstance().username = username
            Singleton.getInstance().session_id = session_id
            loadPeople();
        }
    });
}

function loadPeople() {
    $.ajax({
        url: "https://ewserver.di.unimi.it/mobicomp/geopost/followed?session_id=" + Singleton.getInstance().session_id,
        success: function (result) {
                people = result.followed;
                showAmiciSeguitiScreen()
        }
    })
}

function showAmiciSeguitiScreen() {
    output = ""
    $("nav").show()
    $("#dynamicBody").load("followedFriends.html", function () {
            people.forEach(function (item, index) {
                output += "<li class=\"list-group-item\">"+ item.username +"</li>";
                $("#amici").html(output);
        })
        $("#mappa").hide();
        $("#bottone_lista").click(function() {
            $("#bottone_mappa").removeClass("btn-primary").addClass("btn-default");
            $("#bottone_lista").removeClass("btn-default").addClass("btn-primary");
            $("#mappa").hide();
            $("#lista").show();
        });
        $("#bottone_mappa").click(function() {
            $("#bottone_lista").removeClass("btn-primary").addClass("btn-default");
            $("#bottone_mappa").removeClass("btn-default").addClass("btn-primary");
            $("#lista").hide();
            $("#mappa").show();
            google.maps.event.trigger(map, 'resize');

        });
        $.getScript( "https://maps.googleapis.com/maps/api/js?key=AIzaSyBZZtpQ-rvXhNSqPEgc8957A07yL11Ya4w&callback=initMap",
            function () {
                console.log("geoWorks?")
                getMapLocation()
            });

    })
}

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
    Singleton.getInstance().position = position
    initMap(position);
}


function initMap(pos) {
    var uluru = {lat: pos.coords.latitude, lng: pos.coords.longitude};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    var contentString = 'Bella Raga!'

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map,
        title: 'Post'
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}

function logout() {
    $.ajax({
        url: "https://ewserver.di.unimi.it/mobicomp/geopost/logout?session_id=" + Singleton.getInstance().session_id,
        success: function (result) {
            console.log("logout eseguito!");
            window.location.href = "index.html"
        }
    })
}

function watchMapPosition() {
    return navigator.geolocation.watchPosition
    (onMapWatchSuccess, onMapError, { enableHighAccuracy: true });
}



//     <h1>Apache Cordova</h1>
// <div id="deviceready" class="blink">
//     <p class="event listening">Connecting to Device</p>
// <p class="event received">Device is Ready</p>
// </div>