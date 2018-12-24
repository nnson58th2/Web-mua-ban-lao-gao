var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

var upload = multer({ storage: storage });


var Employer = mongoose.model("Employer");
var SanPham = mongoose.model("SanPham");
var DonHang = mongoose.model("DonHang");








var checkAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/employer/login");
  }
}


var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};





router.get("/", checkAuth, function(req, res, next) {
  Employer
    .findById(req.session.passport.user.id)
    .select("-password")
    .exec(function(err, em) {
      if (err) {
        sendJSONresponse(res, 404, {
          "message": "Employer is not found"
        });
        return;
      }
      res.render("employer", {profile: em});      
    })

})



/* SanPham controller */

router.get("/form", checkAuth, function(req, res, next) {
  res.render("sanpham", {});
})





/* GET list SanPham */
router.get("/sanpham", checkAuth, function(req, res, next) {

  // SanPham
  //   .find()
  //   .exec(function(err, sp) {
  //     if (!sp) {
  //       sendJSONresponse(res, 404, {
  //         "message": "SanPham is not found"
  //       });
  //       return;
  //     } else if (err) {
  //       sendJSONresponse(res, 404, err);
  //       return;
  //     }
  //     sendJSONresponse(res, 200, sp);
  //   })
  SanPham
    .find()
    .exec(function (err, sp) {
      if (!sp) {
        sendJSONresponse(res, 404, {
          "message": "SanPham is not found"
        });
        return;
      } else if (err) {
        // sendJSONresponse(res, 404, err);
        res.redirect("/employer");
        return;
      }
      var data = JSON.parse(JSON.stringify(sp));
      res.render("sanpham", {listSanPham: data});
    })
})

// GET detail sanpham
router.get("/sanpham/:id", checkAuth, function(req, res) {
  SanPham.findById(req.params.id, function(err, sp) {
    if (!sp) {
      sendJSONresponse(res, 404, {
        "message": "sp is not found"
      });
      return;
    } else if (err) {
      sendJSONresponse(res, 404, err);
      return;
    }
    sendJSONresponse(res, 200, sp);
  })
})


// CREATE sanpham
router.post("/sanpham", checkAuth, upload.single('anh'), function(req, res) {
  // var file = './public/upload/' + req.file.filename;
  // var fs = require('fs');

  // fs.unlink(file, function (e) {
  //   if (e) throw e;
  // });

  SanPham
    .create({
      tenSanPham: req.body.tenSanPham,
      donGia: req.body.donGia,
      soLuong: req.body.soLuong,
      anh: '/upload/' + req.file.filename
    }, function(err, sp) {
      if (err) {
        // sendJSONresponse(res, 400, err);
        res.redirect("/employer");
        return;
      } else {
        // sendJSONresponse(res, 201, sp);
        res.redirect("/employer/sanpham");
      }
    })
})


// UPDATE sanpham
router.post("/sanpham/update/:id", checkAuth, upload.single('anh'), function(req, res) {
  SanPham
    .findById(req.params.id)
    .exec(function(err, sp) {
      if (!sp) {
        // sendJSONresponse(res, 404, {
        //   "message": "sp is not found"
        // });
        res.redirect("/employer");
        return;
      } else if (err) {
        // sendJSONresponse(res, 404, err);
        res.redirect("/employer");
        return;
      }

      var anh = sp.anh;
      if (req.file) {
        anh = '/upload/' + req.file.filename;
      }

      sp.tenSanPham = req.body.tenSanPham;
      sp.donGia = req.body.donGia;
      sp.soLuong = req.body.soLuong;
      sp.anh = anh;

      sp.save(function(err, sp) {
        if (err) {
          // sendJSONresponse(res, 404, err);
          res.redirect("/employer");
          return;
        } else {
          // sendJSONresponse(res, 200, sp);
          res.redirect("/employer/sanpham");
        }
      });

    })
})

// DELETE sanpham
router.get("/sanpham/remove/:id", checkAuth, function(req, res) {

  SanPham
    .findByIdAndRemove(req.params.id)
    .exec(
      function(err, sp) {
        if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }

        console.log("SP id", req.params.id, "deleted");
        // sendJSONresponse(res, 204, null);
        res.redirect("/employer/sanpham");
      }
    )
})





/* DonHang controller */

router.get("/donhang", checkAuth, function(req, res) {
  DonHang
    .find()
    .exec(
      function(err, dh) {
        if (err) {
          sendJSONresponse(res, 404, err);
          return;
        }
        
        // sendJSONresponse(res, 200, dh);
        var data = JSON.parse(JSON.stringify(dh));
        console.log("data:", data);
        // res.send(data);
        res.render("donhang", {listDonHang: data});
      }
    )
})

router.get("/donhang/:donhangid", checkAuth, function(req, res) {
  var donhangid = req.params.donhangid;
  DonHang
  .findById(donhangid)
  .exec(
    function(err, dh) {
      if (!dh) {
        sendJSONresponse(res, 404, {
          "message": "dh is not found"
        })
        return;
      } else if (err) {
        sendJSONresponse(res, 404, err);
        return;
      }
      // sendJSONresponse(res, 200, dh);
      var data = JSON.parse(JSON.stringify(dh));
      console.log("data:", data);
      res.render("donhang-chitiet", {donHang: data});
    }
  )
})

router.post("/donhang", checkAuth, function(req, res) {

  console.log("start");
  DonHang.create({
    tenKhachHang: req.body.tenKhachHang,
    diaChi: req.body.diaChi,
    dienThoai: req.body.dienThoai,
    ngayDatHang: req.body.ngayDatHang,
    ngayGiaoHang: req.body.ngayGiaoHang,
    ghiChu: req.body.ghiChu,
    sanPham: req.body.sanPham,
    thanhTien: req.body.thanhTien
  }, function (err, dh) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      sendJSONresponse(res, 201, dh);
    }
  })
})

router.put("/donhang/:donhangid", checkAuth, function(req, res) {
  var donhangid = req.params.donhangid;

  DonHang
    .findById(donhangid)
    .exec(
      function(err, dh) {
        if (!dh) {
          sendJSONresponse(res, 404, {
            "message": "dh is not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 404, err);
          return;
        }

        dh.tenKhachHang = req.body.tenKhachHang;
        dh.diaChi = req.body.diaChi;
        dh.dienThoai = req.body.dienThoai;
        dh.ngayDatHang = req.body.ngayDatHang;
        dh.ngayGiaoHang = req.body.ngayGiaoHang;
        dh.ghiChu = req.body.ghiChu;
        dh.thanhTien = req.body.thanhTien;
        dh.sanPham = req.body.sanPham;

        dh.save(function(err, dh) {
          if (err) {
            sendJSONresponse(res, 404, err);
            console.log(err);
            return;
          }
          sendJSONresponse(res, 200, dh);
        })
      }
    )
})

router.delete("/donhang/:donhangid", checkAuth, function(req, res) {
  var donhangid = req.params.donhangid;

  DonHang
    .findByIdAndRemove(donhangid)
    .exec(
      function(err, dh) {
        if (err) {
          sendJSONresponse(res, 404, err);
          return;
        } else {
          console.log("SP id", donhangid, "deleted");
          sendJSONresponse(res, 204, null);
        }
      }
    )
})











router.get("/login", function (req, res, next) {
  res.render("login");
})

router.get("/signup", function (req, res, next) {
  res.render("signup");
})

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/employer/login");
})

module.exports = router;