const mongoose = require('mongoose')

const userSchema= mongoose.Schema(
    {
        ime: {
            type: String,
            required: [true, "vnesi ime uporabnika"]
        },
        priimek: {
            type: String,
            required: [true, "vnesi priimek uporabnika"]
        },
        leta: {
            type: Number,
            required: [true, "vnesi leta uporabnika"]
        },
        eposta: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true 
    }
)

const User = mongoose.model('User', userSchema);

module.exports = User;