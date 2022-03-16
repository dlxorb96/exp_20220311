// 엔티티에 해당하는 것임
// npm i mongoose --save
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// npm i mongoose-sequence
const AutoIncrement = require('mongoose-sequence')(mongoose);


// 번호, 물품코드(100-001-111, 100-002-111)
// 물품명, 가격, 수량, 등록일
// 001 => 1 넘버타입이면 1로 바뀜
var itemSchema = new Schema({
    _id      : Number,
    code1    : {type:String, default: ''},
    code2    : {type:String, default: ''},
    code3    : {type:String, default: ''},
    name     : {type:String, default: ''},
    price    : {type:Number, default: 0},
    quantity : {type:Number, default: 0},
    regdate  : {type:Date, default: Date.now}
});

// 시퀀스 사용 설정
itemSchema.plugin(AutoIncrement, {id:"SEQ_ITEM8_ID", inc_field : '_id'});

// 앞쪽이 컬렉션 이름, 컬렉션에 이런 모양을 구성하겠다 ( entity)
module.exports = mongoose.model('item8', itemSchema);