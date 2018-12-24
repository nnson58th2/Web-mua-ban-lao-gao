module.exports = function Cart(oldCart) {
    this.sanphams = oldCart.sanphams || {};
    this.tongSoLuong = oldCart.tongSoLuong || 0;
    this.thanhTien = oldCart.thanhTien || 0;

    this.add = function(sanpham, id) {
        var storedItem = this.sanphams[id];
        
        if (!storedItem) {
            storedItem = this.sanphams[id] = { sanpham: sanpham, soLuong: 0, donGia: 0};
        }
        storedItem.soLuong++;
        storedItem.tongTien = storedItem.sanpham.donGia * storedItem.soLuong;
        this.tongSoLuong++;
        this.thanhTien += storedItem.sanpham.donGia;

    }

    this.reduceByOne = function(id) {
        this.sanphams[id].soLuong--;
        this.sanphams[id].tongTien -= this.sanphams[id].sanpham.donGia;
        this.tongSoLuong--;
        this.thanhTien -= this.sanphams[id].sanpham.donGia;

        if (this.sanphams[id].soLuong <= 0) {
            delete this.sanphams[id];
        }
    }

    this.increaseByOne = function (id) {
        this.sanphams[id].soLuong++;
        this.sanphams[id].tongTien += this.sanphams[id].sanpham.donGia;
        this.tongSoLuong++;
        this.thanhTien += this.sanphams[id].sanpham.donGia;
    }

    this.removeItem = function(id) {
        this.tongSoLuong -= this.sanphams[id].soLuong;
        this.thanhTien -= this.sanphams[id].tongTien;
        delete this.sanphams[id];
    }

    this.removeAllItem = function () {
        this.sanphams = {};
        this.tongSoLuong = 0;
        this.thanhTien =  0;
    }

    this.generateArray = function() {
        var arr = [];
        for (var id in this.sanphams) {
            arr.push(this.sanphams[id])
        }
        return arr;
    }
}