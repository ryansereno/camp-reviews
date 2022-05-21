const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    name:{
        type:String
    },
    image:{
        type:String
    },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    location:String
})

module.exports = mongoose.model('Campground', CampgroundSchema)
