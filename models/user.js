const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:  {
        type: String,
        required: [true, 'Username is required'],
    },
    email:  {
        type: String,
        required: [true, 'Email is required'],
    },
    password:  {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, "Password must be at least 8 characters"],
    },
},{timestamps: true},);

userSchema.virtual('confirmPassword')
.get(() => this._confirmPassword)
.set(value => this._confirmPassword = value);

userSchema.pre('validate', function(next){
    if(this.password !== this.confirmPassword) {
        this.invalidate('ConfirmPassword', 'Password must match!')
    }
    next();
})

userSchema.pre("save",async function(next) {
    try {
        const hashedPassword = await bcrypt.hash(this.password, 8)
        console.log("HASSHED PASSWORD", hashedPassword)
        this.password = hashedPassword;
        next()
    } catch (error) {
        console.log("ERROR", "HASHING ERROR");
        next(error)
    }
})

module.exports = mongoose.model('User', userSchema);