const mySQL = require('mysql');

const con = mySQL.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '4081'
});

con.connect((err) => {
   if (err) {
       console.log('Error de conexion a la Base de Datos');
       return;
   }
   console.log('Conexion establecida con la Base de Datos');
});

function buscarMaxID() {
    let query = "SELECT MAX(idclinic) FROM sample.clinic";
    con.query(query, (err,rows) => {
        if (err) throw err;

        console.log('Valor maximo de ID es: ' + rows);
        return rows[0].idclinic;
    });
}

function buscarClinicas(response) {
    let query = "SELECT * from sample.clinic";

    con.query(query, function(err, rows, fields) {
        if (err) {
            console.log('Error: ' + err);
            throw err;
        }
        response.send(rows);
    });
}

function insertarClinica(clc, request, response) {
    let query = "INSERT INTO sample.clinic SET ?";
    /*let params = {
        name: 'テストクリニック',
        address: '名古屋市昭和区妙見町',
        lat: 35.181,
        long: 136.906,
        label: 5,
        doctorSpeaksEnglishTrue: 1,
        doctorSpeaksEnglishFalse: 0,
        doctorSpeaksChineseTrue: 0,
        doctorSpeaksChineseFalse: 0,
        doctorSpeaksKoreanTrue: 0,
        doctorSpeaksKoreanFalse: 0,
        doctorSpeaksSpanishTrue: 1,
        doctorSpeaksSpanishFalse: 0,
        doctorSpeaksOtherTrue: 0,
        doctorSpeaksOtherFalse: 0,
        staffSpeaksEnglishTrue: 1,
        staffSpeaksEnglishFalse: 0,
        staffSpeaksChineseTrue: 0,
        staffSpeaksChineseFalse: 0,
        staffSpeaksKoreanTrue: 0,
        staffSpeaksKoreanFalse: 0,
        staffSpeaksSpanishTrue: 1,
        staffSpeaksSpanishFalse: 0,
        staffSpeaksOtherTrue: 0,
        staffSpeaksOtherFalse: 0,
        friendlyL1: 0,
        friendlyL2: 0,
        friendlyL3: 1,
        foreignLanguageExplanationTrue: 1,
        foreignLanguageExplanationFalse: 0
    };*/

    con.query(query, clc, function (error, rows, fields) {
        if (error) {
            console.log('Error: ' + error);
            response.send(JSON.parse('{"resultado": -1}'));
            throw error;
        }

        console.log('Resultado: ');
        console.log(rows);
        response.send(JSON.parse('{"resultado" : ' + rows.insertId + "}"));
    });
}

function actualizarClinica(clc, request, response) {

    /* Preparamos el query de actualizacion */
    let atributo = 'doctorSpeaksEnglishTrue';
    let query = 'UPDATE sample.clinic SET ' + atributo + ' =  ' + atributo + ' + 1 WHERE idclinic = ' + clc.idclinic;

    console.log(query);


    con.query(query, clc, function (error, rows, fields) {
        if (error) {
            console.log('Error: ' + error);
            response.send(JSON.parse('{"resultado": -1}'));
            throw error;
        }

        console.log('Resultado: ');
        console.log(rows);
        response.send(JSON.parse('{"resultado" : ' + rows.insertId + "}"));
    });
}

module.exports = {

    buscarTodasClinicas: function (res) {
        console.log("Leer clinicas");
        buscarClinicas(res);
    },

    insertClinic : function(clc, request, response) {
        insertarClinica(clc, request, response);
    },

    getMaxID : function() {
        //Llamar al procedimiento

        console.log("A buscar el ID...");
        let result = buscarMaxID();
        console.log('Finalizo el buscar ID ' + result + ' . Ese es el resultado.');
    },

    updateClinic : function(clc, request, response) {
        console.log("Actualizar clinica");
        actualizarClinica(clc, request, response);
    }

};