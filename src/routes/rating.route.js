'use strict';
const express=require("express");
const ratingRouter=express.Router;
const bearer = require("../middleware/bearer.middleware");
const role=require("../middleware/role.middleware");
const {orderTable,restTable}=require("../models/index.model");
ratingRouter.put("/rating",bearer,role(["user"]), ratingHandler);

async function ratingHandler(req,res){
// rest rat ,, meal rate ,, order id
if(req.body.restRate){
    let order  = await order.findOne({where:{id:req.body.orderId}})
let rest= await restTable.findOne({where:{id:order.resturamtId}});
// 9 //9 10 //9.5   count*avg=sum   sum+rating/count+1=avg
if (rest.rating==0)
{
    rest.rating=req.body.restRate;
    order.rated=true;
    res.status(200).json(rest);
}
else{
    let ratedOrders = await orderTable.findAll({where:{resturantId:rest.id,rated:true}});
    let count = ratedOrders.length+1;
    let sum=count*rest.rating;
    let avg = (sum+req.body.restRate)/count;

    rest.rating=avg;
    order.rated=true;
    res.status(200).json(rest);

}
}

}

module.exports=ratingRouter