const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = async function (req , res , next ){

    const token = req.header('x-auth-token');
    if(!token)return res.status(401).send('access denied . no token provided  ')

    try{ 
    const decoded = await jwt.verify(token , config.get('jwtPrivateKey'));
    req.user= jwt.decoded ;
    console.log(decoded)
     next();
   }
   catch(ex){
       res.status(400).send('invalid token ');
   }
}