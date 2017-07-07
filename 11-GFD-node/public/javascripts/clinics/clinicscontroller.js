//Clase para la manipulacion de requests de la API rest para dar los resultados
const operadorSPQ = require('../operadorsparql');

exports.getAllClinics  = function (req, res) {
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
};
