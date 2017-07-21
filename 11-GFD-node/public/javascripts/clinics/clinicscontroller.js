//Clase para la manipulacion de requests de la API rest para dar los resultados
const operadorSPQ = require('../operadorsparql');

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
    let grafo = 'http://lod.mdg/';

    let query = 'PREFIX xsd:<http://www.w3.org/2001/XMLSchema#> ' +
        'select ?maxid ' +
        'from <' + grafo + '> ' +
        'where { ?s rdfs:label ?o . BIND(xsd:integer(?o) AS ?maxid) FILTER(?maxid > 0) } ' +
        'ORDER BY DESC(?maxid) LIMIT 1';

    return operadorSPQ.querySPARQL(query);
}

function updateAtribute(clinicId, atribute, value, grafo) {

    if (!grafo)
        grafo = 'http://lod.mdg/';

    let query = 'WITH <' + grafo + '> ' +
        'DELETE { <http://linkdata.org/resource/rdf1s4853i#' + clinicId + '> <http://linkdata.org/property/rdf1s4853i#' + atribute + '> ?o } ' +
        'INSERT { <http://linkdata.org/resource/rdf1s4853i#' + clinicId + '> <http://linkdata.org/property/rdf1s4853i#' + atribute + '> ' + value + '} ' +
        'WHERE ' +
        '{ <http://linkdata.org/resource/rdf1s4853i#' + clinicId + '> <http://linkdata.org/property/rdf1s4853i#' + atribute + '> ?o }';

    return operadorSPQ.updateSPARQL(query);
}

function insertClinic(clinicId, params, grafo) {

    if (!grafo)
        grafo = 'hhtp://lod.mdg/';

    let query = 'PREFIX lkd:<http://linkdata.org/property/rdf1s4853i> ' +
        'lkdres:<http://linkdata.org/resource/rdf1s4853i> ' +
        'INSERT INTO <' + grafo + '> ' +
        '{ ' +
        '<lkdres:' + clinicId + '> <lkd:address> \"' + params.address + '\" . ' +
        '<lkdres:' + clinicId + '> <lkd:name> \"' + params.name + '\" . ' +
        '<lkdres:' + clinicId + '> <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ' + params.lat +  ' . ' +
        '<lkdres:' + clinicId + '> <http://www.w3.org/2003/01/geo/wgs84_pos#lng> ' + params.lat +  ' . ' +
        '<lkdres:' + clinicId + '> <http://www.w3.org/2000/01/rdf-schema#label> \"' + clinicId +  '\" . ' +

        '<lkdres:' + clinicId + '> <lkd:doctorSpeaksEnglishTrue> \"' + params.doctorSpeaksEnglishTrue + '\" . ' +
        '<lkdres:' + clinicId + '> <lkd:doctorSpeaksEnglishFalse> \"' + params.doctorSpeaksEnglishTrue + '\" . ' +

        '<lkdres:' + clinicId + '> <lkd:staffSpeaksEnglishTrue> \"' + params.doctorSpeaksEnglishTrue + '\" . ' +
        '<lkdres:' + clinicId + '> <lkd:staffSpeaksEnglishFalse> \"' + params.doctorSpeaksEnglishTrue + '\" . ' +
        //Seguir con los demas atributos
        ' }';
}

module.exports = {

    getAllClinics  : function (req, res) {
        //Consultamos las clinicas
        console.log('Buscar todas las clinicas');

        let grafo = 'http://lod.mdg/';
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

    getClinic : function(clinicId) {
        console.log('Buscar clinica: ' + clinicId);

        let grafo = 'http://lod.mdg/';
        let query ='select * from <' + grafo + '> ' +
            'where { <http://linkdata.org/resource/rdf1s4853i#' + clinicId + '> ?atributo ?valor}';

        let clinica = operadorSPQ.querySPARQL(query);
        console.log(clinica);

        return clinica;
    },

    insertClinic : function(req, res) {
        //Primero buscamos el ID mas alto
        console.log('Insertar Clinica');
        let id = getMaxID();
        let datosClinica = req.body.datos;
        let resultadoInsert = 0;

        if (id) {
            id = parseInt(id.results.bindings[0].maxid.value); //Aqui tenemos el ID
            id++;
            console.log('ID de nueva clinica a crear es: ' + id);
            console.log(datosClinica);

            //Realizar el insert
            //let resultadoInsert = insertClinic(); //clinica,cambios[i].atributo, valorNuevo, grafo);


        } else {
            console.error('Error al obtener ID maximo');
        }

        return JSON.parse('{"resultado" : ' + resultadoInsert + "}")
    },

    updateClinic : function (req, res) {
        let grafo = 'http://lod.mdg/';
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

