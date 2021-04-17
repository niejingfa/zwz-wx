var api = require('../../../config/api.js');
var check = require('../../../utils/check.js');
var util = require('../../../utils/util.js');
var area = require('../../../utils/area.js');

var app = getApp();
Page({
  data: {
    username: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    code: '',
    orgAddressDetail: '',
    picUrls: [],
    source: '',
    isOrg: 0,
    areaCode: 0,
    province: '',
    city: '',
    county: '',
    addressId: 0,
    openSelectRegion: false,
    selectRegionList: [{
        code: 0,
        name: '省份'
      },
      {
        code: 0,
        name: '城市'
      },
      {
        code: 0,
        name: '区县'
      }
    ],
    regionType: 1,
    regionList: [],
    selectRegionDone: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成

  },
  onReady: function() {

  },
  onShow: function() {
    // 页面显示

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  sendCode: function() {
    let that = this;

    if (this.data.mobile.length == 0) {
      wx.showModal({
        title: '错误信息',
        content: '手机号不能为空',
        showCancel: false
      });
      return false;
    }

    wx.request({
      url: api.AuthRegisterCaptcha,
      data: {
        mobile: that.data.mobile
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.errno == 0) {
          wx.showModal({
            title: '发送成功',
            content: '验证码已发送',
            showCancel: false
          });
        } else {
          wx.showModal({
            title: '错误信息',
            content: res.data.errmsg,
            showCancel: false
          });
        }
      }
    });
  },
  requestRegister: function(wxCode) {
    let that = this;
    wx.request({
      url: api.AuthRegister,
      data: {
        username: that.data.username,
        password: that.data.password,
        mobile: that.data.mobile,
        code: that.data.code,
        wxCode: wxCode,
        isOrg: that.data.isOrg,
        picUrls: picUrls,
        country: this.data.country,
        province: this.data.province,
        city: this.data.city,
        areaCode: this.data.areaCode,
        orgAddressDetail: this.data.orgAddressDetail
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.errno == 0) {
          app.globalData.hasLogin = true;
          wx.setStorageSync('userInfo', res.data.data.userInfo);
          wx.setStorage({
            key: "token",
            data: res.data.data.token,
            success: function() {
              wx.switchTab({
                url: '/pages/ucenter/index/index'
              });
            }
          });
        } else {
          wx.showModal({
            title: '错误信息',
            content: res.data.errmsg,
            showCancel: false
          });
        }
      }
    });
  },
  startRegister: function() {
    var that = this;

    if (this.data.password.length < 6 || this.data.username.length < 6) {
      wx.showModal({
        title: '错误信息',
        content: '用户名和密码不得少于6位',
        showCancel: false
      });
      return false;
    }

    if (this.data.password != this.data.confirmPassword) {
      wx.showModal({
        title: '错误信息',
        content: '确认密码不一致',
        showCancel: false
      });
      return false;
    }

    if (this.data.mobile.length == 0 || this.data.code.length == 0) {
      wx.showModal({
        title: '错误信息',
        content: '手机号和验证码不能为空',
        showCancel: false
      });
      return false;
    }

    wx.login({
      success: function(res) {
        if (!res.code) {
          wx.showModal({
            title: '错误信息',
            content: '注册失败',
            showCancel: false
          });
        }


    if (this.data.isOrg == 1) {
      if (this.data.source == '') {
        wx.showModal({
          title: '错误信息',
          content: '商户证件不能为空',
          showCancel: false
        });
        return false;
      }
      if (this.country == '' || this.province == '' || this.city == '' || areaCode == '') {
        wx.showModal({
          title: '错误信息',
          content: '商户地址不能为空',
          showCancel: false
        });
        return false;
      }
    }

        that.requestRegister(res.code);
      }
    });
  },
  bindUsernameInput: function(e) {

    this.setData({
      username: e.detail.value
    });
  },
  bindPasswordInput: function(e) {

    this.setData({
      password: e.detail.value
    });
  },
  bindConfirmPasswordInput: function(e) {

    this.setData({
      confirmPassword: e.detail.value
    });
  },
  bindMobileInput: function(e) {

    this.setData({
      mobile: e.detail.value
    });
  },
  bindCodeInput: function(e) {

    this.setData({
      code: e.detail.value
    });
  },
  clearInput: function(e) {
    switch (e.currentTarget.id) {
      case 'clear-username':
        this.setData({
          username: ''
        });
        break;
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
      case 'clear-confirm-password':
        this.setData({
          confirmPassword: ''
        });
        break;
      case 'clear-mobile':
        this.setData({
          mobile: ''
        });
        break;
      case 'clear-code':
        this.setData({
          code: ''
        });
        break;
      case 'clear-org-address-detail':
        this.setData({
          orgAddressDetail: ''
        })
        break;
    }
  },
  bindOrgAddressDetailInput: function(e) {
    this.setData({
      orgAddressDetail: e.detail.value
    });
  },
  uploader: function() {
    var that = this;
    wx.chooseImage({  //从本地相册选择图片或使用相机拍照
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:function(res){
        //console.log(res)
        //前台显示
        that.setData({
          source: res.tempFilePaths
        })
        console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: api.StorageUpload,
          filePath: tempFilePaths[0],
          name: 'file',
          success:function(res){
            //打印
            console.log(res.data)
            var _res = JSON.parse(res.data);
            if (_res.errno === 0) {
              var url = _res.data.url
              that.data.picUrls.push(url)
              that.setData({
                picUrls: that.data.picUrls
              })
            }
          }
        })
      }
    })
  },
  bindIsDefault() {
    let isOrg = this.data.isOrg;
    isOrg = !isOrg;
    this.setData({
      isOrg: isOrg
    });
  },
  bindOrgAddressInput: function(e) {

    this.setData({
      orgAddress: e.detail.value
    });
  },
  chooseRegion() {
    let that = this;
    this.setData({
      openSelectRegion: !that.data.openSelectRegion
    });

    console.log()

    //设置区域选择数据
    let address = this.data;
    if (address.areaCode > 0) {
      let selectRegionList = this.data.selectRegionList;
      selectRegionList[0].code = address.areaCode.slice(0, 2) + '0000';
      selectRegionList[0].name = address.province;

      selectRegionList[1].code = address.areaCode.slice(0, 4) + '00';
      selectRegionList[1].name = address.city;

      selectRegionList[2].code = address.areaCode;
      selectRegionList[2].name = address.county;

      let regionList = area.getList('county', address.areaCode.slice(0, 4));
      regionList = regionList.map(item => {
        //标记已选择的
        if (address.areaCode === item.code) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        return item;
      })

      this.setData({
        selectRegionList: selectRegionList,
        regionType: 3,
        regionList: regionList
      });

    } else {
      let selectRegionList = [{
            code: 0,
            name: '省份',
          },
          {
            code: 0,
            name: '城市',
          },
          {
            code: 0,
            name: '区县',
          }
        ];

      this.setData({
        selectRegionList: selectRegionList,
        regionType: 1,
        regionList: area.getList('province')
      });
    }

    this.setRegionDoneStatus();
  },
  setRegionDoneStatus() {
    let that = this;
    let doneStatus = that.data.selectRegionList.every(item => {
      return item.code != 0;
    });

    that.setData({
      selectRegionDone: doneStatus
    })

  },
  selectRegionType(event) {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = that.data.selectRegionList;

    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex - 1].code <= 0)) {
      return false;
    }

    let selectRegionItem = selectRegionList[regionTypeIndex];
    let code = selectRegionItem.code;
    let regionList;
    if (regionTypeIndex === 0) {
      // 点击省级，取省级
      regionList = area.getList('province');
    }
    else if (regionTypeIndex === 1) {
      // 点击市级，取市级
      regionList = area.getList('city', code.slice(0, 2)); 
    }
    else{
      // 点击县级，取县级
      regionList = area.getList('county', code.slice(0, 4)); 
    }

    regionList = regionList.map(item => {
      //标记已选择的
      if (that.data.selectRegionList[regionTypeIndex].code == item.code) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      return item;
    })

    this.setData({
      regionList: regionList,
      regionType: regionTypeIndex + 1
    })

    this.setRegionDoneStatus();
  },
  selectRegion(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    let regionItem = this.data.regionList[regionIndex];
    let regionType = this.data.regionType;
    let selectRegionList = this.data.selectRegionList;
    selectRegionList[regionType - 1] = regionItem;

    if (regionType == 3) {
      this.setData({
        selectRegionList: selectRegionList
      })

      let regionList = that.data.regionList.map(item => {
        //标记已选择的
        if (that.data.selectRegionList[that.data.regionType - 1].code == item.code) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        return item;
      })

      this.setData({
        regionList: regionList
      })

      this.setRegionDoneStatus();
      return
    }

    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType - 1) {
        item.code = 0;
        item.name = index == 1 ? '城市' : '区县';
      }
      return item;
    });

    this.setData({
      selectRegionList: selectRegionList,
      regionType: regionType + 1
    })
    
    let code = regionItem.code;
    let regionList = [];
    if (regionType === 1) {
      // 点击省级，取市级
      regionList= area.getList('city', code.slice(0, 2))
    }
    else {
      // 点击市级，取县级
      regionList= area.getList('county', code.slice(0, 4))
    }

    this.setData({
      regionList: regionList
    })

    this.setRegionDoneStatus();
  },
  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }

    let address = this.data;
    let selectRegionList = this.data.selectRegionList;
    address.province = selectRegionList[0].name;
    address.city = selectRegionList[1].name;
    address.county = selectRegionList[2].name;
    address.areaCode = selectRegionList[2].code;

    this.setData({
      province: address.province,
      city: address.city,
      county: address.county,
      areaCode: address.areaCode,
      openSelectRegion: false
    });

  },
  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });

  },
  cancelAddress() {
    wx.navigateBack();
  },
})