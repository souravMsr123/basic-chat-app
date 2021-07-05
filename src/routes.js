const router = require("express").Router();
const DevController = require("./controllers/DevController");
const LikeController = require("./controllers/LikeController");
const DislikeController = require("./controllers/DislikeController");
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

function isAuthenticated(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        // retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization.split(" ")[1];
        // Here we validate that the JSON Web Token is valid and has been 
        // created using the same private pass phrase
        jwt.verify(token, "MySuperSecretPassPhrase", { algorithm: "HS256" }, (err, user) => {
            
            // if there has been an error...
            if (err) {  
                // shut them out!
                res.status(500).json({ error: "Not Authorized" });
                throw new Error("Not Authorized");
            }
            // if the JWT is valid, allow them to hit
            // the intended endpoint
            return next();
        });
    } else {
        // No authorization header exists on the incoming
        // request, return not authorized and throw a new error 
        res.status(500).json({ error: "Not Authorized" });
        throw new Error("Not Authorized");
    }
}

router.post("/signup", (req,res)=>{
    console.log('body', req)
    database.collection("users").findOne({
        "email": req.body.email
    }, function(err,user){
        if(user===null){
            bcrypt.hash(req.body.password,10, function(err,hash){
                database.collection("users").insertOne({
                    "name": req.body.name,
                    "about":req.body.about,
                    "email": req.body.email,
                    "password": hash,
                }, function(err,data){
                    db.collection("users").createIndex( { name: "text", description: "text" } )

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
})



router.post("/login", (req,res)=>{
    
    database.collection("users").findOne({
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
})

router.get("/devs",isAuthenticated, DevController.index);
router.post("/devs", isAuthenticated,DevController.store);
router.post("/devs/:id/likes",isAuthenticated, LikeController.store);
router.post("/devs/:id/dislikes",isAuthenticated, DislikeController.store);

module.exports = router;
