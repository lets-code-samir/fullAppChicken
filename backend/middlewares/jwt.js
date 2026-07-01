// this is where the jwt are verified if its the same user
const jwt=require('jsonwebtoken');

 function jwtVerification(req,res,next){

    const token= req.headers.authorization;

    if (!token) {
    return res.status(401).json({
        message: "No token provided"
        }
      )
    };

   try{

      const jwtToken = token.split(" ")[1];
      const decoded= jwt.verify(jwtToken, process.env.JWT_SECRET);
      req.admin=decoded;

   }
   catch(err){

     return res.status(401).json({
        message:"invalid or  expired token"
     })

   };
    
    next()
};

module.exports = jwtVerification;