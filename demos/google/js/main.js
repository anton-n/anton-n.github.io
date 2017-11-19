// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        zoom: 11,
        // maxZoom: 15,
        // minZoom: 10,
        scrollwheel: false,
        zoomControl: false,
        scaleControl: false,
        rotateControl: false,
        panControl: false,
        disableDefaultUI: false,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
        fullscreenControl: false,
        // Google logo, footer, copyright - disabled in css

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(59.9196753, 30.327311),

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"administrative.province","elementType":"labels.icon","stylers":[{"hue":"#ff0000"},{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    };

    // Get the HTML DOM element that will contain your map 
    var mapElement = document.getElementById('google-map');

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    var neighborhoods = [
        // Main
        {lat: 59.9196753, lng: 30.327311, title: 'Main', icon: 'pin.png'},
        {lat: 59.941744, lng: 30.2818393, title: '5', icon: 'pin.png'},
        {lat: 59.9877773, lng: 30.6745783, title: 'Oz-1', icon: 'pin.png'},
        {lat: 59.8489958, lng: 30.025562, title: 'Strelna', icon: 'pin.png'},
        {lat: 59.8613044, lng: 30.670606, title: 'KM', icon: 'pin.png'},
        ];

    var markers = [];

    function drop() {
        for (var i = 0; i < neighborhoods.length; i++) {
            addMarkerWithTimeout(neighborhoods[i], i * 500);
        };
    };

    function addMarkerWithTimeout(marker, timeout) {
        window.setTimeout(function() {
            markers.push(new google.maps.Marker({
                position: new google.maps.LatLng(marker["lat"], marker["lng"]),
                map: map,
                title: marker["title"],
                icon: {
                    url: "img/" + marker["icon"]
                },
                animation: google.maps.Animation.DROP
            }));
        }, timeout);
    };

    drop();

    /*=============================================
    =         Map center on window.resize         =
    =============================================*/
    google.maps.event.addDomListener(window, 'resize', function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    /*=============================================
    =     Enable scroll zoom after click on map   =
    =============================================*/
    map.addListener('click', function() {
       map.setOptions({
            scrollwheel: true
       });
    });

    /*=============================================
    =  Disable scroll zoom when mouse leave map   =
    =============================================*/
    map.addListener('drag', function() {
       map.setOptions({
            scrollwheel: true
       });
    });

    /*=============================================
    =     Enable scroll zoom after click on map   =
    =============================================*/
    map.addListener('mouseout', function() {
       map.setOptions({
            scrollwheel: false
       });
    });

};



/*=============================================
=          Markers with info windows          =
-----------------------------------------------
=         Replace with drop function          =
=============================================*/


/*
var neighborhoods = [
    // Main
    {lat: 40.6700, lng: -73.9400, title: 'Title 1', content: 'Test test test', icon: 'pin.png'},
    {lat: 40.6700, lng: -73.9400, title: 'Title 2', content: 'Test test test', icon: 'pin.png'},
    {lat: 40.6700, lng: -73.9400, title: 'Title 3', content: 'Test test test', icon: 'pin.png'},
];

infoWindow = new google.maps.InfoWindow();

function displayMarkers() {

   // this variable sets the map bounds and zoom level according to markers position
   var bounds = new google.maps.LatLngBounds();

   // For loop that runs through the info on markersData making it possible to createMarker function to create the markers
   for (var i = 0; i < neighborhoods.length; i++){

      var latlng = new google.maps.LatLng(neighborhoods[i].lat, neighborhoods[i].lng);
      var name = neighborhoods[i].title;
      var icon = neighborhoods[i].icon;
      var content = neighborhoods[i].content;

      createMarker(latlng, name, content, icon, i * 500);

      // Marker’s Lat. and Lng. values are added to bounds variable
      bounds.extend(latlng);
   };

};

function createMarker(latlng, title, content, icon, timeout) {

    window.setTimeout(function() {
       var marker = new google.maps.Marker({
          map: map,
          position: latlng,
          clickable: true,
          icon: {
            url: "img/" + icon
          },
          animation: google.maps.Animation.DROP
       });

       google.maps.event.addListener(marker, 'click', function() {
          var infoContent = '<div class="pin-container">' +
          '<h3 class="pin__title">' + title + '</h3><div class="pin__content">' + content + '</div></div>';

          infoWindow.setContent(infoContent);
          infoWindow.open(map, marker);

       });

    }, timeout);

};

displayMarkers();

*/