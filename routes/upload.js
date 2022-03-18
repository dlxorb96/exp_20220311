var express = require('express');
var router = express.Router();

// 이미지 첨부 모듈
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
var Book1 = require('../models/book1');
// diskStorage하면 바로 파일로 저장이 됨 근데 그거 안씀
// 메모리는 db에 저장한다는 뜻담고있음.

/* GET users listing. */
// 이미지 등록
// 127.0.0.1:3000/upload/insert
router.post('/insert', upload.single("img"), async function(req, res, next) {
    try {
        console.log(req.body);
        console.log(req.file)
        const book1 = new Book1()
        book1.title = req.body.title;

        if(typeof req.file !== 'undefined'){
            book1.filesize = req.file.size;
            book1.filename = req.file.originalname;
            book1.filetype = req.file.mimetype;
            book1.filedata = req.file.buffer;
        }
        await book1.save();
        
        return res.send({status : 200});        
        
    } 
    catch (error) {
        console.log(error)
        return res.send({status : -1});
    }
    
});

// 127.0.0.1:3000/upload/image?no=1
// <img src="/upload/image?no=1">
router.get('/image', upload.single("img"), async function(req, res, next) {
    try {
        const query = {_id: Number(req.query.no)}
        const book1 = await Book1.findOne(query).select({titke: 0})
        console.log(book1)
        res.contentType(book1.filetype);
        return res.send(book1.filedata);
        
        
    } 
    catch (error) {
        console.log(error)
        return res.send({status : -1});
    }
});

// return res.send({status : 0});

module.exports = router;
