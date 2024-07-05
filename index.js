
const exp = require('constants');
const express = require('express');
const path = require('path')
var bodyParser  = require('body-parser');
const app = express()

const port = 3000
const viewsDir = path.join(__dirname,'/views/index.html')
const publicDir = path.join(__dirname,'/public')
require('dotenv').config()

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI ,{ useNewUrlParser: true, useUnifiedTopology: true })

const urlSchema = new mongoose.Schema({
    url : String,
    short:String,
})

const Url = mongoose.model('Url',urlSchema)

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

app.use(express.static(publicDir))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    console.log(publicDir)
    res.sendFile(viewsDir)
})
app.post('/post/url',(req,res)=>{
    let url = req.body.url
    let short = makeid(4);
    let newuri = new  Url({url,short})

    newuri.save()
    .then((doc) => {
        res.json({newUrl : 'http://localhost:3000/' + doc.short })
    })
    .catch((err) => {
      console.error(err);
    });
    
   
    
})
app.get('/:short',(req,res)=>{
    let short = req.params.short

    Url.findOne({short})
      .then((doc) => {
        res.redirect(doc.url)
      })
      .catch((err) => {
        console.error(err);
      });
    
    
})
app.listen(port,()=>{
    console.log(`listning on port ${port}`)
})