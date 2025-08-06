import mongoose, { model } from 'mongoose';

const SongSchema = new mongoose.Schema({
    SongName: String,
    ArtistName: String,
    Song: {
        data: Buffer,
        contentType: String
    },
    Image: {
        data: Buffer,
        contentType: String
    }
})

export const Song = mongoose.model('Song', SongSchema) 