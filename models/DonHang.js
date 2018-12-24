var mongoose = require('mongoose');

var SanPhamSchema = new mongoose.Schema({
    maSanPham: String,
    tenSanPham: String,
    donGia: Number,
    soLuong: Number,
})

var DonHangSchema = new mongoose.Schema({
    tenKhachHang: String,
    diaChi: String,
    dienThoai: String,
    ngayDatHang: Date,
    ngayGiaoHang: Date,
    ghiChu: String,
    sanPham: [SanPhamSchema],
    thanhTien: Number
}, {
    usePushEach: true // add this becasue $pushall is nolonger support in mongose 3.4>
});

mongoose.model('DonHang', DonHangSchema);