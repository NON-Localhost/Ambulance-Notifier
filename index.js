// Importing express module
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
const { lat , lon } = req.body;
const { authorization } = req.headers;

console.log( "Latitude" , lat )
console.log( "Longitute" , lon )
res.send({
	lat,
	lon,
	authorization,
});


});

app.listen(3000, () => {
console.log('Our express server is up on port 3000');
});
