var activeInfoWindow;
var marker;
var ratingOriginal;
var ratingUsuarioInglesDoc, ratingUsuarioChinoDoc, ratingUsuarioEspanolDoc, ratingUsuarioCoreanoDoc, ratingUsuarioOtroDoc,
    ratingUsuarioInglesStaff, ratingUsuarioChinoStaff, ratingUsuarioEspanolStaff, ratingUsuarioCoreanoStaff, ratingUsuarioOtroStaff,
    ratingUsuarioFL, ratingUsuarioIndicaciones;

$(document).ready(function () {
    hideButton("botonReview");
    hideButton("botonClear");
    obtenerClinica();
});

function obtenerClinica() {

    //TODO: Utilizar los parametros del router de express
    var feature = JSON.parse(localStorage.getItem('clinica'));

    if (feature != null) {

        var langLevel;
        var totalDoc;
        var totalStaff;

        initMap(feature); //Mostramos el mapa

        //$("#divNombreClinica").text(feature.title);
        $("#divNombreClinica").text(feature.title);

        $("#divDireccionClinica").text(feature.description);

        /* Load languages ratings */

        langLevel = evaluarIdioma('ingles');

        totalDoc = langLevel.positivoDoctor + langLevel.negativoDoctor;
        totalStaff = langLevel.positivoStaff + langLevel.negativoStaff;
        $("#inglesDoc").text(langLevel.doctor + (totalDoc>0?' (' + totalDoc + ' votes)':''));
        $("#inglesStaff").text(langLevel.staff + (totalStaff>0?' (' + totalStaff + ' votes)':''));

        langLevel = evaluarIdioma('chino');

        totalDoc = langLevel.positivoDoctor + langLevel.negativoDoctor;
        totalStaff = langLevel.positivoStaff + langLevel.negativoStaff;
        $("#chinoDoc").text(langLevel.doctor + (totalDoc>0?' (' + totalDoc + ' votes)':''));
        $("#chinoStaff").text(langLevel.staff + (totalStaff>0?' (' + totalStaff + ' votes)':''));

        langLevel = evaluarIdioma('coreano');

        totalDoc = langLevel.positivoDoctor + langLevel.negativoDoctor;
        totalStaff = langLevel.positivoStaff + langLevel.negativoStaff;
        $("#coreanoDoc").text(langLevel.doctor + (totalDoc>0?' (' + totalDoc + ' votes)':''));
        $("#coreanoStaff").text(langLevel.staff + (totalStaff>0?' (' + totalStaff + ' votes)':''));

        langLevel = evaluarIdioma('espanol');

        totalDoc = langLevel.positivoDoctor + langLevel.negativoDoctor;
        totalStaff = langLevel.positivoStaff + langLevel.negativoStaff;
        $("#espanolDoc").text(langLevel.doctor + (totalDoc>0?' (' + totalDoc + ' votes)':''));
        $("#espanolStaff").text(langLevel.staff + (totalStaff>0?' (' + totalStaff + ' votes)':''));

        langLevel = evaluarIdioma('otro');

        totalDoc = langLevel.positivoDoctor + langLevel.negativoDoctor;
        totalStaff = langLevel.positivoStaff + langLevel.negativoStaff;
        $("#otroDoc").text(langLevel.doctor + (totalDoc>0?' (' + totalDoc + ' votes)':''));
        $("#otroStaff").text(langLevel.staff + (totalStaff>0?' (' + totalStaff + ' votes)':''));

        /* Load Doctor's friendliness level */

        ratingOriginal = evaluarRating();

        if (ratingOriginal > 0) {
            $("#divRatingActitud").text('(' + (ratingOriginal*100).toFixed(0) + "% positive)");
        }
        else {
            $("#divRatingActitud").text("(No ratings yet)");
        }

        console.log('Starbox');
        console.log(ratingOriginal);

        $('.starbox').starbox({
            stars: 3, //Total de estrellas a mostrar
            buttons: 3, //Se coloca 3 para que los ratings sean 3
            average: ratingOriginal, //Valor inicial
            changeable: 'once',
            autoUpdateAverage: true,
            ghosting: true
        }).bind('starbox-value-changed', function(event, value) {
            let voto = value.toFixed(2);
            console.log('CLICK ESTRELLAS voto ' + voto + ' VALUE es ' + value);

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

        console.log('Starbox cargado');

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

function evaluarIdioma(idioma) {
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
        positivoDoctor : positivoDoctor,
        negativoDoctor : negativoDoctor,
        doctor : (porcentajeTotalDoctor == -1)?'No ratings yet':porcentajeTotalDoctor.toFixed(2) + ' %',
        positivoStaff : positivoStaff,
        negativoStaff : negativoStaff,
        staff : (porcentajeTotalStaff == -1)?'No ratings yet':porcentajeTotalStaff.toFixed(2) + ' %'
    }
}

function evaluarPrescripcion() {
    var round = Math.round;

    var positiveVotes = round(marker.ForeignLanguageTreatmentExplanationTrue);
    var negativeVotes = round(marker.ForeignLanguageTreatmentExplanationFalse);

    if (positiveVotes > 0 || negativeVotes > 0) {
        return ( (positiveVotes/(positiveVotes+negativeVotes))*100 ).toFixed(2);
    }
    else {
        return -1;
    }
}

function evaluarRating() {
    //Promedio ponderado
    let round = Math.round;
    let L1, L2, L3;

    L1 = round(marker.FriendlyL1);
    L2 = round(marker.FriendlyL2);
    L3 = round(marker.FriendlyL3);

    let suma = L1+L2+L3;

    return (suma==0)?0:((((3*L3) + (2*L2) + (L1))/(suma))/3);
}

function rateClinicPre(){
    $("#Loading").show();
    rateClinic();
}

function rateClinic() {

    //Debemos tomar todos los cambios nuevos
    var datos = [];
    var voto;
    //Primero evaluacion de idiomas
    ratingUsuarioInglesDoc = (ratingUsuarioInglesDoc=='up')?1:(ratingUsuarioInglesDoc=='down'?-1:0);

    switch (ratingUsuarioInglesDoc) {
        case 1:
            voto = {
                atributo: "doctorSpeaksEnglishTrue",
                valor: Math.round(marker.doctorSpeaksEnglishTrue) + 1
            };
            datos.push(voto);
            break;
        case -1:
            voto = {
                atributo: "doctorSpeaksEnglishFalse",
                valor: Math.round(marker.doctorSpeaksEnglishFalse) + 1
            };
            datos.push(voto);
            break;
        default: //Nada
            break;
    }

    ratingUsuarioInglesStaff = (ratingUsuarioInglesStaff=='up')?1:(ratingUsuarioInglesStaff=='down'?-1:0);

    switch (ratingUsuarioInglesStaff) {
        case 1:
            voto = {
                atributo: "staffSpeaksEnglishTrue",
                valor: Math.round(marker.staffSpeaksEnglishTrue) + 1
            };
            datos.push(voto);
            break;
        case -1:
            voto = {
                atributo: "staffSpeaksEnglishFalse",
                valor: Math.round(marker.staffSpeaksEnglishFalse) + 1
            };
            datos.push(voto);
            break;
        default: //Nada
            break;
    }

    ratingUsuarioChinoDoc = (ratingUsuarioChinoDoc=='up')?1:(ratingUsuarioChinoDoc=='down'?-1:0);

    switch (ratingUsuarioChinoDoc) {
        case 1:
            voto = {
                atributo: "doctorSpeaksChineseTrue",
                valor: Math.round(marker.doctorSpeaksChineseTrue) + 1
            };
            datos.push(voto);
            break;
        case -1:
            voto = {
                atributo: "doctorSpeaksChineseFalse",
                valor: Math.round(marker.doctorSpeaksChineseFalse) + 1
            };
            datos.push(voto);
            break;
        default: //Nada
            break;
    }

    ratingUsuarioChinoStaff = (ratingUsuarioChinoStaff=='up')?1:(ratingUsuarioChinoStaff=='down'?-1:0);

    switch (ratingUsuarioChinoStaff) {
        case 1:
            voto = {
                atributo: "staffSpeaksChineseTrue",
                valor: Math.round(marker.staffSpeaksChineseTrue) + 1
            };
            datos.push(voto);
            break;
        case -1:
            voto = {
                atributo: "staffSpeaksChineseFalse",
                valor: Math.round(marker.staffSpeaksChineseFalse) + 1
            };
            datos.push(voto);
            break;
        default: //Nada
            break;
    }

    ratingUsuarioCoreanoDoc = (ratingUsuarioCoreanoDoc=='up')?1:(ratingUsuarioCoreanoDoc=='down'?-1:0);

    switch (ratingUsuarioCoreanoDoc) {
        case 1:
            voto = {
                atributo: "doctorSpeaksKoreanTrue",
                valor: Math.round(marker.doctorSpeaksKoreanTrue) + 1
            };
            datos.push(voto);
            break;
        case -1:
            voto = {
                atributo: "doctorSpeaksKoreanFalse",
                valor: Math.round(marker.doctorSpeaksKoreanFalse) + 1
            };
            datos.push(voto);
            break;
        default: //Nada
            break;
    }

    ratingUsuarioCoreanoStaff = (ratingUsuarioCoreanoStaff=='up')?1:(ratingUsuarioCoreanoStaff=='down'?-1:0);

    switch (ratingUsuarioCoreanoStaff) {
        case 1:
            voto = {
                atributo: "staffSpeaksKoreanTrue",
                valor: Math.round(marker.staffSpeaksKoreanTrue) + 1
            };
            datos.push(voto);
            break;
        case -1:
            voto = {
                atributo: "staffSpeaksKoreanFalse",
                valor: Math.round(marker.staffSpeaksKoreanFalse) + 1
            };
            datos.push(voto);
            break;
        default: //Nada
            break;
    }

    ratingUsuarioEspanolDoc = (ratingUsuarioEspanolDoc=='up')?1:(ratingUsuarioEspanolDoc=='down'?-1:0);

    switch (ratingUsuarioEspanolDoc) {
        case 1:
            voto = {
                atributo: "doctorSpeaksSpanishTrue",
                valor: Math.round(marker.doctorSpeaksSpanishTrue) + 1
            };
            datos.push(voto);
            break;
        case -1:
            voto = {
                atributo: "doctorSpeaksSpanishFalse",
                valor: Math.round(marker.doctorSpeaksSpanishFalse) + 1
            };
            datos.push(voto);
            break;
        default: //Nada
            break;
    }

    ratingUsuarioEspanolStaff = (ratingUsuarioEspanolStaff=='up')?1:(ratingUsuarioEspanolStaff=='down'?-1:0);

    switch (ratingUsuarioEspanolStaff) {
        case 1:
            voto = {
                atributo: "staffSpeaksSpanishTrue",
                valor: Math.round(marker.staffSpeaksSpanishTrue) + 1
            };
            datos.push(voto);
            break;
        case -1:
            voto = {
                atributo: "staffSpeaksSpanishFalse",
                valor: Math.round(marker.staffSpeaksSpanishFalse) + 1
            };
            datos.push(voto);
            break;
        default: //Nada
            break;
    }

    ratingUsuarioOtroDoc = (ratingUsuarioOtroDoc=='up')?1:(ratingUsuarioOtroDoc=='down'?-1:0);

    switch (ratingUsuarioOtroDoc) {
        case 1:
            voto = {
                atributo: "doctorSpeaksOtherTrue",
                valor: Math.round(marker.doctorSpeaksOtherTrue) + 1
            };
            datos.push(voto);
            break;
        case -1:
            voto = {
                atributo: "doctorSpeaksOtherFalse",
                valor: Math.round(marker.doctorSpeaksOtherFalse) + 1
            };
            datos.push(voto);
            break;
        default: //Nada
            break;
    }

    ratingUsuarioOtroStaff = (ratingUsuarioOtroStaff=='up')?1:(ratingUsuarioOtroStaff=='down'?-1:0);

    switch (ratingUsuarioOtroStaff) {
        case 1:
            voto = {
                atributo: "staffSpeaksOtherTrue",
                valor: Math.round(marker.staffSpeaksOtherTrue) + 1
            };
            datos.push(voto);
            break;
        case -1:
            voto = {
                atributo: "staffSpeaksOtherFalse",
                valor: Math.round(marker.staffSpeaksOtherFalse) + 1
            };
            datos.push(voto);
            break;
        default: //Nada
            break;
    }

    //Nivel de amistosidad del doctor
    if (ratingUsuarioFL==null) { //No hizo click en la estrella
        ratingUsuarioFL = 0;
    }
    else {
        switch (ratingUsuarioFL) {
            case 1:
                voto = {
                    atributo: "FriendlyL1",
                    valor: Math.round(marker.FriendlyL1) + 1
                };
                datos.push(voto);
                break;
            case 2:
                voto = {
                    atributo: "FriendlyL2",
                    valor: Math.round(marker.FriendlyL2) + 1
                };
                datos.push(voto);
                break;
            case 3:
                voto = {
                    atributo: "FriendlyL3",
                    valor: Math.round(marker.FriendlyL3) + 1
                };
                datos.push(voto);
                break;
            default:
                break;
        }
    }

    //Voto de indicaciones
    ratingUsuarioIndicaciones = (ratingUsuarioIndicaciones=='up')?1:(ratingUsuarioIndicaciones=='down'?-1:0);

    switch (ratingUsuarioIndicaciones) {
        case 1:
            voto = {
                atributo: "ForeignLanguageTreatmentExplanationTrue",
                valor: Math.round(marker.ForeignLanguageTreatmentExplanationTrue) + 1
            };
            datos.push(voto);
            break;
        case -1:
            voto = {
                atributo: "ForeignLanguageTreatmentExplanationFalse",
                valor: Math.round(marker.ForeignLanguageTreatmentExplanationFalse) + 1
            };
            datos.push(voto);
            break;
        default: //Nada
            break;
    }

    //Enviar los datos a procesar - La respuesta se procesa en otro metodo
    var parametros = {
        datos : datos
    };

    /*console.log(datos);
    console.log(JSON.stringify(parametros));
    console.log('ID de la clinica a actualizar es: ' + marker.id);*/

    var xhr = new XMLHttpRequest();
    xhr.open('PUT','http://localhost:8001/clinics/' + marker.id, false);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(parametros));

    console.log('A parsear el JSON: ' + xhr.responseText);
    let resultado = JSON.parse(xhr.responseText);
    console.log('Finalizo la llamada a la funcion de acutalizacion - ' + resultado.resultadosExitosos);

    if (resultado) {
        alert('Clinic was sucessfully reviewed, thank you!');
        $("#Loading").hide();
        console.log("Re-cargar pagina");

        xhr.open('GET','http://localhost:8001/clinics/' + marker.id, false);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify(parametros));

        console.log('Clinica actualizada: ' + xhr.responseText);
        resultado = JSON.parse(xhr.responseText);

        localStorage.setItem('clinica',JSON.stringify(armarClinica(marker.id, resultado)));
    }
    else {
        alert('レビューに問題が発生しました。 - There was a problem reviewing the clinic.');
        $("#Loading").hide();
        console.log("Re-cargar pagina");
    }

    location.assign('review');
}

function armarClinica(clinicId, resData) {
    console.log('Armar clinica');

    //Aqui generamos los objetos particulares con cada uno de sus atributos

    var clinica = { id: clinicId, type: "health"};

    for (i = 0; i < resData.results.bindings.length; i++) {
        var atributo = resData.results.bindings[i].atributo.value.split("#")[1];
        var valor = resData.results.bindings[i].valor.value;
        clinica[atributo] = valor; //Agregamos el valor a la clinica
    }

    clinica['position'] = new google.maps.LatLng(clinica.lat, clinica.long);
    console.log(clinica);
    clinica['title'] = clinica.name;
    clinica['description'] = clinica.address;

    return clinica;
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

function resetStars() {

    var starB = $('.starbox');

    ratingUsuarioFL = null;
    starB.starbox('destroy', null);

    //Regeneramos el rating
    starB.starbox({
        stars: 3, //Total de estrellas a mostrar
        buttons: 3, //Se coloca 3 para que los ratings sean 3
        average: ratingOriginal, //Valor inicial
        changeable: 'once',
        autoUpdateAverage: true,
        ghosting: true
    });

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

function clearInput() {
    resetThumbs(); //Resetear los pulgares
    resetStars(); //Resetear las estrellas
    verificarVisibilidad();
}