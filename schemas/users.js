let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username khong duoc trung"],
        required: [true, "Username khong duoc rong"]
    },
    password: {
        type: String,
        required: [true, "Password khong duoc rong"]
    },
    email: {
        type: String,
        unique: [true, "Email khong duoc trung"],
        required: [true, "Email khong duoc rong"]
    },
    fullName: {
        type: String,
        default: ""
    },
    avatarUrl: {
        type: String,
        default: "https://i.sstatic.net/l60Hf.png"
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    loginCount: {
        type: Number,
        default: 0,
        min: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);
