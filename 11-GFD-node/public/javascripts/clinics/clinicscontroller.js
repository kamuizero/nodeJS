//Clase para la manipulacion de requests de la API rest para dar los resultados
const operadorSPQ = require('../operadorsparql');

function getAtribute(grafo, clinicId, atribute) {
    if (!grafo)
        grafo = 'http://lod.mdg/';
    let query = 'select * from <' + grafo + '> where { '+
        '<http://linkdata.org/resource/rdf1s4853i#' + clinicId +'>' +
        ' <http://linkdata.org/property/rdf1s4853i#' + atribute +
        '> ?o}';
    let valor = operadorSPQ.querySPARQL(query);
    console.log('Valor del Atributo es: ' + valor);
    return valor;
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
        let clinicas = operadorSPQ.querySPARQL(query);
        //assert(null,clinicas);
        return clinicas;
    },

    updateClinic : function (req, res) {
        console.log('Actualizar clinica');

        let grafo = 'http://lod.mdg/';
        let cambios = req.body.datos;
        let clinica = req.params.id;

        console.log(cambios);
        console.log(clinica);

        //Por cada cambio, hay que actualizar

        let prueba = getAtribute('http://lod.mdg/',clinica,'ForeignLanguageTreatmentExplanationFalse');

        console.log('Valor de PRUEBA despues de ejecutar el procedimiento es: ' + prueba);

        return prueba;

        //Primero buscamos el valor del voto actual de la clinica

        /*for (i=0; i< cambios.length; i++) {

        }*/

    }
};

