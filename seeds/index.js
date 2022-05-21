//this file is not required by any other code, but simply acts as a function if data needs to be seeded into the app

const mongoose = require("mongoose");
const cities = require('./cities')
const Campground = require("../models/campground");
const {places, descriptors} = require('./seedHelpers')

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    //useCreateIndex:true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = (array) =>{
    return array[Math.floor(Math.random() * array.length)]
};

const seedDB = async()=>{ //reset database for test
    await Campground.deleteMany({})
    for (let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 40) + 10

        const newCampground = new Campground({
            name:`${sample(descriptors)} ${sample(places)}`,
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            image: 'https://source.unsplash.com/collection/627564/400x400',
            description:"Elit harum dolor quod quae earum Dolor quis ipsam corporis facere consectetur soluta. Et fuga tempore dolore laudantium est praesentium maxime minus! Voluptatem sequi possimus magni numquam quos eius, est",
            price: price
        }) 
        await newCampground.save()
    }
}
seedDB()
.then(() =>{
    mongoose.connection.close()
})
