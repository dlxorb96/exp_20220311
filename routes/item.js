var express = require('express');
var router = express.Router();

// book 스키마 가져오기 import
var Item = require('../models/item');


// 127.0.0.1:3000/item/insert
// {"title" : "통합구현", "pirce" : 1200, "autohr": "가나다"}
router.post('/insert', async function(req, res, next) {
    try {
        var item = new Item();
        item.code1 =req.body.code1;
        item.code2 =req.body.code2;
        item.code3 =req.body.code3;
        item.name =req.body.name;
        item.price = Number(req.body.price);
        item.quantity = Number(req.body.quantity);

        const result = await item.save();
        console.log(result);
        if(result._id > 0){
            return res.json({status : 200});
        }
        return res.json({status : 0});
        
    } 
    
    catch (e) {
        console.error(e);
        return res.json({status : -1});
    }
});

// 127.0.0.1:3000/item/select
// {"title" : "통합구현", "pirce" : 1200, "autohr": "가나다"}
router.get('/select', async function(req, res, next) {
    try {
        const query = {};
        const result = await Item.find({query}).sort({_id: 1});
        return res.json({status : 200 ,result : result});
        
    } 
    catch (e) {
        console.error(e);
        return res.json({status : -1});
    }
});

// 대분류별 등록물품 개수
// 127.0.0.1:3000/item/aggrcode1
router.get('/groupcode1', async function(req, res, next) {
    try {
        // const code1 = req.query.code1
        const result = await Item.aggregate([
            // {
            //     $match: {
            //         code1: code1
            //     }
            // },
            {
                $project : {
                    code1:1,
                    // code2:1,
                    price:1,
                    quantity:1
                }
            },
            {
                $group :{
                    _id : '$code1', //그룹기준
                    count: {$sum : 1},
                    // code2 : {$push: '$code2'},
                    pricetotal : {$sum: '$price'},
                    quantity : {$sum : '$quantity'}
                }
            }

            ]).sort({_id: 1})
            
        return res.json({status : 200 ,result : result});
        
    } 
    catch (e) {
        console.error(e);
        return res.json({status : -1});
    }
});

// 중분류별 등록물품 개수
// 127.0.0.1:3000/item/groupcode2?code2=011
router.get('/groupcode2', async function(req, res, next) {
    try {
        const code2 = req.query.code2
        const result = await Item.aggregate([

        {
            $match: {
                code2: code2
            }
        },
        {
            $project : {
                code2:1,
                price:1,
                quantity:1
            }
        },
        {
            $group :{
                _id : '$code2', //그룹기준
                count: {$sum : 1},
                pricetotal : {$sum: '$price'},
                quantity : {$sum : '$quantity'}
            }
        }

        ])
        
        return res.json({status : 200 ,result : result});
        
    } 
    catch (e) {
        console.error(e);
        return res.json({status : -1});
    }
});

// 소분류별 등록물품 개수
// 127.0.0.1:3000/item/groupcode3?code3=112$code3=132$code3=135
router.get('/groupcode3', async function(req, res, next) {
    try {
        const code3 = req.query.code3
        const result = await Item.aggregate([
        {
            $match: {
                code3: {$in : code3}
            }
        },
        {
            $project : {
                code3:1,
                price:1,
                quantity:1
            }
        },
        {
            $group :{
                _id : '$code3', //그룹기준
                count: {$sum : 1},
                pricetotal : {$sum: '$price'},
                quantity : {$sum : '$quantity'}
            }
        }

        ])
        
        return res.json({status : 200 ,result : result});
        
    } 
    catch (e) {
        console.error(e);
        return res.json({status : -1});
    }
});

module.exports = router;
