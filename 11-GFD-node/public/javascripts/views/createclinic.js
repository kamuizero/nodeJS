var ratingUsuarioInglesDoc, ratingUsuarioChinoDoc, ratingUsuarioEspanolDoc, ratingUsuarioCoreanoDoc, ratingUsuarioOtroDoc,
    ratingUsuarioInglesStaff, ratingUsuarioChinoStaff, ratingUsuarioEspanolStaff, ratingUsuarioCoreanoStaff, ratingUsuarioOtroStaff,
    ratingUsuarioFL, ratingUsuarioIndicaciones;
var mapa, marker;
var nombreClinica, direccionClinica;

function iniciar() {
    loadStars();
}

function loadStars() {

    $('.starbox').starbox({
        stars: 3, //Total de estrellas a mostrar
        buttons: 3, //Se coloca 3 para que los ratings sean 3
        average: 0, //Valor inicial
        changeable: true,
        // changeable: 'once',
        autoUpdateAverage: true,
        ghosting: true
    }).bind('starbox-value-changed', function(event, value) {
        var voto = value.toFixed(2);
        switch (voto) {
            case ("0.33") :
                voto = 1;
                break;
            case ("0.67") :
                voto = 2;
                break;
            case ("1.00") :
                voto = 3;
                break;
            default:
                voto = 1;
                break;
        }

        ratingUsuarioFL = voto;
        verificarVisibilidad();
    });
}

function showButton(boton) {
    document.getElementById(boton).style.display = "inline";
}

function hideButton(boton){
    document.getElementById(boton).style.display = "none";
}

function displayMap(element) {
    if (!element.value) {
        // alert('Please enter an address');
        direccionClinica = null;
        // element.focus();   // <======= why isn't this having any effect??
    }
    else {
        direccionClinica = element.value
        obtenerCoordenadas(direccionClinica);
    }
}

function clickThumb(element) {

    var nombre = element.getAttribute('name'); //Obtenemos el idioma a donde le dio click
    var voto = element.getAttribute('value');

    switch (nombre) {
        case 'votoInglesDoc' :
            if ((ratingUsuarioInglesDoc!=null) && (ratingUsuarioInglesDoc == voto)) { //Ya esta clickeado
                element.checked = false;
                ratingUsuarioInglesDoc = null;
            }
            else {
                ratingUsuarioInglesDoc = voto;
            }
            break;
        case 'votoInglesStaff' :
            if ((ratingUsuarioInglesStaff!=null) && (ratingUsuarioInglesStaff == voto)) { //Ya esta clickeado
                element.checked = false;
                ratingUsuarioInglesStaff = null;
            }
            else {
                ratingUsuarioInglesStaff = voto;
            }
            break;
        case 'votoChinoDoc' :
            if ((ratingUsuarioChinoDoc!=null) && (ratingUsuarioChinoDoc == voto)) { //Ya esta clickeado
                element.checked = false;
                ratingUsuarioChinoDoc = null;
            }
            else {
                ratingUsuarioChinoDoc  = voto;
            }
            break;
        case 'votoChinoStaff' :
            if ((ratingUsuarioChinoStaff !=null) && (ratingUsuarioChinoStaff == voto)) { //Ya esta clickeado
                element.checked = false;
                ratingUsuarioChinoStaff = null;
            }
            else {
                ratingUsuarioChinoStaff = voto;
            }
            break;
        case 'votoCoreanoDoc' :
            if ((ratingUsuarioCoreanoDoc !=null) && (ratingUsuarioCoreanoDoc == voto)) { //Ya esta clickeado
                element.checked = false;
                ratingUsuarioCoreanoDoc = null;
            }
            else {
                ratingUsuarioCoreanoDoc = voto;
            }
            break;
        case 'votoCoreanoStaff' :
            if ((ratingUsuarioCoreanoStaff !=null) && (ratingUsuarioCoreanoStaff == voto)) { //Ya esta clickeado
                element.checked = false;
                ratingUsuarioCoreanoStaff = null;
            }
            else {
                ratingUsuarioCoreanoStaff = voto;
            }
            break;
        case 'votoEspanolDoc' :
            if ((ratingUsuarioEspanolDoc !=null) && (ratingUsuarioEspanolDoc == voto)) { //Ya esta clickeado
                element.checked = false;
                ratingUsuarioEspanolDoc = null;
            }
            else {
                ratingUsuarioEspanolDoc = voto;
            }
            break;
        case 'votoEspanolStaff' :
            if ((ratingUsuarioEspanolStaff !=null) && (ratingUsuarioEspanolStaff == voto)) { //Ya esta clickeado
                element.checked = false;
                ratingUsuarioEspanolStaff = null;
            }
            else {
                ratingUsuarioEspanolStaff = voto;
            }
            break;
        case 'votoOtroDoc' :
            if ((ratingUsuarioOtroDoc !=null) && (ratingUsuarioOtroDoc == voto)) { //Ya esta clickeado
                element.checked = false;
                ratingUsuarioOtroDoc = null;
            }
            else {
                ratingUsuarioOtroDoc = voto;
            }
            break;
        case 'votoOtroStaff' :
            if ((ratingUsuarioOtroStaff !=null) && (ratingUsuarioOtroStaff == voto)) { //Ya esta clickeado
                element.checked = false;
                ratingUsuarioOtroStaff = null;
            }
            else {
                ratingUsuarioOtroStaff = voto;
            }
            break;
        case 'votoIndicacion' :
            if ((ratingUsuarioIndicaciones !=null) && (ratingUsuarioIndicaciones == voto)) { //Ya esta clickeado
                element.checked = false;
                ratingUsuarioIndicaciones = null;
            }
            else {
                ratingUsuarioIndicaciones = voto;
            }
            break;
        default: break;
    }

    //Verificamos si hacer visible el boton o no
    verificarVisibilidad();
}

function verificarVisibilidad() {
    if (ratingUsuarioInglesDoc==null && ratingUsuarioChinoDoc==null && ratingUsuarioEspanolDoc==null &&
        ratingUsuarioCoreanoDoc==null && ratingUsuarioOtroDoc==null && ratingUsuarioInglesStaff==null &&
        ratingUsuarioChinoStaff==null && ratingUsuarioEspanolStaff==null && ratingUsuarioCoreanoStaff==null &&
        ratingUsuarioOtroStaff==null && ratingUsuarioFL==null && ratingUsuarioIndicaciones== null &&
        ratingUsuarioFL == null && marker == null && nombreClinica == null && direccionClinica == null) {
        hideButton('botonAdd');
        hideButton('botonClearC');
    }
    else {
        showButton('botonAdd');
        showButton('botonClearC');
    }
}

function clearInput() {
    resetThumbs(); //Resetear los pulgares
    resetStars(); //Resetear las estrellas
    verificarVisibilidad();
}

function resetThumbs() {

    ratingUsuarioInglesDoc = ratingUsuarioChinoDoc = ratingUsuarioEspanolDoc = ratingUsuarioCoreanoDoc = ratingUsuarioOtroDoc =
        ratingUsuarioInglesStaff = ratingUsuarioChinoStaff = ratingUsuarioEspanolStaff = ratingUsuarioCoreanoStaff = ratingUsuarioOtroStaff =
            ratingUsuarioIndicaciones = null;

    //Idiomas
    document.getElementsByName("votoInglesDoc")[0].checked = false;
    document.getElementsByName("votoInglesDoc")[1].checked = false;

    document.getElementsByName("votoInglesStaff")[0].checked = false;
    document.getElementsByName("votoInglesStaff")[1].checked = false;

    document.getElementsByName("votoChinoDoc")[0].checked = false;
    document.getElementsByName("votoChinoDoc")[1].checked = false;

    document.getElementsByName("votoChinoStaff")[0].checked = false;
    document.getElementsByName("votoChinoStaff")[1].checked = false;

    document.getElementsByName("votoCoreanoDoc")[0].checked = false;
    document.getElementsByName("votoCoreanoDoc")[1].checked = false;

    document.getElementsByName("votoCoreanoStaff")[0].checked = false;
    document.getElementsByName("votoCoreanoStaff")[1].checked = false;

    document.getElementsByName("votoEspanolDoc")[0].checked = false;
    document.getElementsByName("votoEspanolDoc")[1].checked = false;

    document.getElementsByName("votoEspanolStaff")[0].checked = false;
    document.getElementsByName("votoEspanolStaff")[1].checked = false;

    document.getElementsByName("votoOtroDoc")[0].checked = false;
    document.getElementsByName("votoOtroDoc")[1].checked = false;

    document.getElementsByName("votoOtroStaff")[0].checked = false;
    document.getElementsByName("votoOtroStaff")[1].checked = false;

    //Indicaciones

    document.getElementsByName("votoIndicacion")[0].checked = false;
    document.getElementsByName("votoIndicacion")[1].checked = false;

}

function resetStars() {

    var starB = $('.starbox');

    ratingUsuarioFL = null;
    starB.starbox('destroy', null);

    //Regeneramos el rating
    starB.starbox({
        stars: 3, //Total de estrellas a mostrar
        buttons: 3, //Se coloca 3 para que los ratings sean 3
        average: 0, //Valor inicial
        changeable: true,
        autoUpdateAverage: true,
        ghosting: true
    });

}

function toggleBounce() {
    if (marker.getAnimation() != null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.DROP);
    }
}

function obtenerNombre(element) {
    if (!element.value) {
        nombreClinica = null;
    }
    else {
        nombreClinica = element.value;
        verificarVisibilidad();
    }
}

function obtenerCoordenadas(valor) {

    var geocoder = new google.maps.Geocoder();

    mapa = null;
    marker = null;

    geocoder.geocode( { 'address': valor}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            console.log("Latitude: " + latitude + " and longitude: " + longitude);

            //Hacemos la imagen invisible
            document.getElementById("imagenLogo").style.display = "none";

            //Mostramos el mapa
            document.getElementById("mapC").style.width = "670px";
            document.getElementById("mapC").style.height = "645px";
            document.getElementById("mapC").style.float = "left";
            document.getElementById("mapC").style.marginRight = "25px";

            mapa = new google.maps.Map(document.getElementById('mapC'), {
                zoom: 18,
                center: {lat:latitude, lng: longitude},
                mapTypeControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_CENTER
                },
                scaleControl: true,
                streetViewControl: false
            });

            google.maps.event.addListener(mapa, 'click', function(event) {
                placeMarker(event.latLng);
            });

            function placeMarker(location) {

                if (marker == undefined) {
                    marker = new google.maps.Marker({
                        position: location,
                        map: mapa,
                        animation: google.maps.Animation.DROP
                    });
                }
                else {
                    marker.setPosition(location);
                }

                toggleBounce();
                mapa.panTo(location);
            }

            marker = new google.maps.Marker({
                map: mapa,
                position: {lat:latitude, lng: longitude},
                animation: google.maps.Animation.DROP
            });

            google.maps.event.addDomListener(window, "resize", function() {
                var center = mapa.getCenter();
                google.maps.event.trigger(mapa, "resize");
                mapa.setCenter(center);
            });

            verificarVisibilidad();
        }
    });
}