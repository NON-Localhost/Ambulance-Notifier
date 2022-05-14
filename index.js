
const { Int32 } = require('bson');
const express = require('express');
const app = express();

const host = 'localhost';
const port = 3000;


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ambu', {useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error' , console.error.bind(console, 'connection error:'));

db.once('open' , function(){
console.log("Monkeyyyyyyyy connected man !!")
});
const forma = new mongoose.Schema({
    _id: String,
    type: String,
    lat: Number,
    lon: Number
});
const ambu = mongoose.model('ambu', forma);





app.use(express.json());
app.get('/', (req, res) => {
res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
const { lat , lon , eid , utype } = req.body;
const { authorization } = req.headers;

var lati = parseInt(lat);
var loni = parseInt(lon); 

console.log( "Latitude = " , lati ,  "Longitute = " , loni  , eid , " " , utype  )

//updatatation part in DB MOGGGOGGO 
ambu.countDocuments({_id: eid }, function (err, count){ 
    if(count>0){
    ambu.findByIdAndUpdate( eid , {   type: utype, lat:lati , lon:loni } ,
                            function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
      //  console.log("Updated User : ", docs);
    }
});

    }
    else
    {
        const ambu1 = new ambu({ _id: eid , type: utype , lat:lati , lon:loni  });
        ambu1.save();
    }
}); 

res.send({
	lat,
	lon,
	authorization,
});


});




app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});




// app.listen( process.env.PORT || 3000 , () => {
// console.log('Our express server is up on port' , process.env.PORT || 3000 );
// });
