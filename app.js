//This Requires kafka and zookeeper running. 
//http://kafka.apache.org/documentation.html#quickstart Has the links to download these and instructions on how to start.

//This is a test application that uses Kafka. Upon reciving a post request it sends a message though kafka. There is an event lister that
//then recives these messages and ouputs them to the console

//The post request expects an event header. It can be either add, update, delete. Any other value will be handled by the unrecognized function 
//The request must also have a body containing the data property

//All of the kafka logic is abstracted out into eventBroker.js and eventHandler.js

var when = require('when'); //when for promises

//setup producer
var sendEvent = require('./eventBroker')('localhost:9092', "freewayEventTest", console.log);

//express boilerplate
var express = require('express');
var bodyParser = require('body-parser');
app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//functions to be called on the recival fo a spesific event
function onEvent(event) {
    sendEvent(event.event, event.data);
}

//create a channel to this service
app.post('/', function(req, res) {
    require("./listener")('localhost:9092', req.body.topic, onEvent, __dirname + '/kafka-offsets', console.log);
    res.status(200).send('Acepting events');
});

//start server
app.listen(8083);