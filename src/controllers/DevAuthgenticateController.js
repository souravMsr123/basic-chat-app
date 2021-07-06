const Dev = require('../models/Dev');
const bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken");



const signup = async (req,res)=>{
   Dev.findOne({
        "email": req.body.email
    }, function(err,user){
        if(user===null){
            bcrypt.hash(req.body.password,10, function(err,hash){
                Dev.insertOne({
                    "name": req.body.name,
                    "email": req.body.email,
                    "password": hash,
                }, function(err,data){
                    
                    res.status(200).json({
                        message:"User succesfully created..!"
                    })
                })
            })
        }else{
            res.status(409).json({
                message:"User succesfully created..!"
            })
        }
    })
}

const login = async (req,res)=>{
    Dev.findOne({
        "email": req.body.email
    }, function(err,user){
        if(user===null){
            res.status(404).json({
                message:"User does not exsist..!"
            })
        }else{
            bcrypt.compare(req.body.password,user.password, function(err,iseVerified){
                if(iseVerified){
                    let token = jwt.sign({"id":user._id,"email":user.email}, "MySuperSecretPassPhrase", { algorithm: 'HS256'},{

                        expiresIn: '365d' // expires in 365 days
             
                   });

                   res.status(200).json({
                        token:token,
                        message:"User user logged in succefully..!"
                    })
                }else{
                    res.status(401).json({
                       
                        message:"Password wrong..!"
                    })
                }
            })
            
        }
    })
 }

module.exports = { signup,login };
