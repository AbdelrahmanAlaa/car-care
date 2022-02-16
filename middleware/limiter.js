// this middelwere for stop alot of requset from attacker ..
const ratelimit =require('express-rate-limit');

exports.limiter =ratelimit ({
    max:100,
    windowMs:60 * 60 * 1000 ,
    message:'too many requests from this IP, please try again in  an hour !'
});
