var mongoose = require('mongoose');

// const AutoIncrement = require('mongoose-sequence')(mongoose);

var Schema = mongoose.Schema;

// 책코드, 제목, 가격, 저자, 등록일
var memberSchema = new Schema({
    _id     : {type:String, default: ''},
    name   : {type:String, default: ''},
    password   : {type:String, default: ''},
    email  : {type:String, default: ''},
    age  : {type:Number, default: 0},
    regdate : {type:Date, default: Date.now}
});

// 시퀀스 사용 설정

// 앞쪽이 컬렉션 이름, 컬렉션에 이런 모양을 구성하겠다 ( entity)
module.exports = mongoose.model('member8', memberSchema);