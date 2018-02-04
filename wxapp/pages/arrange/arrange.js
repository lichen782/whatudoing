// pages/arrange.js

var d = new Date()
const app = getApp()
const today = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
const default_date = [d.getFullYear(), (d.getMonth() + 1), d.getDate()].join('-')

const status2color = {
  'Working': '#FF9900',
  'Leave': '#FFFF00',
  'WFH':  '#0099CC',
  'AFK':   '#CCCCFF',
  'NotFill': '#CCCCCC'
}

function generateDummyArrange() {
  var dates = [
    '2018-02-12', '2018-02-13', '2018-02-14',
    '2018-02-15', '2018-02-16', '2018-02-17',
    '2018-02-18', '2018-02-19', '2018-02-20',
    '2018-02-21', '2018-02-22', '2018-02-23',
    '2018-02-24', '2018-02-25', '2018-02-26',
    '2018-02-27', '2018-02-28', '2018-02-29',
  ]
  var allStatus = Object.keys(status2color)
  var result = [];
  for (var i = 0; i < dates.length; i++) {
    var ridx = Math.floor(Math.random() * allStatus.length);
    var parts = dates[i].split('-')
    result.push(
      {datekey: dates[i], 
       date: [parts[1], parts[2]].join('/'),
       status: allStatus[ridx],
       color: status2color[allStatus[ridx]]}
    )
  }
  return result
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: today,
    startDate: default_date,
    endDate: default_date,
    myArrange: { 
      nickName: "我", 
      avatarUrl: '../images/head.jpeg', 
      arrange: generateDummyArrange(),
      flag: false,
    },
    fakeArrange: [
      { nickName: '1', avatarUrl: '../images/head2.jpeg', arrange: generateDummyArrange(), flag: false,},
      { nickName: 'one2', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false,},
      { nickName: 'ne3', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false, },
      { nickName: 'one4', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false,},
      { nickName: 'one5', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false, },
      { nickName: 'one6', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false, },
      { nickName: 'ne7', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false, },
      { nickName: 'ne8', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false, },
      { nickName: 'ne9', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false, },
      { nickName: 'ne10', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false, },
      { nickName: 'ne11', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false, },
      { nickName: 'ne12', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false, },
      { nickName: 'ne13', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false, },
      { nickName: 'ne14', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false, },
      { nickName: 'ne15', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false, },
      { nickName: 'ne16', avatarUrl: '../images/head.jpeg', arrange: generateDummyArrange(), flag: false, },
    ],
    currentSelectedPerson: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    var lengend = []
    for (var prop in status2color) {
      lengend.push({
        status: prop,
        color: status2color[prop]
      })
    }
    this.setData({
      lengend: lengend
    })
     
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  bindStartDateChange: function (e) {
    console.log('picker start date，携带值为', e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },

  bindEndDateChange: function (e) {
    console.log('picker end date，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },

  onMyArrangeScroll: function (e) {
    //console.log(e)
    this.setData({
      scrollLeft: e.detail.scrollLeft
    })
  },

  onTapMyDate: function (e) {
    var idx = e.currentTarget.dataset.idx
    //console.log('click idx: ' + idx)
    var curStatus = this.data.myArrange.arrange[idx].status
    var allStatus = Object.keys(status2color).sort()
    var statusOrder = 0
    for(var i = 0; i < allStatus.length; i++) {
      if (curStatus == allStatus[i]) {
        statusOrder = i
        break
      }
    }
    var nextOrder = (statusOrder + 1) % allStatus.length
    this.data.myArrange.arrange[idx].status = allStatus[nextOrder]
    this.data.myArrange.arrange[idx].color = status2color[allStatus[nextOrder]]
    this.setData({
      myArrange: this.data.myArrange
    })
    //console.log("next color: " + status2color[allStatus[nextOrder]])
  },

  onExpandMyDetail: function (e) {
    var name = e.currentTarget.dataset.name
    var key = name + ".flag"
    var val = this.data[name].flag;
    this.setData({
      [key]: !val
    });
  },

  onTapPerson: function (e) {
    var idx = e.currentTarget.dataset.idx
    
    this.setData({
      currentSelectedPerson: idx
    });
  }
})