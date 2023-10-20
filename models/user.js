const mongoose=require ('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        minlength:4,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    email:{
        type:String,
        required:true,
    },
    fullname:{
        type:String,
        required:true,
        },
        image: {
            type: String,
            default: null,
          },

    
});
module.exports = new mongoose.model("User", userSchema);
