import morgan from 'morgan'; 
import express from 'express';
import fs from 'fs';
import path from 'path'; 

import * as router from './routes';

import { cors } from './policies'

const app = new express();
const port = process.env.PORT || 3000;

var accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))
app.use(cors);

app.use(express.static(__dirname + '/static')); 

app.use('/api/v1', router.HotelRouter);

app.listen(port, (err,res)=>{
  if(!err){
    console.log("listening on port 3000");
  }
})
