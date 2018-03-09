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

function buscarClinicaId(id, response) {
    let query = "SELECT * from sample.clinic WHERE idclinic = ?";

    con.query(query, [id], function(err, rows) {
        if (err) {
            console.log('Error: ' + err);
            throw err;
        }
        console.log(rows);
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
    // let query = 'UPDATE sample.clinic SET ' + atributo + ' =  ' + atributo + ' + 1 WHERE idclinic = ' + clc.idclinic;
    let query = 'UPDATE sample.clinic SET ? WHERE ? ' ;

    console.log(query);
    console.log(clc);

    let datosQuery = clc.map( (val) => {
                        console.log(Object.values(val));
                        let nombre = Object.values(val)[0];
                        let valor = Object.values(val)[1];
                        let ret = {};
                        ret[nombre] = valor;
                        return ret;
                        });

    console.log(datosQuery);
    console.log('-----');

    let arrDos = {};
    let tempKey, tempValue;

    for (let i = 0; i < datosQuery.length; i++) {
        tempKey = Object.keys(datosQuery[i])[0];
        tempValue = Object.values(datosQuery[i])[0];

        switch (tempKey) {

            case 'FriendlyL1' :
                tempKey = 'friendlyL1';
                break;
            case 'FriendlyL2' :
                tempKey = 'friendlyL2';
                break;
            case 'FriendlyL3' :
                tempKey = 'friendlyL3';
                break;
            case 'ForeignLanguageTreatmentExplanationFalse' :
                tempKey = 'foreignLanguageExplanationFalse';
                break;
            case 'ForeignLanguageTreatmentExplanationTrue' :
                tempKey = 'foreignLanguageExplanationTrue';
                break;
            default : break;
        }
        arrDos[tempKey] = tempValue;
    }

    console.log(arrDos);

    datosQuery = arrDos;

    //let datosQuery = { doctorSpeaksEnglishTrue : 99};

    //console.log([datosQuery, {idclinic : clc.idclinic}]);

    con.query(query, [datosQuery, {idclinic : clc.idclinic}], function (error, rows, fields) {
        if (error) {
            console.log('Error: ' + error);
            response.send(JSON.parse('{"resultado": -1}'));
            throw error;
        }

        console.log('Resultado: ');
        console.log(rows);
        response.send(JSON.parse('{"resultadosExitosos" : ' + rows.affectedRows + "}"));
    });
}

module.exports = {

    buscarTodasClinicas: function (res) {
        console.log("Leer clinicas");
        buscarClinicas(res);
    },

    buscarClinica: function (clc, res) {
        console.log("Buscar clinica");
        buscarClinicaId(clc, res);
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