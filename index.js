const { Int32 } = require('bson');
const port = process.env.PORT || 3000;
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();
app.use(require('body-parser').json());

const webpush = require("web-push");
const publicVapidKey ="BAFYDPAHln-GiXxqjTXj91K9ktMc9j5412T_vcKRviiIp1gTTGsoMiBNDxZBxMaoqBTMbK2JsjTE3b6ePalMr8s";
const privateVapidKey = "z8QS_DxhI6S8ejyEozqj95IIU2DB9zqdBxlDy8rJwug";
webpush.setVapidDetails("mailto:test@test.com",publicVapidKey,privateVapidKey);

var path = require('path');
app.use(express.static(path.join(__dirname, '' ))); 

 
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


const ambulive = mongoose.model('ambulive', forma); 
const userlive = mongoose.model('userlive', forma); 

app.use(express.json());
app.get('/', (req, res) => {   
    res.sendFile(__dirname + '/index.html');

});

var subscription;
var payload;

app.post("/sub", (req, res) => {
     subscription = req.body;
    res.status(201).json({});
     payload = JSON.stringify({ title: "Ambulance Alert!!" });
    
  }); 

app.post('/', async (req, res) => {

    const { lat, lon, eid, utype } = req.body;
    const { authorization } = req.headers;
    var lati = parseFloat(lat);
    var loni = parseFloat(lon);

    //console.log("Latitude = ", lati, "Longitute = ", loni, eid, " ", utype)
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

    if(utype=="u")
    {  
        try{
            const user=await userlive.find({_id: eid});
            if(user.length==0){
                const newUser=await userlive.create({
                    _id: eid,
                    type: utype,
                    lat: lati,
                    lon: loni
                });
             }
            else{const updatedUser=await userlive.findByIdAndUpdate(eid, { type: utype, lat: lati, lon: loni }); }
        }
        catch(error){
            console.log(error);
        }
    
    }
    else
    {
        try{
            const user=await ambulive.find({_id: eid});
            if(user.length==0){
                const newUser=await ambulive.create({
                    _id: eid,
                    type: utype,
                    lat: lati,
                    lon: loni
                });
             }
            else{const updatedUser=await ambulive.findByIdAndUpdate(eid, { type: utype, lat: lati, lon: loni }); }
        }
        catch(error){
            console.log(error);
        }
    
    }
   

    // n^2 complexity to check every ambulive loc with every userlive loc and then send the notification 

    async function getRecords() {
        let docs = await userlive.find({}).lean();
        userarr = docs.filter((doc) => doc !== null); 
        return userarr;
    }
    async function getRecords1() {
        let docs = await ambulive.find({}).lean();
        ambuarr = docs.filter((doc) => doc !== null); 
        return ambuarr;
    }
    
  
    let rnge = 5 // radious (km) of circle for alert region 

    let docs = await ambulive.find({}).lean();
    ambuarr = docs.filter((doc) => doc !== null); 
    let docs1 = await userlive.find({}).lean();
    userarr = docs1.filter((doc) => doc !== null); 

    //console.log( ambuarr.length , userarr.length)

    for (i = 0; i < ambuarr.length; i++) {
        let ax = ambuarr[i].lat;
        let ay = ambuarr[i].lon;
       // console.log("For ambulance" , i+1)
        for (j = 0; j <  userarr.length; j++) {
            let ux = userarr[j].lat;
            let uy = userarr[j].lon;

            let ans = dis ( ax,ux,ay,uy)
       // console.log( "Ambulance driver" , ambuarr[i]._id , "is far away by" , ans , "kms", "with user" , userarr[j]._id )
            if( ans < rnge)
            {
            console.log( "Ambulance driver" , ambuarr[i]._id , "is far away by" , ans , "kms", "with user" , userarr[j]._id )
            
            webpush.sendNotification(subscription, payload).catch(err => console.error(err));
    
        }
}
}
    res.send({
        lat,
        lon,
        authorization,
    });


});



function dis(lat1,lat2, lon1, lon2){lon1 = lon1 * Math.PI / 180;lon2 = lon2 * Math.PI / 180;lat1 = lat1 * Math.PI / 180;lat2 = lat2 * Math.PI / 180;let dlon = lon2 - lon1;let dlat = lat2 - lat1;let a = Math.pow(Math.sin(dlat / 2), 2)+ Math.cos(lat1) * Math.cos(lat2)* Math.pow(Math.sin(dlon / 2),2);let c = 2 * Math.asin(Math.sqrt(a));let r = 6371;return(c * r);}


app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

////////////////////////////////
