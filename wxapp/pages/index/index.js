//index.js
//获取应用实例
var util = require('../../utils/util.js');
var d = new Date()
const app = getApp()

function dummyArrangeList() {
  return [
    {
      start: "2018/02/14",
      end:   "2018/02/28",
      title: "2018年春节休假安排",
      id:    123,
      creator: "Figo Feng",
      attendCnt: 28,
    },
    {
      start: "2018/09/25",
      end: "2018/10/12",
      title: "2018年十一休假安排",
      id: 124,
      creator: "Figo Feng",
      attendCnt: 28,
    }
  ]
}

Page({
  data: {
    motto: 'Hello World',
    winWidth: 0,
    winHeight: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentTab: 0,
    selectDayStr: '',
    today: util.today(new Date),//for today
    curMonth: util.curMonth(new Date),//for today
    
  },
  onLoad: function () {
    var that = this
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          scrollViewHeight: res.windowHeight * res.pixelRatio || 667
        });
      }

    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log('user logged')
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.loadMyArranges()
    this.loadCalendarData()
    
  },

  loadMyArranges: function() {
    var arrangeList = dummyArrangeList()//from backend
    var dateStrToIds = {}
    var allmyDates = new Array()
    var allMyDatesStr = []
    for (var i in arrangeList) {
      var startDate = new Date(arrangeList[i].start)
      var endDate = new Date(arrangeList[i].end)
      var curRange = util.getDates(startDate, endDate)
      for (var j in curRange) {
        var strDate = util.getFormattedDate(curRange[j])
        allMyDatesStr.push(strDate)
        if (!(strDate in dateStrToIds)) {
          dateStrToIds[strDate] = []
        }
        dateStrToIds[strDate].push(arrangeList[i].id)
      }
      allmyDates = allmyDates.concat(curRange)
    }
    this.setData({
      arrangeList: arrangeList,
      fullArrangeList: arrangeList,
      allMyDates: allMyDatesStr,
      dateStrToIds: dateStrToIds,
    })
  },

  getThisMonthDays: function(year, month) {
    return new Date(year, month, 0).getDate();
  },

  getFirstDayOfWeek: function(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },

  // 计算当月1号前空了几个格子
  calculateEmptyGrids: function(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  // 绘制当月天数占的格子
  calculateDays: function (year, month) {
    let days = [];
    var fest = '';
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      var dateObj = new Date(year, month - 1, i)
      var fullStr = util.getFormattedDate(dateObj)
      var isArranged = this.data.allMyDates.includes(fullStr)
      days.push({ 
        date: i,
        fest: util.solarDay3(year, month - 1, i) || util.getCDay(year, month - 1, i),
        isArranged: this.data.allMyDates.includes(fullStr),
        ids: isArranged? this.data.dateStrToIds[fullStr] : undefined,
        fullStr: fullStr,
        })
    }
    this.setData({
      days
    });
  },

  loadCalendarData: function() {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    })
  },

  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  bindChange: function (e) {
    this.setData({ currentTab: e.detail.current });
  },
  onArrangeDetail: function (e) {
    var arrange = e.currentTarget.dataset.arrange
    this.goArrangePage(arrange)
  },
  goArrangePage: function (arrangeId) {
    console.log("arrange id: " + arrangeId)
    wx.navigateTo({
      url: '../arrange/arrange',
    })
  },
  onTapDay: function (e) {
    var ids = e.currentTarget.dataset.ids;
    var fullstr = e.currentTarget.dataset.fullstr;
    this.setData({
      selectDayStr: fullstr
    })
    if (ids) {
      console.log("date: " + fullstr + ", ids: " + ids[0])
      var arrangeList = []
      for (var i in this.data.fullArrangeList) {
        if (ids.includes(this.data.fullArrangeList[i].id)) {
          arrangeList.push(this.data.fullArrangeList[i])
        }
      }
      this.setData({
        arrangeList: arrangeList,
      })
    } else {
      console.log("date: " + fullstr + ", No arrange")
      this.setData({
        arrangeList: this.data.fullArrangeList,
      })
    }
    
  }
})
