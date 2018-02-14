const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function today(date) {//显示今天的日
  return date.getDate();
}

function curMonth(date) {//显示今天的月
  return date.getMonth() + 1;
}

module.exports = {
  formatTime: formatTime,
  today: today,//显示今天的日
  curMonth: curMonth//显示今天的月
}
