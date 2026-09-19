import slugify from 'slugify';
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    propertyName:{
        type: String,
        required:[true, "Please enter your propert name"]
    },
    description:{
        type:String,
        required:[true, "Please add informtion about your property"]
    },

    extraInfo:{
        type:String,
        default:"checkin on time. good services."
    },
    propertyType:{
        type:String,
        enum:["House", "Flat", "Guest House", "Hotel"],
        default:"House"
    },
        roomType:{
        type:String,
        enum:["Anytpe", "Room", "Entire Home"],
        default:"Anytype"
    },

    maximumGuest:{
        type:Number,
        required:[true, "Please give the maximum no of Guest that can oocupy"]
    },

    amenities:[
        {
            name:{
                type:String,
                required:true,
                enum:[
                    "Wifi",
                    "Kitchen",
                    "AC",
                    "Washing Machine",
                    "TV",
                    "pool",
                    "Free Parking"
                ]
            },
            icon:{
                type:String,
                required:true
            }
        }
    ],
    images:{
        type:[
            {
                public_id:{
                    type:String
                },
                url:{
                    type:String,
                    required:true
                }
            }
        ],
        validate:{
            validator:function(arr){
                return arr.length >= 6;
            },
            message: "The image must contain atleast 6 images"
        }
    },
    price:{
        type:Number,
        required:[true, "Please enter the price per night value"],
        default:500
    },
    address:{
        area:String,
        city:String,
        state:String,
        pincode:Number
    },
    currentBookings:[
            {
            bookingId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Booking"
            },
             fromDate:{
                type:Date
             },
             toDate:{
                type:Date,
             },
             userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
             }
            }
    ],
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    Slug:String,
    checkinTime:{type:String,default:"11:00"},
    checkoutTime:{type:String,default:"13:00"}
})

propertySchema.pre("save" , function(){
    this.slug = slugify(this.propertyName,{lower:true});
})

propertySchema.pre("save", function(){
    this.address.city = this.address.city.toLowerCase().replaceAll(" "," ")
})

//const Property = mongoose.model("Property", propertySchema);
const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);
export{Property};