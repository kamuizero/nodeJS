const {Client, Node, Text, Data, Triple} = require('virtuoso-sparql-client');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

//Usando el modulo virtuoso-sparql-client
function insertarSPARQLcliente() {

}

//Usando el modulo httpxmlrequest para la autenticacion controlada
function insertarSPARQLbase() {
    var vgraphuri   = "http://lod.mdg/"; //El grafo debe ser sin el slash al final para el insert
    var vuser       = 'gfd';
    // var vuser       = 'gfd';
    var vpassword   = 'muyseguro';
    // var vpassword   = 'muyseguro';

    /*var sujeto = 'clinica-999',
        predicado = 'propiedad-label',
        objeto = '999';*/

    //var q = "INSERT INTO GRAPH <" + vgraphuri + "> { <" + sujeto + "> <" + predicado + "> <" + objeto + ">  . } " ;
    var q = "INSERT DATA { GRAPH <http://lod.mdg/> { <d> <e> \"NUEVA PRUEBA 2 despues de Postman\"}}" ;

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange=function()
    {
        if (xhr.readyState==4 && xhr.status==200)
        {
            //alert(xhr.responseText);
            console.log('Estatus ' + xhr.status + ' Mensaje ' + xhr.responseText);
        }
        if (xhr.readyState==4 && xhr.status==401)
        {
            //Problema de autenticacion
            console.log('Estatus ' + xhr.status + ' Mensaje ' + xhr.responseText);
        }
        if (xhr.readyState==4 && xhr.status==500)
        {
            console.log('Estatus ' + xhr.status + ' Mensaje ' + xhr.responseText);
        }
        if (xhr.readyState==4 && xhr.status==400)
        {
            console.log('Estatus ' + xhr.status + ' Mensaje ' + xhr.responseText);
        }
    };

    // var queryIn =  "http://127.0.0.1:8890/sparql-auth?query=" + encodeURIComponent(q) + "&format=application/json";
    var queryIn =  encodeURIComponent(q);
    // xhr.open("POST", "http://127.0.0.1:8890/sparql-auth", false, vuser, vpassword);
    console.log(queryIn);
    xhr.open("POST", "http://127.0.0.1:8890/sparql-auth/",false, vuser, vpassword);
    // xhr.open("POST", "/sparql-auth/",false, vuser, vpassword);

    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.setRequestHeader("Authorization","Digest username=\"gfd\", realm=\"SPARQL\", nonce=\"\", uri=\"/sparql-auth\", response=\"32065bf962504d319fb65b727d146b0b\", opaque=\"\"");
    //var direcc = "query=" + encodeURIComponent(q);

    xhr.send("query=" + queryIn);
}

module.exports = {
    insertarSPARQL : function () {

        /*SaveClient = new Client("http://localhost:8890/sparql");

        SaveClient.setOptions(
            "application/json",
            {lkd : "http://linkdata.org/property/rdf1s4853i"},
            "http://lod.mdg/"
        );

        SaveClient.getLocalStore().add(
            new Triple(
                "lkd:aurelio",
                "<creado>",
                new Text("Prueba en un rato nuevo","ja")
            )
        );

        SaveClient.store(true)
            .then((result => {
                console.log(JSON.stringify(result));
            }))
            .catch(console.log);*/
        insertarSPARQLbase();
    }


};