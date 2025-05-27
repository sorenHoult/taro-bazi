import { getSplitTime } from "@/utils";

function addZero(num) {
  return Number(num) < 10 ? `0${num}` : num;
}

export const formatDate = (year, month, day, hour, minute) => {
  const newmonth = addZero(month);
  const newday = addZero(day);
  const newhour = addZero(hour);
  const newminute = addZero(minute);
  return `${year}-${newmonth}-${newday} ${newhour}:${newminute}`;
};

// 获取当前时间
export const getDate = (range) => {
  return `${parseInt(range[0]) + 100}-01-01 00:00`;
};

// 获取对应年份月份的天数
export const getMonthDay = (year, month) => {
  var d = new Date(year, month, 0);
  return d.getDate();
};

//根据时间2019-01-02 09：12  得到 ['2019','1','2','9','12']
export const getArrWithTime = (str) => {
  const arr = getSplitTime(str);
  arr[1] = arr[1].startsWith("0") ? arr[1].substr(1, arr[1].length) : arr[1];
  arr[2] = arr[2].startsWith("0") ? arr[2].substr(1, arr[2].length) : arr[2];
  arr[3] = arr[3].startsWith("0") ? arr[3].substr(1, arr[3].length) : arr[3];
  arr[4] = arr[4].startsWith("0") ? arr[4].substr(1, arr[4].length) : arr[4];
  return arr;
};

// 获取天数列表
export const getDayList = (year, month) => {
  const dayList: string[] = [];
  var d = new Date(year, month, 0);
  for (let i = 1; i <= d.getDate(); i++) {
    dayList.push(String(i));
  }
  return dayList;
};

// 获取公历的年、月、日、时、分的集合
export const getPickerGregorianList = (year, month, range) => {
  const yearList: string[] = [];
  const monthList: string[] = [];
  const dayList: string[] = getDayList(year, month);
  const hourList: string[] = [];
  const minuteList: string[] = [];
  const start = parseInt(range[0]);
  const end = parseInt(range[1]);

  for (let i = start; i <= end; i++) {
    yearList.push(String(i));
  }
  for (let i = 1; i <= 12; i++) {
    monthList.push(String(i));
  }

  for (let i = 0; i <= 23; i++) {
    hourList.push(String(i));
  }
  for (let i = 0; i <= 59; i++) {
    minuteList.push(String(i));
  }
  hourList.unshift("未知");
  minuteList.unshift("未知");
  return { yearList, monthList, dayList, hourList, minuteList };
};
