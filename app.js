 
 const express =require('express');
 const mongoose =require('mongoose'); 
 const fileUpload = require('express-fileupload');
 const path =require('path');
 const fs =require('fs')
 const ejs=require('ejs');
const Photo =require('./models/Photo')

 const app=express();
 // connet DB
mongoose.connect('mongodb://localhost/pcat-test-db');

 app.set("view engine","ejs")
 //Middlewares
app.use (express.static('public'));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(fileUpload());


 app.get('/', async (req, res) => {
  const photos = await Photo.find({})
  res.render('index', {
    photos
  })
})

 app.get('/about', (req,res) =>{
   res.render('about')
 })
 app.get('/add', (req,res) =>{
   res.render('add')
 })



 app.post('/photos',async (req,res) =>{
 // await Photo.create(req.body)
 //res.redirect('/') 

 const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, (err) => {
      if (err) throw err;
    });
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/./public/uploads/' + uploadedImage.name; 

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body, //veritabanında olan alanları çek
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });  
})


 const port=3000;
 app.listen(port,()=>{
    console.log(`Sunucu ${port} portunda başlatıldı...`)
 })