const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
    },

    resetToken: {
        type: String,
        default: null
    },

    resetTokenExpiry: {
        type: Date,
        default: null
    }
})

// Sparse unique index on email so legacy users without an email don't conflict,
// while still enforcing uniqueness for new registrations.
userSchema.index({ email: 1 }, { unique: true, sparse: true })

const userModal = mongoose.model("User", userSchema)

module.exports = userModal
