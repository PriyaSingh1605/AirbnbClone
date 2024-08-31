const mongoose = require('mongoose');
const Schema =mongoose.Schema;

main().then(()=>{
console.log("connected to database");
}).catch(err=>{
    console.log(err);
});

async function main(){
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
   
}


const listingSchema=new Schema({
   title:{
    type:String,
    required:true
},
   description:String,
   image:{

      filename:String,
   
      url:{
         type:String,
        
      }
  
},
   price:Number,
   location:String,
   country:String,

   reviews:[{
      type:Schema.Types.ObjectId,
      ref:"Review"
   }],
   owner:{
      type:Schema.Types.ObjectId,
      ref:"User"
   },
   geometry:{
      type: {
         type: String,
         enum: ['Point'],
         required: true
      },
      coordinates:{
         type: [Number],
         required: true,
      } 
   }
});

const Listing=mongoose.model("Listing", listingSchema);

module.exports=Listing;