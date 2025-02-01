const Listing = require("../models/listing");
const mongoose = require("mongoose");
let {data} = require("./data");

const MONGOOSE_URL = 'mongodb://127.0.0.1:27017/wanderlust'




main()
.then(()=>{
    console.log("connection successfully made");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGOOSE_URL);
}


async function initDb(){
    await Listing.deleteMany();
    data = data.map((listing)=>{
        return {...listing , owner : "6791305e8d1e26d701cd1950" , categories : "Trending"};
    })
    await Listing.insertMany(data);
}

initDb();