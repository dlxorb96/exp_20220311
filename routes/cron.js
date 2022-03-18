var express = require('express');
var router = express.Router();

// npm i node-cron --save
var cron = require('node-cron');

// DB연동 모델
var Book1 = require('../models/book1');

// cron.schedule('*/2 * * * * *', async ()=>{
//     console.log('aaa')

//     // 10초 간격으로 자료 저장, 자료 이동,
//     // var book1 = new Book1();
//     // book1.title ="AAA";
//     // await book1.save();
// })


module.exports = router;
