var express = require('express');

var router = express.Router();

var member = require('../models/member');

// localhost:3000/member/insert
router.post('/insert', async function(req, res, next) {
    try {
        var obj = new member();

        obj._id         =   req.body._id,
        obj.name        =   req.body.name,
        obj.password    =   req.body.password,
        obj.email       =   req.body.email,
        obj.age         =   Number(req.body.age)
        
        const result = await obj.save();
        console.log(result);
        if(result._id != ''){
            return res.json({status: 200});
        }
        return res.json({status: 0});
        
    } catch (error) {
        
        console.error(error)
        return res.json({status: -1});
    }
    
});

// localhost:3000/member/select
router.get('/select', async function(req, res, next) {
    try {
        const result = await member.find()
        

        return res.json({status: 200, result : result});
    } catch (error) {
        
        console.error(error)
        return res.json({status: -1});
    }
    
});

// localhost:3000/member/select?_id=?
router.get('/selectone', async function(req, res, next) {
    try {
        const result = await member.findOne({_id:req.query._id});
        return res.json({status: 200, result : result});
    } catch (error) {
        
        console.error(error)
        return res.json({status: -1});
    }
    
});
// localhost:3000/member/delete
router.delete('/delete', async function(req, res, next) {
    try {
        var obj = new member();
        
        const result = await member.deleteOne({_id : obj._id});
        console.log(result);
        if(result.deletedCount ===1){
            return res.json({status: 200});
        }
        return res.json({status: 0});
        

        
    } catch (error) {
        console.error(error)
        return res.json({status: -1});
    }
    
});

// localhost:3000/member/deletebatch
router.delete('/delete', async function(req, res, next) {
    try {
        var obj = new member();
        
        const result = await member.deleteOne({_id : obj._id});
        console.log(result);
        if(result.deletedCount ===1){
            return res.json({status: 200});
        }
        return res.json({status: 0});
        
    } catch (error) {
        console.error(error)
        return res.json({status: -1});
    }
    
});

// localhost:3000/member/update
router.put('/update', async function(req, res, next) {
    try {
        
        const obj = await member.findOne({_id : req.body._id});
        
        obj.name = req.body.name;
        obj.age = Number(req.body.age);

        // 저장하기 (아이디 값이 동일하기 때문에 수정됨.)
        const result = await obj.save();
        console.log(result);
        if(result.name ===obj.name){
            return res.json({status: 200});
        }
        return res.json({status: 0});

    } catch (error) {
        
        console.error(error)
        return res.json({status: -1});
    }
    
});

module.exports = router;
