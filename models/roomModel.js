const mongoose = require('mongoose');

const roomSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: [true, "Vnesite ID prostora"],
            unique: true
        },
        name: {
            type: String,
            required: [true, "Vnesite ime prostora"]
        },
        location: {
            type: String,
            required: [true, "Vnesite lokacijo prostora (naslov)"]
        }
    },
    {
        timestamps: true
    }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
