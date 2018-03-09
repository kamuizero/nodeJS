//Clase para la manipulacion de requests de la API rest para dar los resultados
const operadorSPQ = require('../operadorsparql');
const operadorMDB = require('../operadormongodb');
const operadorMSQL = require('../../../private/javascripts/operadormysql');
const DEFAULT_GRAPH = 'http://lod.mdg/';

function getAtribute(clinicId, atribute, grafo) {
    if (!grafo)
        grafo = 'http://lod.mdg/';
    let query = 'select * from <' + grafo + '> where { '+
        '<http://linkdata.org/resource/rdf1s4853i#' + clinicId +'>' +
        ' <http://linkdata.org/property/rdf1s4853i#' + atribute +
        '> ?o}';
    return operadorSPQ.querySPARQL(query);
}

function getMaxID() {
    let grafo = DEFAULT_GRAPH;

    let query = 'PREFIX xsd:<http://www.w3.org/2001/XMLSchema#> ' +
        'select ?maxid ' +
        'from <' + grafo + '> ' +
        'where { ?s rdfs:label ?o . BIND(xsd:integer(?o) AS ?maxid) FILTER(?maxid > 0) } ' +
        'ORDER BY DESC(?maxid) LIMIT 1';

    return operadorSPQ.querySPARQL(query);
}

function getMaxIDMDB() {
    operadorMDB.getMaxID();
}

function updateAtribute(clinicId, atribute, value, grafo) {

    if (!grafo)
        grafo = DEFAULT_GRAPH;

    let query = 'WITH <' + grafo + '> ' +
        'DELETE { <http://linkdata.org/resource/rdf1s4853i#' + clinicId + '> <http://linkdata.org/property/rdf1s4853i#' + atribute + '> ?o } ' +
        'INSERT { <http://linkdata.org/resource/rdf1s4853i#' + clinicId + '> <http://linkdata.org/property/rdf1s4853i#' + atribute + '> ' + value + '} ' +
        'WHERE ' +
        '{ <http://linkdata.org/resource/rdf1s4853i#' + clinicId + '> <http://linkdata.org/property/rdf1s4853i#' + atribute + '> ?o }';

    return operadorSPQ.updateSPARQL(query);
}

function insertClinic(clinicId, params, grafo) {

    if (!grafo)
        grafo = DEFAULT_GRAPH;

    let clinic = {
        id : clinicId, //id y label son iguales
        name: params.name,
        address: params.address,
        lat: params.lat,
        long: params.lng,
        label: clinicId, //label y id osn iguales, label es en Virtuoso
        doctorSpeaksEnglishTrue: params.doctorSpeaksEnglishTrue,
        doctorSpeaksEnglishFalse: params.doctorSpeaksEnglishFalse,
        doctorSpeaksChineseTrue : params.doctorSpeaksChineseTrue,
        doctorSpeaksChineseFalse: params.doctorSpeaksChineseFalse,
        doctorSpeaksKoreanTrue: params.doctorSpeaksKoreanTrue,
        doctorSpeaksKoreanFalse: params.doctorSpeaksKoreanFalse,
        doctorSpeaksSpanishTrue: params.doctorSpeaksSpanishTrue,
        doctorSpeaksSpanishFalse: params.doctorSpeaksSpanishFalse,
        doctorSpeaksOtherTrue: params.doctorSpeaksOtherTrue,
        doctorSpeaksOtherFalse: params.doctorSpeaksOtherFalse,

        staffSpeaksEnglishTrue : params.staffSpeaksEnglishTrue,
        staffSpeaksEnglishFalse : params.staffSpeaksEnglishFalse,
        staffSpeaksChineseTrue: params.staffSpeaksChineseTrue,
        staffSpeaksChineseFalse: params.staffSpeaksChineseFalse,
        staffSpeaksKoreanTrue: params.staffSpeaksKoreanTrue,
        staffSpeaksKoreanFalse: params.staffSpeaksKoreanFalse,
        staffSpeaksSpanishTrue: params.staffSpeaksSpanishTrue,
        staffSpeaksSpanishFalse: params.staffSpeaksSpanishFalse,
        staffSpeaksOtherTrue: params.staffSpeaksOtherTrue,
        staffSpeaksOtherFalse: params.staffSpeaksOtherFalse,

        FriendlyL1: params.FriendlyL1,
        FriendlyL2: params.FriendlyL2,
        FriendlyL3: params.FriendlyL3,

        ForeignLanguageExplanationTrue : params.ForeignLanguageTreatmentExplanationTrue,
        ForeignLanguageExplanationFalse : params.ForeignLanguageTreatmentExplanationFalse,
    };

    /*let query = 'PREFIX lkd:<http://linkdata.org/property/rdf1s4853i#> ' +
        'PREFIX lkdres:<http://linkdata.org/resource/rdf1s4853i#> ' +
        'INSERT INTO <' + grafo + '> ' +
        '{ ' +
        'lkdres:' + clinicId + ' lkd:address \"' + params.address + '\"@ja . ' +
        'lkdres:' + clinicId + ' lkd:name \"' + params.name + '\"@ja . ' +
        'lkdres:' + clinicId + ' <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ' + params.lat +  ' . ' +
        'lkdres:' + clinicId + ' <http://www.w3.org/2003/01/geo/wgs84_pos#long> ' + params.lng +  ' . ' +
        'lkdres:' + clinicId + ' <http://www.w3.org/2000/01/rdf-schema#label> \"' + clinicId +  '\"@ja . ' +

        'lkdres:' + clinicId + ' lkd:doctorSpeaksEnglishTrue \"' + params.doctorSpeaksEnglishTrue + '\" . ' +
        'lkdres:' + clinicId + ' lkd:doctorSpeaksEnglishFalse \"' + params.doctorSpeaksEnglishFalse + '\" . ' +

        'lkdres:' + clinicId + ' lkd:staffSpeaksEnglishTrue \"' + params.staffSpeaksEnglishTrue + '\" . ' +
        'lkdres:' + clinicId + ' lkd:staffSpeaksEnglishFalse \"' + params.staffSpeaksEnglishFalse + '\" . ' +

        'lkdres:' + clinicId + ' lkd:doctorSpeaksChineseTrue \"' + params.doctorSpeaksChineseTrue + '\" . ' +
        'lkdres:' + clinicId + ' lkd:doctorSpeaksChineseFalse \"' + params.doctorSpeaksChineseFalse + '\" . ' +

        'lkdres:' + clinicId + ' lkd:staffSpeaksChineseTrue \"' + params.staffSpeaksChineseTrue + '\" . ' +
        'lkdres:' + clinicId + ' lkd:staffSpeaksChineseFalse \"' + params.staffSpeaksChineseFalse + '\" . ' +

        'lkdres:' + clinicId + ' lkd:doctorSpeaksKoreanTrue \"' + params.doctorSpeaksKoreanTrue + '\" . ' +
        'lkdres:' + clinicId + ' lkd:doctorSpeaksKoreanFalse \"' + params.doctorSpeaksKoreanFalse + '\" . ' +

        'lkdres:' + clinicId + ' lkd:staffSpeaksKoreanTrue \"' + params.staffSpeaksKoreanTrue + '\" . ' +
        'lkdres:' + clinicId + ' lkd:staffSpeaksKoreanFalse \"' + params.staffSpeaksKoreanFalse + '\" . ' +

        'lkdres:' + clinicId + ' lkd:doctorSpeaksSpanishTrue \"' + params.doctorSpeaksSpanishTrue + '\" . ' +
        'lkdres:' + clinicId + ' lkd:doctorSpeaksSpanishFalse \"' + params.doctorSpeaksSpanishFalse + '\" . ' +

        'lkdres:' + clinicId + ' lkd:staffSpeaksSpanishTrue \"' + params.staffSpeaksSpanishTrue + '\" . ' +
        'lkdres:' + clinicId + ' lkd:staffSpeaksSpanishFalse \"' + params.staffSpeaksSpanishFalse + '\" . ' +

        'lkdres:' + clinicId + ' lkd:doctorSpeaksOtherTrue \"' + params.doctorSpeaksOtherTrue + '\" . ' +
        'lkdres:' + clinicId + ' lkd:doctorSpeaksOtherFalse \"' + params.doctorSpeaksOtherFalse + '\" . ' +

        'lkdres:' + clinicId + ' lkd:staffSpeaksOtherTrue \"' + params.staffSpeaksOtherTrue + '\" . ' +
        'lkdres:' + clinicId + ' lkd:staffSpeaksOtherFalse \"' + params.staffSpeaksOtherFalse + '\" . ' +

        'lkdres:' + clinicId + ' lkd:FriendlyL1 \"' + params.FriendlyL1 + '\" . ' +
        'lkdres:' + clinicId + ' lkd:FriendlyL2 \"' + params.FriendlyL2 + '\" . ' +
        'lkdres:' + clinicId + ' lkd:FriendlyL3 \"' + params.FriendlyL3 + '\" . ' +

        'lkdres:' + clinicId + ' lkd:ForeignLanguageTreatmentExplanationTrue \"' + params.ForeignLanguageTreatmentExplanationTrue + '\" . ' +
        'lkdres:' + clinicId + ' lkd:ForeignLanguageTreatmentExplanationFalse \"' + params.ForeignLanguageTreatmentExplanationFalse + '\" . ' +
        ' }';*/

    //console.log(query);

    console.log(clinic);

    return operadorMDB.insertClinic(clc);
    //return operadorSPQ.insertSPARQL(query);
}

module.exports = {

    getAllClinics  : function (req, res) {
        //Consultamos las clinicas
        console.log('Buscar todas las clinicas');

        let grafo = DEFAULT_GRAPH;

        let query = "PREFIX lkd:<http://linkdata.org/property/rdf1s4853i> " +
            "select * from <" + grafo + "> " +
            "where { " +
            "?clinica ?atributo ?valor. " +
            "FILTER(!strstarts(str(?clinica), str(lkd:)) " +
            "&& str(?clinica) != <>) " +
            "}" +
            " ORDER BY DESC (?clinica)";
        return operadorSPQ.querySPARQL(query);
    },

    getAllClinicsMSQL  : function (req, res) {
        //Consultamos las clinicas
        console.log('Buscar todas las clinicas MSQL');
        operadorMSQL.buscarTodasClinicas(res);
    },

    getClinic : function(clinicId) {
        console.log('Buscar clinica: ' + clinicId);

        let grafo = DEFAULT_GRAPH;
        let query ='select * from <' + grafo + '> ' +
            'where { <http://linkdata.org/resource/rdf1s4853i#' + clinicId + '> ?atributo ?valor}';

        let clinica = operadorSPQ.querySPARQL(query);
        console.log(clinica);

        return clinica;
    },

    insertClinic : function(req, res) {
        //Primero buscamos el ID mas alto
        console.log('Insertar Clinica');
        //let id = getMaxID(); //VIRTUOSO
        let id = getMaxIDMDB();
        let datosClinica = req.body.datos;
        let resultadoInsert = 0;

        if (id) {
            //id = parseInt(id.results.bindings[0].maxid.value); //Aqui tenemos el ID
            id++;
            console.log('ID de nueva clinica a crear es: ' + id);
            console.log(datosClinica);

            //Realizar el insert
            resultadoInsert = insertClinic(id,datosClinica);

            if (resultadoInsert) {
                resultadoInsert = resultadoInsert.results.bindings[0]['callret-0'].value.toString();

                //Chequear aqui lo de la palabra INSERT
                if ( (resultadoInsert.includes('Insert')) && (resultadoInsert.includes('done')) ) {
                    console.log('Clinica insertada - ' + resultadoInsert);
                    resultadoInsert = 1;
                }
                else {
                    console.log('Error al insertar la clinica');
                    resultadoInsert = 0;
                }
            }

        } else {
            console.error('Error al obtener ID maximo');
        }

        return JSON.parse('{"resultado" : ' + resultadoInsert + "}")
    },

    insertClinicMSQL : function (req, res) {
        console.log('Insertar Clinica MySQL');
        let datosClinica = req.body.datos;
        let params = {
            name: datosClinica.name,
            address: datosClinica.address,
            lat: datosClinica.lat,
            long: datosClinica.lng,
            label: 1, //Por definir
            doctorSpeaksEnglishTrue: datosClinica.doctorSpeaksEnglishTrue,
            doctorSpeaksEnglishFalse: datosClinica.doctorSpeaksEnglishFalse,
            doctorSpeaksChineseTrue: datosClinica.doctorSpeaksChineseTrue,
            doctorSpeaksChineseFalse: datosClinica.doctorSpeaksChineseFalse,
            doctorSpeaksKoreanTrue: datosClinica.doctorSpeaksKoreanTrue,
            doctorSpeaksKoreanFalse: datosClinica.doctorSpeaksKoreanFalse,
            doctorSpeaksSpanishTrue: datosClinica.doctorSpeaksSpanishTrue,
            doctorSpeaksSpanishFalse: datosClinica.doctorSpeaksSpanishFalse,
            doctorSpeaksOtherTrue: datosClinica.doctorSpeaksOtherTrue,
            doctorSpeaksOtherFalse: datosClinica.doctorSpeaksOtherFalse,
            staffSpeaksEnglishTrue: datosClinica.staffSpeaksEnglishTrue,
            staffSpeaksEnglishFalse: datosClinica.staffSpeaksEnglishFalse,
            staffSpeaksChineseTrue: datosClinica.staffSpeaksChineseTrue,
            staffSpeaksChineseFalse: datosClinica.staffSpeaksChineseFalse,
            staffSpeaksKoreanTrue: datosClinica.staffSpeaksKoreanTrue,
            staffSpeaksKoreanFalse: datosClinica.staffSpeaksKoreanFalse,
            staffSpeaksSpanishTrue: datosClinica.staffSpeaksSpanishTrue,
            staffSpeaksSpanishFalse: datosClinica.staffSpeaksSpanishFalse,
            staffSpeaksOtherTrue: datosClinica.staffSpeaksOtherTrue,
            staffSpeaksOtherFalse: datosClinica.staffSpeaksOtherFalse,
            friendlyL1: datosClinica.FriendlyL1,
            friendlyL2: datosClinica.FriendlyL2,
            friendlyL3: datosClinica.FriendlyL3,
            foreignLanguageExplanationTrue: datosClinica.ForeignLanguageTreatmentExplanationTrue,
            foreignLanguageExplanationFalse: datosClinica.ForeignLanguageTreatmentExplanationFalse
        };

        operadorMSQL.insertClinic(params, req, res);
    },

    insertClinicMDB : function(req, res) {
        //Primero buscamos el ID mas alto
        console.log('Insertar Clinica');

        let id = getMaxIDMDB();
        let datosClinica = req.body.datos;
        let resultadoInsert = 0;

        //Esta linea es solo para cuestiones de PRUEBA
        id = false; //Eliminar esta linea cuando la logica del MAX ID este funcionando

        if (id) {
            id++;
            console.log('ID de nueva clinica a crear es: ' + id);
            console.log(datosClinica);

            //Realizar el insert
            resultadoInsert = insertClinic(id,datosClinica);

            if (resultadoInsert) {
                console.log('Clinica insertada - ' + resultadoInsert);
                resultadoInsert = 1;
            }
            else {
                console.log('Error al insertar la clinica');
                resultadoInsert = 0;
            }
        } else {
            console.error('Error al obtener ID maximo');
        }

        return JSON.parse('{"resultado" : ' + resultadoInsert + "}");
    },

    updateClinicMSQL : function (req, res) {
        console.log('Update Clinic MySQL');
        let datosClinica = req.body.datos;
        let idclinica = req.params.id;
        console.log(datosClinica);
        console.log('Id de la clinica es: ', idclinica);
        datosClinica.idclinic = idclinica;

        operadorMSQL.updateClinic(datosClinica, req, res);
    }
    ,

    updateClinic : function (req, res) {
        let grafo = DEFAULT_GRAPH;
        let cambios = req.body.datos;
        let clinica = req.params.id;
        let updatesExitosos = 0;

        console.log(cambios);
        //Primero buscamos el valor del voto actual de la clinica

        for (i=0; i< cambios.length; i++) {
            //Buscamos el valor actual y luego mandamos a actualizar con +1
            let valorAct = getAtribute(clinica, cambios[i].atributo, grafo);

            if (valorAct) {
                valorAct = parseInt(valorAct.results.bindings[0].o.value);
                let valorNuevo = valorAct + 1;

                //Actualizar
                let resultadoUpdate = updateAtribute(clinica,cambios[i].atributo, valorNuevo, grafo);

                if (resultadoUpdate) {
                    resultadoUpdate = resultadoUpdate.results.bindings[0]['callret-0'].value.toString();

                    if ( (resultadoUpdate.includes('Modify')) && (resultadoUpdate.includes('done')) ) {
                        console.log('Valor Actualizado - ' + cambios[i].atributo);
                        updatesExitosos++;
                    }
                    else {
                        console.log('Error al actualizar ' + cambios[i].atributo);
                        updatesExitosos--;
                    }
                }
            } else { //Ocurrio algun error
                console.error('Error al ejecutar el update, no se consiguio atributo');
            }
        }

        return JSON.parse('{"resultadosExitosos" : ' + updatesExitosos + "}");
    }
};

