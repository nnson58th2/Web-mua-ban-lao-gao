var express = require('express');
var router = express.Router();
var mongoose = require("mongoose")


var Cart = require("../models/cart");
var DonHang = mongoose.model('DonHang');
var SanPham = mongoose.model("SanPham");

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};



function renderHomePage(req, res, data) {
    var tongSoLuong = 0;
    if (req.session.cart) {
        tongSoLuong = req.session.cart.tongSoLuong;
    }
    res.render("home", {listSanPham: data, tongSoLuong: tongSoLuong});
}

router.get('/', function(req, res) {
    SanPham
        .find()
        .exec(function (err, sp) {
            if (!sp) {
                sendJSONresponse(res, 404, {
                    "message": "SanPham is not found"
                });
                return;
            } else if (err) {
                sendJSONresponse(res, 404, err);
                return;
            }
            var data = JSON.parse(JSON.stringify(sp));
            console.log(data);
            renderHomePage(req, res, data);
        })
});


router.get("/add-to-cart/:id", function(req, res, next) {
    var sanphamid = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {sanphams: {}});
    console.log(cart);
    console.log(req.session.cart)
    SanPham
        .findById(sanphamid)
        .exec(function(err, sp) {
            if (err) {
                return res.redirect("/");
            }

            cart.add(sp, sp.id);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('/');
        })
})

router.get("/shopping-cart", function(req, res, next) {
    if (!req.session.cart) {
        res.redirect("/");
    }
    var cart = new Cart(req.session.cart);

    // console.log("cart:", cart);
    // res.send(cart);
    console.log("cart array:", cart.generateArray());
    res.render("shopping-cart", {
        cart: cart.generateArray(),
        tongSoLuong: cart.tongSoLuong,
        thanhTien: cart.thanhTien
    })
})

router.get('/reduce/:sanphamid', function(req, res) {
    var sanphamid = req.params.sanphamid;
    var cart = new Cart(req.session.cart ? req.session.cart : { sanphams: {} });

    cart.reduceByOne(sanphamid);
    req.session.cart = cart;
    res.redirect("/shopping-cart");
})

router.get('/increase/:sanphamid', function (req, res) {
    var sanphamid = req.params.sanphamid;
    var cart = new Cart(req.session.cart ? req.session.cart : { sanphams: {} });

    cart.increaseByOne(sanphamid);
    req.session.cart = cart;
    res.redirect("/shopping-cart");
})

router.get('/remove/:sanphamid', function(req, res) {
    var sanphamid = req.params.sanphamid;
    var cart = new Cart(req.session.cart ? req.session.cart : { sanphams: {} });

    cart.removeItem(sanphamid);
    req.session.cart = cart;
    res.redirect("/shopping-cart");
})

router.post("/submit", function (req, res) {
    if (!req.session.cart) {
        res.send(null)
    }
    var cart = new Cart(req.session.cart ? req.session.cart : { sanphams: {} });

    // define req.body
    var tenKhachHang= req.body.tenKhachHang;
    var diaChi = req.body.diaChi;
    var dienThoai = req.body.dienThoai;
    var ghiChu = "";
    var ngayGiaoHang = "";

    var cartArr = cart.generateArray();
    var spArr = [];

    for (var i = 0; i < cartArr.length; i++) {
        spArr.push({
            maSanPham: cartArr[i].sanpham._id,
            tenSanPham: cartArr[i].sanpham.tenSanPham,
            donGia: cartArr[i].sanpham.donGia,
            soLuong: cartArr[i].soLuong
        })
    }



    // res.send({
    //     cart: cart,
    //     cartArray: cart.generateArray(),
    //     tenKhachHang: req.body.tenKhachHang,
    //     diaChi: req.body.diaChi,
    //     dienThoai: req.body.dienThoai,
    // })

    DonHang.create({
        tenKhachHang: tenKhachHang,
        diaChi: diaChi,
        dienThoai: dienThoai,
        ngayDatHang: (new Date()).toISOString(),
        ngayGiaoHang: ngayGiaoHang,
        ghiChu: ghiChu,
        sanPham: spArr,
        thanhTien: cart.thanhTien
    }, function (err, dh) {
        if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
        } else {
            cart.removeAllItem();
            req.session.cart = cart;
            res.redirect("/");
            // sendJSONresponse(res, 201, dh);
        }
    })
})

module.exports = router;