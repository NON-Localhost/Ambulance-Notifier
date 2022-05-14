
const { Int32 } = require('bson');
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();
// const host = 'localhost';
const port = process.env.PORT || 3000;

var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/ambu', {useNewUrlParser: true , useUnifiedTopology: true});
// app.use(cors);
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.a7rq8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
        console.log("DB Integrated");
    })
    .catch((error) => {
        console.log(error);
    })
// var db = mongoose.connection;
// db.on('error' , console.error.bind(console, 'connection error:'));

// db.once('open' , function(){
// console.log("Monkeyyyyyyyy connected man !!")
// });
const forma = new mongoose.Schema({
    _id: String,
    type: String,
    lat: Number,
    lon: Number
},

    { timestamps: true }

);
const ambu = mongoose.model('ambu', forma);


app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', async (req, res) => {
    const { lat, lon, eid, utype } = req.body;
    const { authorization } = req.headers;

    var lati = parseInt(lat);
    var loni = parseInt(lon);

    console.log("Latitude = ", lati, "Longitute = ", loni, eid, " ", utype)

    // //updatatation part in DB MOGGGOGGO 
    // await ambu.countDocuments({ _id: eid }, function (err, count) {
    //     if (count > 0) {
    //         ambu.findByIdAndUpdate(eid, { type: utype, lat: lati, lon: loni },
    //             function (err, docs) {
    //                 if (err) {
    //                     console.log(err)
    //                 }
    //                 else {
    //                     //  console.log("Updated User : ", docs);
    //                 }


    //             });

    //     }
    //     else {
    //         const ambu1 = new ambu({ _id: eid, type: utype, lat: lati, lon: loni });
    //         ambu1.save();
    //     }
    // });




    try{
        const user=await ambu.find({_id: eid});
        if(user.length==0){
            const newUser=await ambu.create({
                _id: eid,
                type: utype,
                lat: lati,
                lon: loni
            });
            // res.json({status:200});
        }
        else{
            const updatedUser=await ambu.findByIdAndUpdate(eid, { type: utype, lat: lati, lon: loni });
            // await ambu.save();
            // res.json({status:200});
        }
    }
    catch(error){
        // throw new Error(error);
        console.log(error);
    }

    res.send({
        lat,
        lon,
        authorization,
    });


});


app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

////////////////////////////////
