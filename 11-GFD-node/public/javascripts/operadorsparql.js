const {Client, Node, Text, Data, Triple} = require('virtuoso-sparql-client');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const ENDPOINT_LOCAL = 'http://localhost:8890/sparql';

//Usando el modulo virtuoso-sparql-client
function insertarSPARQLcliente() {

}

function insertarSPARQLxhr() {

    var data = "query=INSERT%20DATA%20%7B%20GRAPH%20%3Chttp%3A%2F%2Flod.mdg%2F%3E%20%7B%20%3Cd%3E%20%3Ce%3E%20%22NUEVA%20PRUEBA%202%20despues%20de%20Postm1231243124124BBB%22%7D%7D";

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log('Hubo alguna respuesta del servidor');
            console.log(this.responseText);
        }
    });

    xhr.open("POST", "http://localhost:8890/sparql-auth", false, 'gfd', 'muyseguro');
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("authorization", "Digest username=\"gfd\", realm=\"SPARQL\", nonce=\"\", uri=\"/sparql-auth\", response=\"32065bf962504d319fb65b727d146b0b\", opaque=\"\"");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send(data);
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
    var q = "INSERT DATA { GRAPH <http://lod.mdg/> { <d> <e> \"NUEVA PRUEBA 2 despues de PostmanAAAAAAAAAAAAAA\"}}" ;
    q = encodeURIComponent(q);

    var data = "query=" + q;

    /*
    * ===================
    * Intento de implementacion con http request

    var qs = require("querystring");
    var httpe = require("http");

    var options = {
        "method": "POST",
        "hostname": "localhost",
        "port": "8890",
        "path": "/sparql-auth",
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "authorization": "Digest username=\"gfd\", password=\"muyseguro\", realm=\"SPARQL\", nonce=\"\", uri=\"/sparql-auth\", response=\"32065bf962504d319fb65b727d146b0b\", opaque=\"\"",
            "cache-control": "no-cache",
            "postman-token": "dc5e8a3c-700a-38bd-45c6-5f2da7d9e1bb"
        }
    };

    var req = httpe.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
            console.log('=== Despues de push chunk ===');
            console.log(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log('RESPUESTA DEL SERVIDOR');
            console.log(body.toString());
        });
    });

    req.write(qs.stringify({ query: 'INSERT DATA { GRAPH <http://lod.mdg/> { <d> <e> "NUEVA PRUEBA 2 despues de PostmanAAAAAAAAAAAAAAAAAAB"}}' }));
    req.end();
    *
    * =========================
    */

    // var queryIn =  "http://127.0.0.1:8890/sparql-auth?query=" + encodeURIComponent(q) + "&format=application/json";
    /*var queryIn =  encodeURIComponent(q);
    // xhr.open("POST", "http://127.0.0.1:8890/sparql-auth", false, vuser, vpassword);
    console.log(queryIn);
    xhr.open("POST", "http://127.0.0.1:8890/sparql-auth/",false, vuser, vpassword);
    // xhr.open("POST", "/sparql-auth/",false, vuser, vpassword);

    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.setRequestHeader("Authorization","Digestbasic username=\"gfd\", realm=\"SPARQL\", nonce=\"\", uri=\"/sparql-auth\", response=\"32065bf962504d319fb65b727d146b0b\", opaque=\"\"");
    //var direcc = "query=" + encodeURIComponent(q);

    xhr.send("query=" + queryIn);*/
}

module.exports = {
    insertarSPARQL : function () {

        SaveClient = new Client(ENDPOINT_LOCAL);

        SaveClient.setOptions(
            "application/json",
            {lkd : "http://linkdata.org/property/rdf1s4853i"},
            "http://lod.mdg/"
        );

        SaveClient.getLocalStore().add(
            new Triple(
                "lkd:aurelio",
                "<creado>",
                new Text("Prueba del 14 de Julio","ja")
            )
        );

        SaveClient.store(true)
            .then((result => {
                console.log(JSON.stringify(result));
            }))
            .catch(console.log);

        //insertarSPARQLbase();
        //insertarSPARQLxhr();
    },

    querySPARQL : function (query, endpoint, format) {
        if(!format)
            format="application/json";

        if(!endpoint)
            endpoint = ENDPOINT_LOCAL;

        let xmlhttp = new XMLHttpRequest();
        let url = endpoint + "?query=" +encodeURIComponent(query)+"&format="+format;

        //console.log("URL2 es: " + url2);

        //TODO: La llamada en el servidor al final debe ser mediante un proxy para evitar problemas CORS
        xmlhttp.open("GET",url, false);
        xmlhttp.send();

        return JSON.parse(xmlhttp.responseText);
    },

    updateSPARQL : function (query, endpoint, format) {
        if(!format)
            format="application/json";

        if(!endpoint)
            endpoint = ENDPOINT_LOCAL;

        let xmlhttp = new XMLHttpRequest();
        let url = endpoint + "?query=" +encodeURIComponent(query)+"&format="+format;

        xmlhttp.open("GET",url, false);
        xmlhttp.send();

        return JSON.parse(xmlhttp.responseText);
    }
};