
$(function () {

    // const socket = new WebSocket('ws://localhost:3000');
    const socket = new WebSocket('ws://192.168.1.156:3000');

    socket.addEventListener('open', function (event){ //Evento que se ejecuta al abrir el Socket - Crear la conexion
        enviarMensaje('inicio','Inicio de conexion');
    });

    socket.addEventListener('message', function(event){
        console.log('Mensaje recibido del servidor: ' + event.data);
        $('#messages').append($('<li>').text(event.data));
    });

    $('form').submit(function(){

        enviarMensaje('mensaje', $('#m').val());

        //socket.send($('#m').val());

        $('#m').val('');
        return false;
    });

    function enviarMensaje(tipo, mensaje){
        let capsula = {};
        capsula.tipo = tipo;
        capsula.mensaje = mensaje;
        capsula.cliente = 'web';
        socket.send(JSON.stringify(capsula));
    }

});

function respuestaServer(xmlHttp) {
    console.log(xmlHttp);
    //console.log(JSON.parse(xmlHttp.response));
    console.log('Response Text', xmlHttp.responseText);
}

function pruebaBoton() {
    // let ItemJSON = '[ {"Id": 1, "ProductID": "1", "Quantity": 1,},  {    "Id": 1,    "ProductID": "2",    "Quantity": 2,  }]';
    //
    // let xmlHttp = new XMLHttpRequest();
    // xmlHttp.open('GET', 'http://localhost:3000/orders/prueba', true);
    // xmlHttp.setRequestHeader("Content-Type", "application/json");
    // //xmlHttp.setRequestHeader('Authorization', 'Basic ' + window.btoa('apiusername:apiuserpassword')); //in prod, you should encrypt user name and password and provide encrypted keys here instead
    // //xmlHttp.send(ItemJSON);
    // xmlHttp.onreadystatechange = respuestaServer(xmlHttp);
    // xmlHttp.send();

    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://localhost:3000/orders/prueba', true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                respuestaServer(xhr);
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send();
    // var prueba = JSON.parse(xhr.responseText);
    // console.log(prueba.texto);
    // alert(prueba.texto);
}

