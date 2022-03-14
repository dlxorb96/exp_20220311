var express = require('express');

var router = express.Router();

//문자를 HASH하기
// 문자가 들어오면 a => fasd1qw57das6d1w615sa6d4cxz65 1660x347438
// 16진수로 바꾸는 거
// 바꾼걸 복원할 수 없다.
// 단방향임 
// 비교하려면 문자를 다시 해쉬화 시켜서 다시 비교한다.
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// 토큰 발행
const auth = require('../token/auth');
// const securityKEY = require('../token/auth.js').securityKEY;
// const options = require('../token/auth.js').options;

//member 스키마 가져오기 import
var member = require('../models/member');


// 암호변경

// 회원탈퇴

// 로그인, 로그인 시 토큰 발행
// localhost:3000/member/selectlogin
router.post('/selectlogin', async function(req, res, next) {
    try {
        hashPw = crypto.createHmac('sha256', req.body.id)
            .update(req.body.password).digest('hex');
        const query = {_id : req.body.id, password: hashPw};

        const result = await member.findOne(query);
        console.log(result)
        if(result !== null){
            // 스프링에서는 세션에 정보를 추가했음.
            // 같은 서버가 아니기 때문에 세션을 확인할 방법없음.
            // token(츨입할 수 있는 키)을 발행

            // 세션에 추가할 값, 보안 키, 옵션
            // jwt.sign({},{},{});
            const sessionData = {
                USERID   : result._id, 
                USERNAME : result.name};
            const token = jwt.sign(sessionData, auth.securityKEY, auth.options);

            // DB에 token이라는 키로 수정함
            // token을 더 보안적으로 만들기
            return res.json({status: 200, result : token});
        }
        return res.json({status: 0});
    } catch (error) {
        console.error(error)
        return res.json({status: -1});
    }
});


// 아이디 중복 확인
// 127.0.0.1:3000/member/idcheck?id=a
router.get('/idcheck', async function(req, res, next) {
    try {
        console.log(req.query.id)
        const result = await member.findOne({_id:req.query.id});
        console.log(result);
        if(result !== null){
            return res.json({status: 200, result : 1});
        }
        return res.json({status: 0, result : 0});
        
        
    } catch (error) {
        console.error(error)
        return res.json({status: -1});
    }
    
});


// 회원가입
// localhost:3000/member/insert
router.post('/insert', async function(req, res, next) {
    try {

        // 
        hashPw = crypto.createHmac('sha256', req.body.id)
            .update(req.body.password).digest('hex');
        // sha256은 자주쓰는 해쉬알고리즘 두번째는 salt값
        // 그냥 해쉬만 하면 유추하기 쉬움
        // 첨가물을 넣으면 
        // 헥사코드 문자가 다시 16진수로 바꾸는 것

        // 빈 member 객체 만들기
        var obj = new member();

        obj._id         =   req.body.id,
        obj.name        =   req.body.name,
        obj.password    =   hashPw,
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

// 회원정보 전체
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



// 회원정보 찾기 1명
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

// 회원 탈퇴
// localhost:3000/member/delete
router.delete('/delete', auth.checkToken, async function(req, res, next) {
    try {
        const sessionID = req.body.USERID;
        const password = req.body.password;
        hashPw = crypto.createHmac('sha256', sessionID)
            .update(password).digest('hex');


        const query = {_id : sessionID, password: hashPw};
        const result = await member.deleteOne(query);
        console.log(result);

        if(result.deletedCount ===1){
            return res.json({status: 200, result: "삭제 성공"});
        }
        return res.json({status: 0, result: "비밀번호 틀림"});
        

        
    } catch (error) {
        console.error(error)
        return res.json({status: -1});
    }
    
});

// 회원정보 수정
// localhost:3000/member/update
// 토큰 , 이름, 나이
router.put('/update', auth.checkToken, 
                    async function(req, res, next) {
    try {
        const sessionID =req.body.USERID;
        const name = req.body.name;
        const age = Number(req.body.age);

        // 아이디에 해당하는 값을 조회 후 변경할 항목 2개 변경
        var Member1 = await member.findOne({_id : sessionID});
        
        Member1.name = name;
        Member1.age = age;

        // 저장하기 (아이디 값이 동일하기 때문에 수정됨.)
        const result = await Member1.save();
        console.log(result);
        if(result.name === Member1.name){
            return res.json({status: 200});
        }
        return res.json({status: 0});

    } catch (error) {
        
        console.error(error)
        return res.json({status: -1});
    }
    
});


// localhost:3000/member/updatepw
//  회원 암호 변경
router.put('/updatepw', auth.checkToken, 
                    async function(req, res, next) {
    try {
        // findOne으로 로그인 한 후 변경하기
        const sessionID =req.body.USERID;
        const password = req.body.password
        const password1 = req.body.password1

        hashPw = crypto.createHmac('sha256', sessionID)
            .update(password).digest('hex');

        const query = {_id: sessionID, password: hashPw};
        // 아이디에 해당하는 값을 조회 후 변경할 항목 2개 변경
        var Member1 = await member.findOne(query);
        
        hashPw1 = crypto.createHmac('sha256', sessionID)
            .update(password1).digest('hex');

        Member1.password = hashPw1;

        const result = await Member1.save();

        console.log(result);
        if(result.password === hashPw1){
            return res.json({status: 200, result: result});    
        }
        
        return res.json({status: 0});
        
    } catch (error) {
        
        console.error(error)
        return res.json({status: -1});
    }
    
});

module.exports = router;
