/*
 *  Funciones para realizar la insercion al grafo indicado de la data
 */
const csv = require("fast-csv");
const request = require('request');
const operadorSPARQL = require('../javascripts/operadorsparql');
var clinicasTemp = [];

function obtenerCSV(ruta) {

    console.log('La ruta es: ' + ruta);
    //全国地方公共団体コード	識別値	種別	施設名称	施設名称（カナ）	通称	住所表記	郵便番号	緯度	経度	連絡先名称	電話番号	Webサイト	診療科目
    //{'code','type_code','type','name','name_kana','tsuufu','address','zipcode','lat','lng','contact_name','phone','website','specialty'}
    clinicasTemp = [];

    csv
        // .fromStream(request(ruta), {headers: true})
        .fromPath(ruta, {headers: true})
        .on("data", function(data){
            console.log('nueva data');

            //Solo necesitamos el nombre, direccion, latitud, longitud
            let clinica = {};
            clinica.name =  data.施設名称 + '（' + data["施設名称（カナ）"] + '）';

            if (data.診療科目) {
                clin.name += '－'+data.診療科目;
            }

            clinica.address = data.住所表記;

            if (data.郵便番号) {
                clinica.address = '〒'+data.郵便番号+'　' + clinica.address;
            }

            if (data.電話番号){
                clinica.address += '（' + data.電話番号 + '）';
            }

            if ((data.Webサイト) && (data.Webサイト!='-')){
                clinica.address += '　ウェブサイト：'+ data.Webサイト;
            }

            clinica.lat = data.緯度;
            clinica.lng = data.経度;

            console.log(clinica);
            clinicasTemp.push(clinica);
        })
        .on("end", function(){
            console.log(">>> FIN DEL ARCHIVO <<<");
            console.log('Cantidad de clinicas: ' + clinicasTemp.length);
        });
}

function insertarClinica(clinica) {

    let grafo = '';
    let endpoint = '';

    let query = 'PREFIX lkd:<http://linkdata.org/property/rdf1s4853i#> ' +
        'PREFIX lkdres:<http://linkdata.org/resource/rdf1s4853i#> ' +
        'INSERT INTO <' + grafo + '> ' +
        '{ ' +
        'lkdres:' + clinicId + ' lkd:address \"' + clinica.address + '\"@ja . ' +
        'lkdres:' + clinicId + ' lkd:name \"' + clinica.name + '\"@ja . ' +
        'lkdres:' + clinicId + ' <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ' + clinica.lat +  ' . ' +
        'lkdres:' + clinicId + ' <http://www.w3.org/2003/01/geo/wgs84_pos#long> ' + clinica.lng +  ' . ' +
        'lkdres:' + clinicId + ' <http://www.w3.org/2000/01/rdf-schema#label> \"' + clinicId +  '\"@ja . ' +

        'lkdres:' + clinicId + ' lkd:doctorSpeaksEnglishTrue \"0\" . ' +
        'lkdres:' + clinicId + ' lkd:doctorSpeaksEnglishFalse \"0\" . ' +

        'lkdres:' + clinicId + ' lkd:staffSpeaksEnglishTrue \"0\" . ' +
        'lkdres:' + clinicId + ' lkd:staffSpeaksEnglishFalse \"0\" . ' +

        'lkdres:' + clinicId + ' lkd:doctorSpeaksChineseTrue \"0\" . ' +
        'lkdres:' + clinicId + ' lkd:doctorSpeaksChineseFalse \"0\" . ' +

        'lkdres:' + clinicId + ' lkd:staffSpeaksChineseTrue \"0\" . ' +
        'lkdres:' + clinicId + ' lkd:staffSpeaksChineseFalse \"0\" . ' +

        'lkdres:' + clinicId + ' lkd:doctorSpeaksKoreanTrue \"0\" . ' +
        'lkdres:' + clinicId + ' lkd:doctorSpeaksKoreanFalse \"0\" . ' +

        'lkdres:' + clinicId + ' lkd:staffSpeaksKoreanTrue \"0\" . ' +
        'lkdres:' + clinicId + ' lkd:staffSpeaksKoreanFalse \"0\" . ' +

        'lkdres:' + clinicId + ' lkd:doctorSpeaksSpanishTrue \"0\" . ' +
        'lkdres:' + clinicId + ' lkd:doctorSpeaksSpanishFalse \"0\" . ' +

        'lkdres:' + clinicId + ' lkd:staffSpeaksSpanishTrue \"0\" . ' +
        'lkdres:' + clinicId + ' lkd:staffSpeaksSpanishFalse \"0\" . ' +

        'lkdres:' + clinicId + ' lkd:doctorSpeaksOtherTrue \"0\" . ' +
        'lkdres:' + clinicId + ' lkd:doctorSpeaksOtherFalse \"0\" . ' +

        'lkdres:' + clinicId + ' lkd:staffSpeaksOtherTrue \"0\" . ' +
        'lkdres:' + clinicId + ' lkd:staffSpeaksOtherFalse \"0\" . ' +

        'lkdres:' + clinicId + ' lkd:FriendlyL1 \"0\" . ' +
        'lkdres:' + clinicId + ' lkd:FriendlyL2 \"0\" . ' +
        'lkdres:' + clinicId + ' lkd:FriendlyL3 \"0\" . ' +

        'lkdres:' + clinicId + ' lkd:ForeignLanguageTreatmentExplanationTrue \"0\" . ' +
        'lkdres:' + clinicId + ' lkd:ForeignLanguageTreatmentExplanationFalse \"0\" . ' +
        ' }';

    operadorSPARQL.insertSPARQL(query,endpoint);
}

module.exports = {
    cargarCSV : function(ruta) {
        obtenerCSV(ruta);
        console.log('Finalizo carga de CSV');
    }
};