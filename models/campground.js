const mongoose = require("mongoose");
const Review = require("./review")
const Schema = mongoose.Schema;
const User = require('../models/user')

const ImageSchema = new Schema({
        url: String,
        filename: String
})

ImageSchema.virtual('thumb').get(function() {
    return this.url.replace('/upload','/upload/w_200')
})

const CampgroundSchema = new Schema({
    images:[ImageSchema],
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    location: String,
    author:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

CampgroundSchema.post('findOneAndDelete', async function(document){
    if (document){
        await Review.remove({
            _id:{
                $in: document.reviews //remove the reviews for which their id's are in this document
            }
        })
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema);
