// 엔티티에 해당하는 것임
// npm i mongoose --save
var mongoose = require('mongoose');

// npm i mongoose-sequence
const AutoIncrement = require('mongoose-sequence')(mongoose);

var Schema = mongoose.Schema;

// 책코드, 제목, 가격, 저자, 등록일
var bookSchema = new Schema({
    _id      : Number,
    title    : {type:String, default: ''},
    filedata : {type:Buffer, default: null},
    filesize : {type:Number, default: 0},
    filename : {type:String, default: ''},
    filetype : {type:String, default: ''},
    regdate  : {type:Date, default: Date.now}
});

// 시퀀스 사용 설정
bookSchema.plugin(AutoIncrement, {id:"SEQ_BOOK9_ID", inc_field : '_id'});

// 앞쪽이 컬렉션 이름, 컬렉션에 이런 모양을 구성하겠다 ( entity)
module.exports = mongoose.model('book9', bookSchema);