var activeInfoWindow;
var marker;
var ratingOriginal;
var ratingUsuarioInglesDoc, ratingUsuarioChinoDoc, ratingUsuarioEspanolDoc, ratingUsuarioCoreanoDoc, ratingUsuarioOtroDoc,
    ratingUsuarioInglesStaff, ratingUsuarioChinoStaff, ratingUsuarioEspanolStaff, ratingUsuarioCoreanoStaff, ratingUsuarioOtroStaff,
    ratingUsuarioFL, ratingUsuarioIndicaciones;

hideButton("botonReview");
hideButton("botonClear");
obtenerClinica();

function obtenerClinica() {

    //TODO: Utilizar los parametros del router de express
    var feature = JSON.parse(localStorage.getItem('clinica'));

    if (feature != null) {

        var langLevel;
        var totalDoc;
        var totalStaff;

        initMap(feature); //Mostramos el mapa

        //$("#divNombreClinica").text(feature.title);
        document.getElementById('divNombreClinica').text(feature.title);

        document.getElementById('divDireccionClinica').text(feature.description);

        /* Load languages ratings */

        langLevel = evaluarIdioma('ingles');

        totalDoc = langLevel.positivoDoctor + langLevel.negativoDoctor;
        totalStaff = langLevel.positivoStaff + langLevel.negativoStaff;
        document.getElementById('inglesDoc').text(langLevel.doctor + (totalDoc>0?' (' + totalDoc + ' votes)':''));
        document.getElementById('inglesStaff').text(langLevel.staff + (totalStaff>0?' (' + totalStaff + ' votes)':''));

        langLevel = evaluarIdioma('chino');

        totalDoc = langLevel.positivoDoctor + langLevel.negativoDoctor;
        totalStaff = langLevel.positivoStaff + langLevel.negativoStaff;
        document.getElementById('chinoDoc').text(langLevel.doctor + (totalDoc>0?' (' + totalDoc + ' votes)':''));
        document.getElementById('chinoStaff').text(langLevel.staff + (totalStaff>0?' (' + totalStaff + ' votes)':''));

        langLevel = evaluarIdioma('coreano');

        totalDoc = langLevel.positivoDoctor + langLevel.negativoDoctor;
        totalStaff = langLevel.positivoStaff + langLevel.negativoStaff;
        document.getElementById('coreanoDoc').text(langLevel.doctor + (totalDoc>0?' (' + totalDoc + ' votes)':''));
        document.getElementById('coreanoStaff').text(langLevel.staff + (totalStaff>0?' (' + totalStaff + ' votes)':''));

        langLevel = evaluarIdioma('espanol');

        totalDoc = langLevel.positivoDoctor + langLevel.negativoDoctor;
        totalStaff = langLevel.positivoStaff + langLevel.negativoStaff;
        document.getElementById('espanolDoc').text(langLevel.doctor + (totalDoc>0?' (' + totalDoc + ' votes)':''));
        document.getElementById('espanolStaff').text(langLevel.staff + (totalStaff>0?' (' + totalStaff + ' votes)':''));

        langLevel = evaluarIdioma('otro');

        totalDoc = langLevel.positivoDoctor + langLevel.negativoDoctor;
        totalStaff = langLevel.positivoStaff + langLevel.negativoStaff;
        document.getElementById('otroDoc').text(langLevel.doctor + (totalDoc>0?' (' + totalDoc + ' votes)':''));
        document.getElementById('otroStaff').text(langLevel.staff + (totalStaff>0?' (' + totalStaff + ' votes)':''));

        /* Load Doctor's friendliness level */

        ratingOriginal = evaluarRating();

        if (ratingOriginal > 0) {
            document.getElementById('divRatingActitud').text('(' + (ratingOriginal*100).toFixed(0) + "% positive)");
        }
        else {
            document.getElementById('divRatingActitud').text("(No ratings yet)");
        }

        $('.starbox').starbox({
            stars: 3, //Total de estrellas a mostrar
            buttons: 3, //Se coloca 3 para que los ratings sean 3
            average: ratingOriginal, //Valor inicial
            changeable: 'once',
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

        /* Prescription */

        var ratingPrescription = evaluarPrescripcion();

        if (ratingPrescription != -1) {
            $("#divRatingExplicacion").text(ratingPrescription + ' % Positive votes');
        }
        else {
            $("#divRatingExplicacion").text('No ratings yet');
        }

    }
}

function initMap(feature) {

    var posicionInicial = feature.position;

    mapa = new google.maps.Map(document.getElementById('mapaClinica'), {
        zoom: 17,
        center: posicionInicial,
        mapTypeControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        streetViewControl: false
    });

    //Cargar el marcador

    marker = new google.maps.Marker({
        id: feature.id,
        description:feature.description,
        position: feature.position,
        map: mapa,
        title: feature.title,
        type: feature.type,
        icon: feature.icon,

        /* Doctor */

        doctorSpeaksEnglishTrue: feature.doctorSpeaksEnglishTrue, //Doctor habla ingles - Votos positivos
        doctorSpeaksEnglishFalse: feature.doctorSpeaksEnglishFalse, //Doctor habla ingles - Votos negativos

        doctorSpeaksChineseTrue: feature.doctorSpeaksChineseTrue, //Doctor habla Chino - Votos positivos
        doctorSpeaksChineseFalse: feature.doctorSpeaksChineseFalse, //Doctor habla Chino - Votos negativos

        doctorSpeaksKoreanTrue: feature.doctorSpeaksKoreanTrue, //Doctor habla Coreano - Votos positivos
        doctorSpeaksKoreanFalse: feature.doctorSpeaksKoreanFalse, //Doctor habla Coreano - Votos negativos

        doctorSpeaksSpanishTrue: feature.doctorSpeaksSpanishTrue, //Doctor habla Espanol - Votos positivos
        doctorSpeaksSpanishFalse: feature.doctorSpeaksSpanishFalse, //Doctor habla Espanol - Votos negativos

        doctorSpeaksOtherTrue: feature.doctorSpeaksOtherTrue, //Doctor habla Otro idioma - Votos positivos
        doctorSpeaksOtherFalse: feature.doctorSpeaksOtherFalse, //Doctor habla Otro idioma - Votos negativos

        /* Personal */

        staffSpeaksEnglishTrue: feature.staffSpeaksEnglishTrue, //Personal habla ingles - Votos positivos
        staffSpeaksEnglishFalse: feature.staffSpeaksEnglishFalse, //Personal habla ingles - Votos negativos

        staffSpeaksChineseTrue: feature.staffSpeaksChineseTrue, //Personal habla Chino - Votos positivos
        staffSpeaksChineseFalse: feature.staffSpeaksChineseFalse, //Personal habla Chino - Votos negativos

        staffSpeaksKoreanTrue: feature.staffSpeaksKoreanTrue, //Personal habla Coreano - Votos positivos
        staffSpeaksKoreanFalse: feature.staffSpeaksKoreanFalse, //Personal habla Coreano - Votos negativos

        staffSpeaksSpanishTrue: feature.staffSpeaksSpanishTrue, //Personal habla Espanol - Votos positivos
        staffSpeaksSpanishFalse: feature.staffSpeaksSpanishFalse, //Personal habla Espanol - Votos negativos

        staffSpeaksOtherTrue: feature.staffSpeaksOtherTrue, //Personal habla Otro idioma - Votos positivos
        staffSpeaksOtherFalse: feature.staffSpeaksOtherFalse, //Personal habla Otro idioma - Votos negativos

        /* Evaluacion */

        FriendlyL1 : feature.FriendlyL1, //1 Estrella
        FriendlyL2 : feature.FriendlyL2, //2 Estrellas
        FriendlyL3 : feature.FriendlyL3 , //3 Estrellas

        ForeignLanguageTreatmentExplanationTrue: feature.ForeignLanguageTreatmentExplanationTrue, //Ofrecen posologia o indicaciones en idioma extranjero - Votos positivos
        ForeignLanguageTreatmentExplanationFalse: feature.ForeignLanguageTreatmentExplanationFalse

    });

    var infowindow = new google.maps.InfoWindow();
    infowindow.setContent(crearContenido(marker));

    function toggleBounce () {
        if (marker.getAnimation() != null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    // this part makes the markers clickable
    google.maps.event.addListener(marker, 'click', function() {

        if(activeInfoWindow != null) activeInfoWindow.close();

        // Open InfoWindow - on click
        toggleBounce();
        infowindow.open(mapa, marker);
        setTimeout(toggleBounce, 780);

        //Guardamos la ventana para poder ocultarla luego
        activeInfoWindow = infowindow;

        //Centramos el mapa
        mapa.panTo(marker.getPosition());

    });

    infowindow.open(mapa, marker);
    console.log('Fin de carga del mapa');
}

function crearContenido(marker) {

    var html = '<p style="align-content: center"><strong>' + marker.title + '</strong></p><br>' + marker.description +
        '<br><br>';
    return html;
}

function showButton(boton) {
    document.getElementById(boton).style.display = "inline";
}

function hideButton(boton){
    document.getElementById(boton).style.display = "none";
}

function clearAllThumbs() {

    document.getElementsByName("votoIndicacion").checked = false;

    document.getElementsByName("votoInglesDoc").checked = false;
    document.getElementsByName("votoInglesStaff").checked = false;

    document.getElementsByName("votoChinoDoc").checked = false;
    document.getElementsByName("votoChinoStaff").checked = false;

    document.getElementsByName("votoCoreanoDoc").checked = false;
    document.getElementsByName("votoCoreanoStaff").checked = false;

    document.getElementsByName("votoEspanolDoc").checked = false;
    document.getElementsByName("votoEspanolStaff").checked = false;

    document.getElementsByName("votoOtroDoc").checked = false;
    document.getElementsByName("votoOtroStaff").checked = false;

}

function verificarVisibilidad() {
    if (ratingUsuarioInglesDoc==null && ratingUsuarioChinoDoc==null && ratingUsuarioEspanolDoc==null &&
        ratingUsuarioCoreanoDoc==null && ratingUsuarioOtroDoc==null && ratingUsuarioInglesStaff==null &&
        ratingUsuarioChinoStaff==null && ratingUsuarioEspanolStaff==null && ratingUsuarioCoreanoStaff==null &&
        ratingUsuarioOtroStaff==null && ratingUsuarioFL==null && ratingUsuarioIndicaciones== null &&
        ratingUsuarioFL == null) {
        hideButton('botonReview');
        hideButton('botonClear');
    }
    else{
        showButton('botonReview');
        showButton('botonClear');
    }
}