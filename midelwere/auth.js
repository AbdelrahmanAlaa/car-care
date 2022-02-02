// const  jwt = require('jsonwebtoken');

// function auth(req,res,next){
//     const token = req.header('x-auth-token');
//     if(!token) return res.status(401).send({"message":"Access denided , no token provided"});
// try{
//     token.verify(token ,config.get('jwtPrivatKey'));
//     req.user= decoded;
//     next()
// }
// catch(ex){
//     res.status(400).json({"message":"invalid token"});
// }