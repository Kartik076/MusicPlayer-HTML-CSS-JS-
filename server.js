import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { Song } from './models/SongSchema.js';
import metarouter  from './routes/getmeta.js'
import songrouter  from './routes/getsong.js'

const app = express()
const port = 3000

await mongoose.connect('mongodb://localhost:27017/spotify')
console.log('Connected to DataBase Successfully');
const storage = multer.memoryStorage();
const upload = multer({storage})

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/spotify.html')
})

app.use('/',metarouter)

app.use('/',songrouter)

app.post('/upload', upload.fields([
    {name:'img',maxCount:1},
    {name:'audio',maxCount:1}
]), async (req, res) => {
    try{
        const {songname , artistname} = req.body
        const song = req.files['audio'][0].buffer
        const songFileType = req.files['audio'][0].mimetype
        const image = req.files['img'][0].buffer
        const imageFileType = req.files['img'][0].mimetype

        const newSong = new Song({
            SongName:songname,
            ArtistName:artistname,
            Song:{
                data:song,
                contentType:songFileType
            },
            Image:{
                data:image,
                contentType:imageFileType
            }
        })

        await newSong.save()
        res.send({message:"Saved Successfully",songId:newSong._id})
    }catch(err){
        console.log(`${err}: upload failed`)
    }
    
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})