const {Review,validateReview}  = require('./../models/reviewModel')
const asyncError = require('./../middleware/asyncMiddleware');
const {Worker} = require('./../models/workerModel')

exports.getReview =asyncError(async(req,res)=>{
    const review =await Review.find();
    res.json({
        review
    })
})



exports.creatReview= asyncError(async(req,res)=>{
    const {error} = validateReview(req.body);
    if(error)return res.status(404).json({
        status:'failed',
        message:error.details[0].message
    })
    const review = new Review({
        user:req.user._id,
        worker:req.body.worker,
        review:req.body.review,
        rating:req.body.rating
    });
    
   const stats =  await Review.aggregate([
        {
            $match:{worker:review.worker}
        },
        {
         $group: {
        _id:'$worker',
         nRating:{$sum:1},
         avgRating:{$avg : '$rating'}
        }
    }
    ]);

const worker = await Worker.findByIdAndUpdate(req.body.worker,{
    ratingQuantity:stats[0].nRating,
    ratingAverage:stats[0].avgRating
},{new:true});



    res.status(200).json({
        status:'success',
        message: "successfully created",
        review           
    })
    await review.save();

})
