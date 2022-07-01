const mongoose = require("mongoose");
const Review = require("./review")
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
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
