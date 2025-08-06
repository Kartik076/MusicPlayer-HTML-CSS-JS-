import express from "express";
import {Song} from "../models/SongSchema.js";

const metarouter = express.Router()

metarouter.get('/getmeta', async (req, res) => {
    try {
        const formattedMeta = []
        let Metas = await Song.find({}, "_id SongName ArtistName Image")
        if (Metas.length === 0){res.json({
            err:'failed to load db was empty'
        })}
        Metas.forEach(Meta => {
            formattedMeta.push({
                id: Meta._id,
                SongName: Meta.SongName,
                ArtistName: Meta.ArtistName,
                Image: {
                    contentType: Meta.Image.contentType,
                    data: Meta.Image.data.toString('base64')
                }
            })
        });
        res.json(formattedMeta)
    } catch (err) {
        console.error('Error fetching songs:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
})

export default metarouter