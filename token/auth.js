const jwt = require('jsonwebtoken');

const self = module.exports = {

    // 토큰발행 salt값  , 고유한 게 좋음
    securityKEY : 'famdkqwmdkmsd3#mkSDM4123',

    // 토큰 발행에 필요한 옵션들
    options : {
        algorithm : "HS256",
        expiresIn : '10h', //10시간 10m > 10분
        issuer :  "ds"  //발해앚
    },

    // 프론트엔드에서 오는 토큰 검증
    checkToken : async(req,res,next) =>{
        try {
            const token = req.headers.auth; //키는 auth;
            if(token === null){
                return res.send({status : 0, result: "토큰 없음"})
            }

            // 발행 시 sign <=> verify 검증 시
            // 디코드

            // 발행 된 토큰, 보안키
            // 이때 오류가 제일 많이 뜸. 여기서 catch로 많이 넘어감
            const sessionData = jwt.verify(token, self.securityKEY);

            // USERID, USERNAME키가 존재하는지 확인
            if(typeof sessionData.USERID === 'undefined'){
                return res.send({status: 0, result: '토큰 복원 실패'});
            }
            
            if(typeof sessionData.USERNAME === 'undefined'){
                return res.send({status: 0, result: '토큰 복원 실패'});
            }

            // routes/member.js에서 사용가능하도록 정보전달
            req.body.USERID = sessionData.USERID;
            req.body.USERNAME = sessionData.USERNAME;

            next(); //routes/member.js로 전환
        } 

        catch (e) {
            console.log("---------------------------------")
            console.error(e);
            if(e.message === "invalid signature"){
                return res.send({status: 0, result: '인증실패'});
            }
            else if(e.message === "jwt expired"){
                return res.send({status: 0, result: '시간만료'});
            }
            else if(e.message === "invalid token"){
                return res.send({status: 0, result: '유효하지 않은 토큰'});
            }
            return res.send({status: 0, result: '유효하지 않은 토큰'});
        }
    }
    
}

