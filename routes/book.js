var express = require('express');
var router = express.Router();

// book 스키마 가져오기 import
var book = require('../models/book');

// 127.0.0.1:3000/book/insert
router.get('/insert', function(req, res, next) {
    res.json({status:200})
});

// 127.0.0.1:3000/book/insert
// {"title" : "통합구현", "pirce" : 1200, "autohr": "가나다"}
router.post('/insert', async function(req, res, next) {
    try {
        // var 객체명 = new 클래스명();
        var obj = new book();
        obj.title = req.body.title;
        obj.price = Number(req.body.price);
        obj.author = req.body.author;

        const result = await obj.save();
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
// 127.0.0.1:3000/book/select
// {"title" : "통합구현", "pirce" : 1200, "autohr": "가나다"}
router.get('/select', async function(req, res, next) {
    try {
        
        const result = await book.find({}).sort({_id: 1});
            return res.json({status : 200 ,result : result});
        
        
    } 
    catch (e) {
        console.error(e);
        return res.json({status : -1});
    }
});

module.exports = router;
