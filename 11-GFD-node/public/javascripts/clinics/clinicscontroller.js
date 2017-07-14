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
            }
        }

        return JSON.parse('{"resultadosExitosos" : ' + updatesExitosos + "}");
    }
};

