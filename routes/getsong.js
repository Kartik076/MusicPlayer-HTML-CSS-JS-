import express from "express";
import { Song } from "../models/SongSchema.js";

const songrouter = express.Router()

songrouter.get('/getsong/:id', async (req, res) => {
    try {
        let song = await Song.findById((req.params.id), "Song")
        if (!song) {
            res.json({
                err: 'song not found'
            })
        }
        res.set('contentType', song.Song.contentType)
        res.send(song.Song.data)
        console.log('successfully sent the song');
    } catch (err) {
        console.error('Error fetching song:', err);
        res.status(500).json({ message: 'Internal server error while loading the song' });
    }
})

export default songrouter