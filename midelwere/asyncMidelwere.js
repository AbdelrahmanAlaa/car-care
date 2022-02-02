module.exports = function (handelr) {
    return async (req , res , next ) =>{
    try{
      await handelr(req , res)
    } 
    catch(ex){
        
      next(ex);
    }
  }}  