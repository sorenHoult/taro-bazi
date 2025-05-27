import lunarData from "@/assets/dict/lunarData";

// 农历月份列表
const lunarMonths = [
  "正",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "冬",
  "腊",
];

// 农历日期列表
const lunarDays = [
  "初一",
  "初二",
  "初三",
  "初四",
  "初五",
  "初六",
  "初七",
  "初八",
  "初九",
  "初十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "二十",
  "廿一",
  "廿二",
  "廿三",
  "廿四",
  "廿五",
  "廿六",
  "廿七",
  "廿八",
  "廿九",
  "三十",
];

function addZero(num) {
  return Number(num) < 10 ? `0${num}` : num;
}

export const formatDate = (year, month, day, hour, minute) => {
  const newhour = addZero(hour);
  const newminute = addZero(minute);
  return `${year}-${month}-${day} ${newhour}:${newminute}`;
};

// 获取当前时间
export const getDate = () => {
  return "2023-正-初一 00:00";
};

//根据时间2019-01-02 09：12  得到 ['2019','1','2','9','12']
export const getArrWithTime = (str) => {
  const arr = str.split(/[-\s:]/);
  arr[3] = arr[3].startsWith("0") ? arr[3].substr(1, arr[3].length) : arr[3];
  arr[4] = arr[4].startsWith("0") ? arr[4].substr(1, arr[4].length) : arr[4];
  return arr;
};

// 获取天数列表
export const getDayList = (year, month) => {
  // 获取指定年份的农历数据
  const lunarYearData = lunarData[year - 1900];
  const lunarYearDecimalData = parseInt(lunarYearData, 16);
  const decimalData = lunarYearDecimalData
    .toString(2)
    .padStart(20, "0")
    .slice(4, 16);
  const monthIndex = lunarMonths.findIndex((item) => item === month);

  let isLessMonth = false;
  if (monthIndex === -1) {
    isLessMonth = lunarYearData[2] === "0";
  } else {
    isLessMonth = decimalData[monthIndex] === "0";
  }  
  if (isLessMonth) return lunarDays.slice(0, 29);
  else return lunarDays;
};

// 是否有闰月
function getLeapMonth(year) {
  // 获取指定年份的农历数据
  const lunarYearData = lunarData[year - 1900];
  const lastChar = lunarYearData[lunarYearData.length - 1];
  if (lastChar === "a") return 10;
  if (lastChar === "b") return 11;
  if (lastChar === "c") return 12;
  return parseInt(lastChar);
}

// 获取月份列表
export const getMonthList = (year) => {
  const leapMonth = getLeapMonth(year);
  const monthList: string[] = [];
  for (let month = 1; month <= 12; month++) {
    monthList.push(lunarMonths[month - 1]);
    if (leapMonth === month) {
      monthList.push("闰" + lunarMonths[month - 1]);
    }
  }
  // console.log(leapMonth, monthList);
  return monthList;
};

// 获取农历的年、月、日、时、分的集合
export const getPickerLunarList = (year, month) => {
  const yearList: string[] = [];
  const monthList: string[] = getMonthList(year);
  const dayList: string[] = getDayList(year, month);
  const hourList: string[] = [];
  const minuteList: string[] = [];

  for (let i = 1900; i <= 2100; i++) {
    yearList.push(String(i));
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
