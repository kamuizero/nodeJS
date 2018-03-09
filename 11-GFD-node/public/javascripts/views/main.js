const posicionInicial = {lat: 35.1547072, lng: 136.9613086}; //Aichi
var allMarkersData =[];
var activeInfoWindow;
var activeMarker;
var map;
var icons = {
    health: {
        icon: '/images/gfd/icons/health_icon.png'
    },
    clinic: {
        icon: '/images/gfd/icons/clinic_icon.png'
    },
    hospital: {
        icon: '/images/gfd/icons/hospital_icon.png'
    }
};

initMap();

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        //center: uluru,
        center: posicionInicial,
        mapTypeControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        streetViewControl: false
    });

    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://localhost:8001/clinics', false);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send();
    var prueba = JSON.parse(xhr.responseText);

    console.log(prueba);
    //cargarClinicasAlMapa(crearArreglo(prueba)); //Usando Virtuoso
    cargarClinicasAlMapa(crearArregloMySQL(prueba)); //Usando MySQL
}

/*
 * Crear arreglo de clinicas, 're' es el objeto  JSON con la informacion
 */
function crearArreglo(re) {
    //console.log('crear arreglo');
    var clinicas = [];
    var lat, long;

    //Aqui generamos los objetos particulares con cada uno de sus atributos

    var clinica;

    for (i = 0; i < re.results.bindings.length; i++) {

        var atributo = re.results.bindings[i].atributo.value.split("#")[1];
        var valor = re.results.bindings[i].valor.value;
        var id = re.results.bindings[i].clinica.value.split("#")[1]; //Unicamente el ID

        if (!clinica)
            clinica = { id: id, type: "health"};
        else if (id != clinica.id) { //Nueva clinica
            clinica["position"] = new google.maps.LatLng(clinica.lat, clinica.long);
            clinicas.push(clinica);
            clinica = { id: id, type: "health"};
        }

        clinica[atributo] = valor; //Agregamos el valor a la clinica
    }

    return clinicas;
}

function crearArregloMySQL(re) {
    //console.log('crear arreglo');
    let clinicas = [];
    let lat, long;

    //Aqui generamos los objetos particulares con cada uno de sus atributos

    let clinica;

    for (let i = 0; i < re.length; i++) {//Ciclar por el arreglo
        //clinica = re[i];
        clinica = {...re[i]};
        clinica.id = re[i].idclinic;
        clinica.type = 'health';
        clinica.position = new google.maps.LatLng(clinica.lat, clinica.long);
        clinica.FriendlyL1 = clinica.friendlyL1;
        clinica.FriendlyL2 = clinica.friendlyL2;
        clinica.FriendlyL3 = clinica.friendlyL3;

        clinica.ForeignLanguageTreatmentExplanationTrue = clinica.foreignLanguageExplanationTrue;
        clinica.ForeignLanguageTreatmentExplanationFalse = clinica.foreignLanguageExplanationFalse;

        clinicas.push(clinica);
    }

    console.log(clinicas);

    return clinicas;
}

function cargarClinicasAlMapa(clinicas) {
    //Finalizo carga de los datos, mostrarlas como marcadores en el mapa
    for (var k = 0, clinicaP; clinicaP = clinicas[k]; k++) {
        addMarkerInfoWindow(clinicaP,map);
    }
}

/*================================================
 *Funcion que crea el marcador y lo agrega al mapa
 *================================================
 */

function addMarkerInfoWindow(feature, mapa) {

    let image = {
        url: icons[feature.type].icon,
        scaledSize : new google.maps.Size(35, 49)
    };

    var marker = new google.maps.Marker({
        id: feature.id,
        //description:feature.description, NORMAL
        description:feature.address, //RDF
        position: feature.position,
        map: mapa,
        //title: feature.title, NORMAL
        title: feature.name, //RDF
        type: feature.type,
        icon: image,

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

    // Hacer que el marcador se pueda clickear
    google.maps.event.addListener(marker, 'click', function() {

        if(activeInfoWindow != null) activeInfoWindow.close();

        // Open InfoWindow - on click
        toggleBounce();
        infowindow.open(map, marker);
        setTimeout(toggleBounce, 780);

        //Guardamos la ventana para poder ocultarla luego
        activeInfoWindow = infowindow;
        activeMarker = marker;

        //Centramos el mapa
        //map.setCenter(marker.getPosition());
        map.panTo(marker.getPosition());

    });

    //Agregamos el marcador a la lista total
    allMarkersData.push(marker);
    return(marker);
}
/*
 * ===============================================
 */
function crearContenido(marker) {

    var ingles, chino, coreano, espanol, otro;

    ingles = evaluarIdioma('ingles',marker);
    chino = evaluarIdioma('chino',marker);
    coreano = evaluarIdioma('coreano',marker);
    espanol = evaluarIdioma('espanol',marker);
    otro = evaluarIdioma('otro',marker);

    if ( ((ingles.doctor!='0 %') && (ingles.doctor!='No ratings yet'))  ||
        ( (ingles.staff!='No ratings yet') && (ingles.staff!='0 %')) ) {
        ingles = '&nbsp; <img src="/images/gfd/lang/united-states.png" class="resize"/> ';
    }
    else {
        ingles = '';
    }

    if ( ((chino.doctor!='0 %') && (chino.doctor!='No ratings yet'))  ||
        ( (chino.staff!='No ratings yet') && (chino.staff!='0 %')) ) {
        chino = '&nbsp; <img src="/images/gfd/lang/china.png" class="resize"/> ';
    }
    else {
        chino = '';
    }

    if ( ((coreano.doctor!='0 %') && (coreano.doctor!='No ratings yet'))  ||
        ( (coreano.staff!='No ratings yet') && (coreano.staff!='0 %')) ) {
        coreano = '&nbsp; <img src="/images/gfd/lang/south-korea.png" class="resize"/> ';
    }
    else {
        coreano = '';
    }

    if ( ((espanol.doctor!='0 %') && (espanol.doctor!='No ratings yet'))  ||
        ( (espanol.staff!='No ratings yet') && (espanol.staff!='0 %')) ) {
        espanol = '&nbsp; <img src="/images/gfd/lang/spain.png" class="resize"/> ';
    }
    else {
        espanol = '';
    }

    if ( ((otro.doctor!='0 %') && (otro.doctor!='No ratings yet'))  ||
        ( (otro.staff!='No ratings yet') && (otro.staff!='0 %')) ) {
        otro = '&nbsp; <img src="/images/gfd/lang/hospital.png" class="resize"/> ';
    }
    else {
        otro = '';
    }

    //TODO: Mejorar el formato del infowindow http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html

    var html = '<p style="align-content: center"><strong>' + marker.title + '</strong></p><br>' + marker.description +
        '<br><br>' +
        'Languages: ' +
        '<div> <img src="/images/gfd/lang/japan.png" class="resize"/> ' + ingles + chino + coreano + espanol + otro +
        '</div>' +
        '<p><a style="color: #000;" href="#" title="Click to add clinic review" onclick="reviewClinic(); return false;">'+
        'Review clinic</a></p>';
    return html;
}

function evaluarIdioma(idioma, marker) {
    var porcentajeTotalDoctor, porcentajeTotalStaff,
        positivoDoctor, negativoDoctor,
        positivoStaff, negativoStaff;

    var round = Math.round;

    switch (idioma) {
        case 'ingles' : {
            positivoDoctor = round(marker.doctorSpeaksEnglishTrue);
            negativoDoctor = round(marker.doctorSpeaksEnglishFalse);
            positivoStaff = round(marker.staffSpeaksEnglishTrue);
            negativoStaff = round(marker.staffSpeaksEnglishFalse);
            break;
        }
        case 'chino' : {
            positivoDoctor = round(marker.doctorSpeaksChineseTrue);
            negativoDoctor = round(marker.doctorSpeaksChineseFalse);
            positivoStaff = round(marker.staffSpeaksChineseTrue);
            negativoStaff = round(marker.staffSpeaksChineseFalse);
            break;
        }
        case 'coreano' : {
            positivoDoctor = round(marker.doctorSpeaksKoreanTrue);
            negativoDoctor = round(marker.doctorSpeaksKoreanFalse);
            positivoStaff = round(marker.staffSpeaksKoreanTrue);
            negativoStaff = round(marker.staffSpeaksKoreanFalse);
            break;
        }
        case 'espanol' : {
            positivoDoctor = round(marker.doctorSpeaksSpanishTrue);
            negativoDoctor = round(marker.doctorSpeaksSpanishFalse);
            positivoStaff = round(marker.staffSpeaksSpanishTrue);
            negativoStaff = round(marker.staffSpeaksSpanishFalse);
            break;
        }
        case 'otro' : {
            positivoDoctor = round(marker.doctorSpeaksOtherTrue);
            negativoDoctor = round(marker.doctorSpeaksOtherFalse);
            positivoStaff = round(marker.staffSpeaksOtherTrue);
            negativoStaff = round(marker.staffSpeaksOtherFalse);
            break;
        }
        default : {
            return {doctor : 0, staff: 0};
        }
    }

    //TODO: Esto es una solucion temporal

    //Calculamos el porcentaje de cada uno
    if (positivoDoctor > 0 || negativoDoctor > 0) {
        porcentajeTotalDoctor = (positivoDoctor/(positivoDoctor+negativoDoctor))*100;
    }
    else {
        porcentajeTotalDoctor = -1;
    }

    if (positivoStaff > 0 || negativoStaff > 0) {
        porcentajeTotalStaff = (positivoStaff/(positivoStaff+negativoStaff))*100;
    }
    else {
        porcentajeTotalStaff = -1;
    }

    return {
        doctor : (porcentajeTotalDoctor == -1)?'No ratings yet':porcentajeTotalDoctor + ' %',
        staff : (porcentajeTotalStaff == -1)?'No ratings yet':porcentajeTotalStaff + ' %'
    }
}

function reviewClinic() {
    let c = markerASimpleBase(activeMarker);
    localStorage.setItem('clinica',JSON.stringify(c));
    location.assign('review');
}

function markerASimpleBase(marker) {
    var ret = {
        id: marker.id,
        description: marker.description,
        position: marker.position,
        title: marker.title,
        type: marker.type,
        icon: marker.icon,

        doctorSpeaksEnglishTrue: marker.doctorSpeaksEnglishTrue, //Doctor habla ingles - Votos positivos
        doctorSpeaksEnglishFalse: marker.doctorSpeaksEnglishFalse, //Doctor habla ingles - Votos negativos

        doctorSpeaksChineseTrue: marker.doctorSpeaksChineseTrue, //Doctor habla Chino - Votos positivos
        doctorSpeaksChineseFalse: marker.doctorSpeaksChineseFalse, //Doctor habla Chino - Votos negativos

        doctorSpeaksKoreanTrue: marker.doctorSpeaksKoreanTrue, //Doctor habla Coreano - Votos positivos
        doctorSpeaksKoreanFalse: marker.doctorSpeaksKoreanFalse, //Doctor habla Coreano - Votos negativos

        doctorSpeaksSpanishTrue: marker.doctorSpeaksSpanishTrue, //Doctor habla Espanol - Votos positivos
        doctorSpeaksSpanishFalse: marker.doctorSpeaksSpanishFalse, //Doctor habla Espanol - Votos negativos

        doctorSpeaksOtherTrue: marker.doctorSpeaksOtherTrue, //Doctor habla Otro idioma - Votos positivos
        doctorSpeaksOtherFalse: marker.doctorSpeaksOtherFalse, //Doctor habla Otro idioma - Votos negativos

        /* Personal */

        staffSpeaksEnglishTrue: marker.staffSpeaksEnglishTrue, //Personal habla ingles - Votos positivos
        staffSpeaksEnglishFalse: marker.staffSpeaksEnglishFalse, //Personal habla ingles - Votos negativos

        staffSpeaksChineseTrue: marker.staffSpeaksChineseTrue, //Personal habla Chino - Votos positivos
        staffSpeaksChineseFalse: marker.staffSpeaksChineseFalse, //Personal habla Chino - Votos negativos

        staffSpeaksKoreanTrue: marker.staffSpeaksKoreanTrue, //Personal habla Coreano - Votos positivos
        staffSpeaksKoreanFalse: marker.staffSpeaksKoreanFalse, //Personal habla Coreano - Votos negativos

        staffSpeaksSpanishTrue: marker.staffSpeaksSpanishTrue, //Personal habla Espanol - Votos positivos
        staffSpeaksSpanishFalse: marker.staffSpeaksSpanishFalse, //Personal habla Espanol - Votos negativos

        staffSpeaksOtherTrue: marker.staffSpeaksOtherTrue, //Personal habla Otro idioma - Votos positivos
        staffSpeaksOtherFalse: marker.staffSpeaksOtherFalse, //Personal habla Otro idioma - Votos negativos

        /* Evaluacion */

        FriendlyL1 : marker.FriendlyL1, //1 Estrella
        FriendlyL2 : marker.FriendlyL2, //2 Estrellas
        FriendlyL3 : marker.FriendlyL3, //3 Estrellas

        ForeignLanguageTreatmentExplanationTrue: marker.ForeignLanguageTreatmentExplanationTrue, //Ofrecen posologia o indicaciones en idioma extranjero - Votos positivos
        ForeignLanguageTreatmentExplanationFalse: marker.ForeignLanguageTreatmentExplanationFalse
    };

    return ret;
}