var mongoose = require('mongoose');


var SanPhamSchema = new mongoose.Schema({
    tenSanPham: String,
    donGia: Number,
    soLuong: Number,
    anh: String
}, {
        usePushEach: true // add this becasue $pushall is nolonger support in mongose 3.4>
    });

mongoose.model('SanPham', SanPhamSchema);