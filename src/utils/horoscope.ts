import dayjs from "dayjs";
import {
  solar_terms_dict,
  gan_dict,
  zhi_dict,
  month_zhi_dict,
  five_tigers_dict,
  five_mouses_dict,
  gan_elements_dict,
  solar_terms_months_dict,
  zhi_hide_gan_dict,
  twelve_grow_dict,
  state_power_dict,
  zhi_elements_dict,
  zhi_hide_gan_quantization_dict,
  climate_gan_dict,
  climate_zhi_dict,
  climate_month_dict,
  zhi_season_dict,
  generating_relations_dict,
  overcoming_relations_dict,
} from "@/assets/dict/zodiacData";
import { getArrayItem, toRounding } from ".";
import { getSolarTermInfo } from "./solarTerm";

/**
 * 节气
 */
export function calSolarTerm(time, solarTermInfo) {
  const currentDay = dayjs(time.replace(/未知/g, "00"));
  const solarTermArray = Object.keys(solarTermInfo);
  // 该月有3个节气的情况
  if (solarTermArray.length === 3) {
    if (currentDay.isAfter(dayjs(solarTermInfo[solarTermArray[2]]))) {
      return {
        solarTerm: solarTermArray[2],
        isCurrentMonthSolarTerm: true,
      };
    }
  }
  if (currentDay.isAfter(dayjs(solarTermInfo[solarTermArray[1]]))) {
    return {
      solarTerm: solarTermArray[1],
      isCurrentMonthSolarTerm: true,
    };
  } else if (currentDay.isAfter(dayjs(solarTermInfo[solarTermArray[0]]))) {
    return {
      solarTerm: solarTermArray[0],
      isCurrentMonthSolarTerm: true,
    };
  } else {
    const index = solar_terms_dict.findIndex(
      (item) => item === solarTermArray[0]
    );
    return {
      solarTerm: getArrayItem(solar_terms_dict, index - 1),
      isCurrentMonthSolarTerm: false,
    };
  }
}

/**
 * 干支颜色
 */
export function ganzhiDyeing(ganzhi: string) {
  switch (ganzhi) {
    case "甲":
    case "寅":
      return "rgb(71, 196, 120)";
    case "乙":
    case "卯":
      return "rgb(71, 196, 120, 0.6)";
    case "丙":
    case "巳":
      return "rgb(211, 5, 5)";
    case "丁":
    case "午":
      return "rgb(211, 5, 5,0.6)";
    case "戊":
    case "辰":
    case "戌":
      return "rgb(139, 109, 3)";
    case "己":
    case "丑":
    case "未":
      return "rgb(139, 109, 3, 0.6)";
    case "庚":
    case "申":
      return "rgb(250, 173, 20)";
    case "辛":
    case "酉":
      return "rgb(250, 173, 20, 0.6)";
    case "壬":
    case "子":
      return "rgb(24, 144, 255)";
    case "癸":
    case "亥":
      return "rgb(24, 144, 255, 0.6)";
    default:
      return "#000";
  }
}

/**
 * 调候颜色
 */
export function climateDyeing(climate: string) {
  switch (climate) {
    case "暖燥":
      return "rgb(211, 5, 5)";
    case "寒湿":
      return "rgb(24, 144, 255)";
    case "略偏暖燥":
      return "rgb(211, 5, 5,0.6)";
    case "略偏寒湿":
      return "rgb(24, 144, 255, 0.6)";
    default:
      return "#000";
  }
}

/**
 * 十神
 */
export function calTenGod(dayGan) {
  const tenGodInfo = {};
  const dayGanIndex = gan_dict.findIndex((gan) => gan === dayGan);
  const dayGanElement = gan_elements_dict[dayGan];
  for (const item of gan_dict) {
    const itemElement = gan_elements_dict[item];
    const itemIndex = gan_dict.findIndex((gan) => gan === item);
    // 是否同阴同阳
    const samePolarity = (dayGanIndex + itemIndex) % 2 === 0;
    if (generating_relations_dict[dayGanElement] === itemElement) {
      // 我生者
      tenGodInfo[item] = samePolarity ? "食神" : "伤官";
    } else if (generating_relations_dict[itemElement] === dayGanElement) {
      // 生我者
      tenGodInfo[item] = samePolarity ? "偏印" : "正印";
    } else if (overcoming_relations_dict[dayGanElement] === itemElement) {
      // 我克者
      tenGodInfo[item] = samePolarity ? "偏财" : "正财";
    } else if (overcoming_relations_dict[itemElement] === dayGanElement) {
      // 克我者
      tenGodInfo[item] = samePolarity ? "七杀" : "正官";
    } else if (dayGanElement === itemElement) {
      // 同我者
      tenGodInfo[item] = samePolarity ? "比肩" : "劫财";
    }
  }
  return tenGodInfo;
}

/**
 * 八字
 */
export function calHoroscope(
  year: any,
  month: any,
  day: any,
  hour: any,
  solarTerm: string,
  isCurrentMonthSolarTerm: boolean
) {
  year = parseInt(year);
  month = parseInt(month);
  day = parseInt(day);

  const { yearGan, yearZhi } = calGanzhiYear(
    year,
    month,
    isCurrentMonthSolarTerm
  );
  const { monthGan, monthZhi } = calGanzhiMonth(
    yearGan,
    month,
    solarTerm,
    isCurrentMonthSolarTerm
  );
  const { dayGan, dayZhi } = calGanzhiDay(year, month, day, hour);
  const { hourGan, hourZhi } = calGanzhiHour(dayGan, hour);
  return {
    yearGan,
    yearZhi,
    monthGan,
    monthZhi,
    dayGan,
    dayZhi,
    hourGan,
    hourZhi,
  };
}

/**
 * 年干支
 */
function calGanzhiYear(year, month?, isCurrentMonthSolarTerm?) {
  // 新的一年以立春为分界线
  if (month === 1 || (month === 2 && !isCurrentMonthSolarTerm)) {
    year--;
  }
  const index = year + 2997;
  const ganIndex = (index - 1) % 10; // 干的索引
  const zhiIndex = (index - 1) % 12; // 支的索引
  return {
    yearGan: getArrayItem(gan_dict, ganIndex),
    yearZhi: getArrayItem(zhi_dict, zhiIndex),
  };
}

/**
 * 月干支
 */
function calGanzhiMonth(yearGan, month, solarTerm, isCurrentMonthSolarTerm) {
  const startGan = five_tigers_dict[yearGan];
  const startGanIndex = gan_dict.findIndex((item) => item === startGan);
  // 是否节气在当月，-2有时候临界值计算错误
  let lunarMonth = isCurrentMonthSolarTerm ? month - 1 : month - 2;
  lunarMonth = lunarMonth <= 0 ? 12 + lunarMonth : lunarMonth;
  const ganIndex = (startGanIndex + lunarMonth - 1) % 10; // 干的索引
  return {
    monthGan: getArrayItem(gan_dict, ganIndex),
    monthZhi: month_zhi_dict[solarTerm],
  };
}

/**
 * 日干支
 */
function calGanzhiDay(year, month, day, hour) {
  // 1月和2月按上一年的13月和14月来算
  if (month === 1 || month === 2) {
    year--;
    month += 12;
  }
  // 一天从23小时开始
  if (hour == 23) {
    day++;
  }
  const C = Math.floor(year / 100);
  const y = year % 100;
  const g =
    4 * C +
    Math.floor(C / 4) +
    5 * y +
    Math.floor(y / 4) +
    Math.floor((3 * (month + 1)) / 5) +
    day -
    3;
  const z =
    8 * C +
    Math.floor(C / 4) +
    5 * y +
    Math.floor(y / 4) +
    Math.floor((3 * (month + 1)) / 5) +
    day +
    7 +
    (month % 2 === 0 ? 6 : 0);
  const ganIndex = (g - 1) % 10; // 干的索引
  const zhiIndex = (z - 1) % 12; // 支的索引
  return {
    dayGan: getArrayItem(gan_dict, ganIndex),
    dayZhi: getArrayItem(zhi_dict, zhiIndex),
    dayGanIndex: ganIndex,
    dayZhiIndex: zhiIndex,
  };
}

/**
 * 时干支
 */
function calGanzhiHour(dayGan, hour) {
  // 如果没有时辰，则无法计算
  if (hour === "未知") {
    return {
      hourGan: null,
      hourZhi: null,
    };
  }
  const startGan = five_mouses_dict[dayGan];
  const startGanIndex = gan_dict.findIndex((item) => item === startGan);
  const zhiIndex = Math.ceil(hour / 2) % 12; // 支的索引
  const ganIndex = (startGanIndex + zhiIndex) % 10; // 干的索引
  return {
    hourGan: getArrayItem(gan_dict, ganIndex),
    hourZhi: getArrayItem(zhi_dict, zhiIndex),
  };
}

/**
 * 获取上一个月的年月
 */
export function getPreviousMonth(year, month) {
  year = parseInt(year);
  month = parseInt(month);
  if (month === 1) {
    return {
      year: year - 1,
      month: 12,
    };
  } else {
    return {
      year: year,
      month: month - 1,
    };
  }
}

/**
 * 获取下一个月的年月
 */
export function getNextMonth(year, month) {
  year = parseInt(year);
  month = parseInt(month);
  if (month === 12) {
    return {
      year: year + 1,
      month: 1,
    };
  } else {
    return {
      year: year,
      month: month + 1,
    };
  }
}

/**
 * 获取相邻的节
 */
export function getAdjacentSolarTermTime(solarTermInfo, solarTerm) {
  const index = solar_terms_dict.findIndex((item) => item === solarTerm);
  // 当前为气
  if (index % 2 === 0) {
    return {
      previous: solarTermInfo[getArrayItem(solar_terms_dict, index - 1)],
      next: solarTermInfo[getArrayItem(solar_terms_dict, index + 1)],
    };
  }
  // 当前为节
  else {
    return {
      previous: solarTermInfo[solarTerm],
      next: solarTermInfo[getArrayItem(solar_terms_dict, index + 2)],
    };
  }
}

/**
 * 大运顺序
 */
export function calLuckySequence(gender, yearGan) {
  // 阳偶阴奇
  const ganIndex = gan_dict.findIndex((item) => item === yearGan);
  // 男偶女奇
  const genderIndex = gender === "female" ? 1 : 0;
  // 偶数为顺，奇数为逆
  const targetIndex = genderIndex + ganIndex;
  return targetIndex % 2 === 0;
}

/**
 * 起运数
 */
export function calLuckyAge(sequence, time, adjacentSolarTermTime) {
  const currentDay = dayjs(time.replace(/未知/g, "00"));

  let diffTime;
  if (sequence) {
    diffTime = dayjs(adjacentSolarTermTime.next).diff(currentDay, "m");
  } else {
    let previousDay;
    // 处理99年不能正确转日期的情况
    if (adjacentSolarTermTime.previous.slice(0, 3) === "99-") {
      previousDay = dayjs(
        "100-" + adjacentSolarTermTime.previous.slice(3)
      ).subtract(1, "y");
    } else {
      previousDay = dayjs(adjacentSolarTermTime.previous);
    }
    diffTime = currentDay.diff(previousDay, "m");
  }

  const totalDays = diffTime / 12; // 天
  const year = Math.floor(totalDays / 360);
  const month = Math.floor((totalDays % 360) / 30);
  const day = Math.floor(totalDays % 30);
  const hour = Math.round((totalDays % 1) * 24);

  const totalHours = totalDays * 24;
  // 起运时间
  const luckyTime = currentDay.add(totalHours, "h");
  // 起运年龄
  const age = Math.round(luckyTime.diff(currentDay, "M") / 12);

  return {
    year,
    month,
    day,
    hour,
    luckyTime,
    age,
    startYear: parseInt(currentDay.format("YYYY")),
  };
}

/**
 * 小运干支
 */
export function calLuckyAtBirth(sequence, hourGan, hourZhi) {
  const ganIndex = gan_dict.findIndex((item) => item === hourGan);
  const zhiIndex = zhi_dict.findIndex((item) => item === hourZhi);
  const targetGanIndex = sequence ? ganIndex + 1 : ganIndex - 1;
  const targetZhiIndex = sequence ? zhiIndex + 1 : zhiIndex - 1;
  return {
    gan: getArrayItem(gan_dict, targetGanIndex),
    zhi: getArrayItem(zhi_dict, targetZhiIndex),
  };
}

/**
 * 大运列表
 */
export function calLuckyList(
  sequence,
  startYear,
  age,
  monthGan,
  monthZhi,
  hourGan,
  hourZhi
) {
  const luckyList: any[] = [];
  const ganIndex = gan_dict.findIndex((item) => item === monthGan);
  const zhiIndex = zhi_dict.findIndex((item) => item === monthZhi);
  const luckyAtBirth = calLuckyAtBirth(sequence, hourGan, hourZhi);
  for (let i = 0; i < 13; i++) {
    const targetGanIndex = sequence ? ganIndex + i : ganIndex - i;
    const targetZhiIndex = sequence ? zhiIndex + i : zhiIndex - i;
    luckyList.push({
      startYear: i === 0 ? startYear : startYear + age + 10 * (i - 1),
      endYear: startYear + age + 10 * i,
      age: i === 0 ? age : age + 10 * (i - 1),
      gan: i === 0 ? luckyAtBirth.gan : getArrayItem(gan_dict, targetGanIndex),
      zhi: i === 0 ? luckyAtBirth.zhi : getArrayItem(zhi_dict, targetZhiIndex),
    });
  }
  return luckyList;
}

/**
 * 流年列表
 */
export function calFleetingYearList(startYear, endYear) {
  if (startYear === endYear) return [];
  const fleetingYearList: any[] = [];
  for (let i = startYear; i < endYear; i++) {
    const { yearGan, yearZhi } = calGanzhiYear(i);
    fleetingYearList.push({
      year: i,
      gan: yearGan,
      zhi: yearZhi,
    });
  }
  return fleetingYearList;
}

/**
 * 流月列表
 */
export function calFleetingMonthList(yearGan) {
  if (!yearGan) return [];
  const fleetingMonthList: any[] = [];
  for (let i = 0; i < 24; i += 2) {
    // 0 2 4 6 8 10 12 14 16 18 20 22
    const solarTerm = getArrayItem(solar_terms_dict, i + 3);
    const month = i / 2 + 2;
    const { monthGan, monthZhi } = calGanzhiMonth(
      yearGan,
      month,
      solarTerm,
      true
    );
    fleetingMonthList.push({
      solarTerm,
      month,
      gan: monthGan,
      zhi: monthZhi,
    });
  }
  return fleetingMonthList;
}

/**
 * 流日列表
 */
export function calFleetingDayList(adjacentSolarTermTime) {
  const { previous, next } = adjacentSolarTermTime || {};
  if (!previous || !next) return [];
  const fleetingDayList: any[] = [];
  let currentDay = dayjs(previous);
  let count = 0;
  const endDay = dayjs(next);

  const year = currentDay.year();
  const month = currentDay.month() + 1;
  const day = currentDay.date();
  const { dayGanIndex, dayZhiIndex } = calGanzhiDay(year, month, day, 0);

  while (currentDay.isBefore(endDay)) {
    fleetingDayList.push({
      gan: getArrayItem(gan_dict, dayGanIndex + count),
      zhi: getArrayItem(zhi_dict, dayZhiIndex + count),
      date: currentDay.format("M-D"),
    });
    currentDay = currentDay.add(1, "d");
    count++;
  }
  return fleetingDayList;
}

/**
 * 十二长生
 */
export function calTwelveGrow(dayGan) {
  const dayGanIndex = gan_dict.findIndex((item) => item === dayGan);
  const twelveGrowInfo = {};
  // 阳日干顺走
  if (dayGanIndex % 2 === 0) {
    const offsetMap = {
      甲: 1,
      丙: -2,
      戊: -2,
      庚: -5,
      壬: -8,
    };
    const offset = offsetMap[dayGan];
    zhi_dict.forEach((item, index) => {
      twelveGrowInfo[item] = getArrayItem(twelve_grow_dict, index + offset);
    });
  }
  // 阴日干逆走
  else {
    const offsetMap = {
      乙: -6,
      丁: -3,
      己: -3,
      辛: 0,
      癸: 3,
    };
    const offset = offsetMap[dayGan];
    zhi_dict.forEach((item, index) => {
      twelveGrowInfo[item] = getArrayItem(twelve_grow_dict, -index + offset);
    });
  }
  return twelveGrowInfo;
}

/**
 * 空亡
 * 十天干配十二地支，剩余的2个就是空亡
 */
export function getVacancy(gan, zhi) {
  if (!gan || !zhi) return null;
  const ganIndex = gan_dict.findIndex((item) => item === gan);
  const zhiIndex = zhi_dict.findIndex((item) => item === zhi);
  let diffIndex = zhiIndex - ganIndex;
  diffIndex = diffIndex < 0 ? diffIndex + 11 : diffIndex;
  if (diffIndex === 0 || diffIndex === 11) return "戌亥"; // 甲子旬
  if (diffIndex === 9 || diffIndex === 10) return "申酉"; // 甲戌旬
  if (diffIndex === 7 || diffIndex === 8) return "午未"; // 甲申旬
  if (diffIndex === 5 || diffIndex === 6) return "辰巳"; // 甲午旬
  if (diffIndex === 3 || diffIndex === 4) return "寅卯"; // 甲辰旬
  if (diffIndex === 1 || diffIndex === 2) return "子丑"; // 甲寅旬
  else return null;
}

/**
 * 八字反算公历时间
 */
export function guessGregorian(yearRange, ganzhi) {
  let [startYear, endYear] = yearRange.split("~");
  startYear = parseInt(startYear);
  endYear = parseInt(endYear);

  const regex = /[\s,.，。、]+/;
  const matches = ganzhi.trim().split(regex);

  if (!matches || matches.length < 3) return [];

  const [yGanZhi, mGanZhi, dGanZhi, hGanZhi] = matches;
  const yGan = yGanZhi[0];
  const yZhi = yGanZhi[1];
  const mGan = mGanZhi[0];
  const mZhi = mGanZhi[1];
  const dGan = dGanZhi[0];
  const dZhi = dGanZhi[1];
  const hGan = hGanZhi?.[0];
  const hZhi = hGanZhi?.[1];
  let count = 0;

  const yearMonthArray: any[] = [];
  let hourArray: number[] = [];
  const timeArray: string[] = [];

  const solarTermArray: string[] = [];

  for (let j in month_zhi_dict) {
    if (month_zhi_dict[j] === mZhi) {
      solarTermArray.push(j);
    }
    count += 1;
  }

  const m1 = solar_terms_months_dict[solarTermArray[0]];
  const m2 = m1 === 12 ? 1 : m1 + 1;

  for (let y = startYear; y <= endYear; y++) {
    const { yearGan: yearGan1, yearZhi: yearZhi1 } = calGanzhiYear(y, m1, true);
    const { yearGan: yearGan2, yearZhi: yearZhi2 } = calGanzhiYear(y, m2, true);
    const { yearGan: yearGan3, yearZhi: yearZhi3 } = calGanzhiYear(
      y,
      m2,
      false
    );

    if (yearGan1 === yGan && yearZhi1 === yZhi) {
      if (
        calGanzhiMonth(yGan, m1, null, true).monthGan === mGan ||
        calGanzhiMonth(yGan, m2, null, true).monthGan === mGan
      ) {
        yearMonthArray.push([y, m1]);
      }
    }

    if (yearGan2 === yGan && yearZhi2 === yZhi) {
      if (
        calGanzhiMonth(yGan, m1, null, true).monthGan === mGan ||
        calGanzhiMonth(yGan, m2, null, true).monthGan === mGan
      ) {
        yearMonthArray.push([y, m2]);
      }
    } else if (yearGan3 === yGan && yearZhi3 === yZhi) {
      if (
        calGanzhiMonth(yGan, m1, null, false).monthGan === mGan ||
        calGanzhiMonth(yGan, m2, null, false).monthGan === mGan
      ) {
        yearMonthArray.push([y, m2]);
      }
    }
    count += 1;
  }

  if (hGanZhi) {
    for (let h = 0; h <= 23; h++) {
      const { hourGan, hourZhi } = calGanzhiHour(dGan, h);
      if (hourGan === hGan && hourZhi === hZhi) {
        hourArray.push(h);
      }
      count += 1;
    }
  } else {
    hourArray.push(0);
  }

  for (const ym of yearMonthArray) {
    const y = ym[0];
    const m = ym[1];
    const days = new Date(y, m, 0).getDate();
    for (const h of hourArray) {
      for (let d = 1; d <= days; d++) {
        const { dayGan, dayZhi } = calGanzhiDay(y, m, d, h);
        if (dayGan === dGan && dayZhi === dZhi) {
          const newTime = dayjs(`${y}-${m}-${d} ${h}:00`).format(
            hGanZhi ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD 未知:未知"
          );
          // 计算当月节气
          const solarTermInfo = getSolarTermInfo(y, m);
          const { solarTerm } = calSolarTerm(newTime, solarTermInfo);
          if (solarTermArray.includes(solarTerm)) {
            timeArray.push(newTime);
          }
        }
        count += 1;
      }
      count += 1;
    }
    count += 1;
  }
  // console.log("查询次数:", count);
  return timeArray;
}

/**
 * 取格局
 */
export function getSituation(horoscopeInfo, tenGodInfo) {
  const {
    yearGan,
    yearZhi,
    monthGan,
    monthZhi,
    dayGan,
    dayZhi,
    hourGan,
    hourZhi,
  } = horoscopeInfo;
  let situationState: string = "";
  let situationDesc: string = "";
  const monthZhiHideGan = zhi_hide_gan_dict[monthZhi] || [];
  // 建禄格，临官之位
  if (dayGan === monthZhiHideGan[0]) {
    const dayGanIndex = gan_dict.findIndex((gan) => gan === dayGan);
    situationState = "建禄";
    situationDesc = `${dayGanIndex % 2 === 0 ? "阳" : "阴"}天干生于临官之位`;
    return `${situationState}格 (${situationDesc})`;
  }

  // 阳刃格，帝旺之位，一共5个
  const YangBladeList = [
    {
      dayGan: "甲",
      monthZhi: "卯",
    },
    {
      dayGan: "丙",
      monthZhi: "午",
    },
    {
      dayGan: "戊",
      monthZhi: "午",
    },
    {
      dayGan: "庚",
      monthZhi: "酉",
    },
    {
      dayGan: "壬",
      monthZhi: "子",
    },
  ];
  const isYangBlade = YangBladeList.find((item) => {
    return item.dayGan === dayGan && item.monthZhi === monthZhi;
  });
  if (isYangBlade) {
    situationState = "阳刃";
    situationDesc = "阳天干生于帝旺之位";
    return `${situationState}格 (${situationDesc})`;
  }

  // 阴刃格，冠带之位，一共5个
  const YinBladeList = [
    {
      dayGan: "乙",
      monthZhi: "辰",
    },
    {
      dayGan: "丁",
      monthZhi: "未",
    },
    {
      dayGan: "己",
      monthZhi: "未",
    },
    {
      dayGan: "辛",
      monthZhi: "戌",
    },
    {
      dayGan: "癸",
      monthZhi: "丑",
    },
  ];
  const isYinBlade = YinBladeList.find((item) => {
    return item.dayGan === dayGan && item.monthZhi === monthZhi;
  });
  if (isYinBlade) {
    situationState = "阴刃";
    situationDesc = "阴天干生于冠带之位";
    return `${situationState}格 (${situationDesc})`;
  }

  // 第一步
  const appearAtMonth = monthZhiHideGan.find((gan: string) => gan === monthGan);
  if (appearAtMonth) {
    situationState = tenGodInfo[appearAtMonth];
    situationDesc = "月地支透于月天干";
    if (!["比肩", "劫财"].includes(situationState)) {
      return `${situationState}格 (${situationDesc})`;
    }
  }

  // 第二步
  const appearAtHour = monthZhiHideGan.find((gan: string) => gan === hourGan);
  if (appearAtHour) {
    situationState = tenGodInfo[appearAtHour];
    situationDesc = "月地支透于时天干";
    if (!["比肩", "劫财"].includes(situationState)) {
      return `${situationState}格 (${situationDesc})`;
    }
  }

  // 第三步
  const appearAtYear = monthZhiHideGan.find((gan: string) => gan === yearGan);
  if (appearAtYear) {
    situationState = tenGodInfo[appearAtYear];
    situationDesc = "月地支透于年天干";
    if (!["比肩", "劫财"].includes(situationState)) {
      return `${situationState}格 (${situationDesc})`;
    }
  }

  // 第四步，退回六格统计
  const YearZhiHideGan = zhi_hide_gan_dict[yearZhi] || [];
  const DayZhiHideGan = zhi_hide_gan_dict[dayZhi] || [];
  const HourZhiHideGan = zhi_hide_gan_dict[hourZhi] || [];

  const ganList = [
    {
      label: "月",
      value: monthGan,
    },
    {
      label: "时",
      value: hourGan,
    },
    {
      label: "年",
      value: yearGan,
    },
  ];
  // 顺序可能有点问题
  const appearAtOtherGan = ganList.find((ganItem: any) => {
    if (DayZhiHideGan.includes(ganItem.value)) {
      situationState = tenGodInfo[ganItem.value];
      situationDesc = `日地支透于${ganItem.label}天干`;
      return true;
    } else if (HourZhiHideGan.includes(ganItem.value)) {
      situationState = tenGodInfo[ganItem.value];
      situationDesc = `时地支透于${ganItem.label}天干`;
      return true;
    } else if (YearZhiHideGan.includes(ganItem.value)) {
      situationState = tenGodInfo[ganItem.value];
      situationDesc = `年地支透于${ganItem.label}天干`;
      return true;
    }
    return false;
  });

  if (appearAtOtherGan) {
    if (!["比肩", "劫财"].includes(situationState)) {
      return `${situationState}格 (${situationDesc})`;
    }
  }

  const virtualAppearAtMonth = monthZhiHideGan.find(
    (gan: string) => gan_elements_dict[gan] === gan_elements_dict[monthGan]
  );
  if (virtualAppearAtMonth) {
    situationState = `虚透${tenGodInfo[virtualAppearAtMonth]}`;
    situationDesc = "月地支虚透于月天干";
    if (!["虚透比肩", "虚透劫财"].includes(situationState)) {
      return `${situationState}格 (${situationDesc})`;
    }
  }

  // 第五步，西山易见规定
  situationState = tenGodInfo[monthZhiHideGan[0]];
  situationDesc = "月地支直接取格局";
  if (!["比肩", "劫财"].includes(situationState)) {
    return `${situationState}格 (${situationDesc})`;
  } else {
    return "无";
  }
}

/**
 * 地支六冲
 */
export function branchesOpposition(zhiList) {
  const zhiSet = new Set(zhiList);
  const conjunctionList: string[] = [];
  if (zhiSet.has("子") && zhiSet.has("午")) {
    conjunctionList.push("子午相冲");
  }
  if (zhiSet.has("丑") && zhiSet.has("未")) {
    conjunctionList.push("丑未相冲");
  }
  if (zhiSet.has("寅") && zhiSet.has("申")) {
    conjunctionList.push("寅申相冲");
  }
  if (zhiSet.has("卯") && zhiSet.has("酉")) {
    conjunctionList.push("卯酉相冲");
  }
  if (zhiSet.has("辰") && zhiSet.has("戌")) {
    conjunctionList.push("辰戌相冲");
  }
  if (zhiSet.has("巳") && zhiSet.has("亥")) {
    conjunctionList.push("巳亥相冲");
  }
  return conjunctionList;
}

/**
 * 地支六合
 */
export function branchesConjunction(ganList, zhiList) {
  const ganElementSet = new Set();
  ganList.forEach((item) => {
    ganElementSet.add(gan_elements_dict[item]);
  });
  const zhiSet = new Set(zhiList);
  const conjunctionList: string[] = [];
  if (zhiSet.has("子") && zhiSet.has("丑")) {
    if (ganElementSet.has("土")) {
      conjunctionList.push("子丑相合化土");
    } else {
      conjunctionList.push("子丑相合");
    }
  }
  if (zhiSet.has("寅") && zhiSet.has("亥")) {
    if (ganElementSet.has("木")) {
      conjunctionList.push("寅亥相合化木");
    } else {
      conjunctionList.push("寅亥相合");
    }
  }
  if (zhiSet.has("卯") && zhiSet.has("戌")) {
    if (ganElementSet.has("火")) {
      conjunctionList.push("卯戌相合化火");
    } else {
      conjunctionList.push("卯戌相合");
    }
  }
  if (zhiSet.has("辰") && zhiSet.has("酉")) {
    if (ganElementSet.has("金")) {
      conjunctionList.push("辰酉相合化金");
    } else {
      conjunctionList.push("辰酉相合");
    }
  }
  if (zhiSet.has("巳") && zhiSet.has("申")) {
    if (ganElementSet.has("水")) {
      conjunctionList.push("巳申相合化水");
    } else {
      conjunctionList.push("巳申相合");
    }
  }
  if (zhiSet.has("午") && zhiSet.has("未")) {
    if (ganElementSet.has("土")) {
      conjunctionList.push("午未相合化土");
    } else {
      conjunctionList.push("午未相合");
    }
  }
  return conjunctionList;
}

/**
 * 返回符合条件的干支
 */
function getMatchingBranches(zhiSet, zhiArray) {
  const matchingBranches: string[] = [];
  for (let i = 0; i < zhiArray.length; i++) {
    const currentZhi = zhiArray[i];
    if (zhiSet.has(currentZhi)) {
      matchingBranches.push(currentZhi);
    }
  }
  return matchingBranches.length >= 2 ? matchingBranches.join("") : "";
}

/**
 * 地支三合会局
 */
export function branchesConjunction2(ganList, zhiList) {
  const ganSet = new Set(ganList);
  const zhiSet = new Set(zhiList);
  const conjunctionList: string[] = [];
  let temp;

  temp = getMatchingBranches(zhiSet, ["申", "子", "辰"]);
  if (temp.length === 3) {
    conjunctionList.push(`${temp}三合水局`);
  } else if (temp.length === 2) {
    if (temp.includes("子")) {
      conjunctionList.push(`${temp}半合水局`);
    } else {
      if (ganSet.has("亥")) {
        conjunctionList.push(`${temp}暗拱亥合水局`);
      } else if (ganSet.has("壬")) {
        conjunctionList.push(`${temp}暗拱壬合水局`);
      }
    }
  }

  temp = getMatchingBranches(zhiSet, ["亥", "卯", "未"]);
  if (temp.length === 3) {
    conjunctionList.push(`${temp}三合木局`);
  } else if (temp.length === 2) {
    if (temp.includes("卯")) {
      conjunctionList.push(`${temp}半合木局`);
    } else {
      if (ganSet.has("乙")) {
        conjunctionList.push(`${temp}暗拱乙合木局`);
      } else if (ganSet.has("甲")) {
        conjunctionList.push(`${temp}暗拱甲合木局`);
      }
    }
  }

  temp = getMatchingBranches(zhiSet, ["寅", "午", "戌"]);
  if (temp.length === 3) {
    conjunctionList.push(`${temp}三合火局`);
  } else if (temp.length === 2) {
    if (temp.includes("午")) {
      conjunctionList.push(`${temp}半合火局`);
    } else {
      if (ganSet.has("丁")) {
        conjunctionList.push(`${temp}暗拱丁合火局`);
      } else if (ganSet.has("丙")) {
        conjunctionList.push(`${temp}暗拱丙合火局`);
      }
    }
  }

  temp = getMatchingBranches(zhiSet, ["巳", "酉", "丑"]);
  if (temp.length === 3) {
    conjunctionList.push(`${temp}三合金局`);
  } else if (temp.length === 2) {
    if (temp.includes("酉")) {
      conjunctionList.push(`${temp}半合金局`);
    } else {
      if (ganSet.has("辛")) {
        conjunctionList.push(`${temp}暗拱辛合金局`);
      } else if (ganSet.has("庚")) {
        conjunctionList.push(`${temp}暗拱庚合金局`);
      }
    }
  }

  return conjunctionList;
}

/**
 * 地支三合会方
 */
export function branchesTriplet(zhiList) {
  const zhiSet = new Set(zhiList);
  let conjunctionList: string = "";
  let temp;

  temp = getMatchingBranches(zhiSet, ["寅", "卯", "辰"]);
  if (temp.length === 3) {
    conjunctionList = `${temp}三会东方木局`;
  }

  temp = getMatchingBranches(zhiSet, ["申", "酉", "戌"]);
  if (temp.length === 3) {
    conjunctionList = `${temp}三会西方金局`;
  }

  temp = getMatchingBranches(zhiSet, ["巳", "午", "未"]);
  if (temp.length === 3) {
    conjunctionList = `${temp}三会南方火局`;
  }

  temp = getMatchingBranches(zhiSet, ["亥", "子", "丑"]);
  if (temp.length === 3) {
    conjunctionList = `${temp}三会北方水局`;
  }

  return conjunctionList;
}

/**
 * 地支三刑
 */
export function branchesPunishment(zhiList) {
  const zhiSet = new Set(zhiList);
  const conjunctionList: string[] = [];
  let temp;

  temp = getMatchingBranches(zhiSet, ["子", "卯"]);
  if (temp.length === 2) {
    conjunctionList.push(`${temp}相刑`);
  }

  temp = getMatchingBranches(zhiSet, ["寅", "巳", "申"]);
  if (temp.length === 3) {
    conjunctionList.push(`${temp}三刑`);
  } else if (temp.length === 2) {
    conjunctionList.push(`${temp}相刑`);
  }

  temp = getMatchingBranches(zhiSet, ["丑", "未", "戌"]);
  if (temp.length === 3) {
    conjunctionList.push(`${temp}三刑`);
  } else if (temp.length >= 2) {
    conjunctionList.push(`${temp}相刑`);
  }

  zhiList.reduce((acc, cur) => {
    const count = acc[cur];
    if (count > 0) {
      if (count === 1 && ["辰", "午", "酉", "亥"].includes(cur)) {
        conjunctionList.push(`${cur}${cur}自刑`);
      }
      return {
        ...acc,
        [cur]: acc[cur] + 1,
      };
    } else {
      return {
        ...acc,
        [cur]: 1,
      };
    }
  }, {});
  return conjunctionList;
}

/**
 * 地支六破
 */
export function branchesDestruction(zhiList) {
  const zhiSet = new Set(zhiList);
  const conjunctionList: string[] = [];
  if (zhiSet.has("子") && zhiSet.has("酉")) {
    conjunctionList.push("子酉相破");
  }
  if (zhiSet.has("卯") && zhiSet.has("午")) {
    conjunctionList.push("卯午相破");
  }
  if (zhiSet.has("辰") && zhiSet.has("丑")) {
    conjunctionList.push("辰丑相破");
  }
  if (zhiSet.has("未") && zhiSet.has("戌")) {
    conjunctionList.push("未戌相破");
  }
  if (zhiSet.has("寅") && zhiSet.has("亥")) {
    conjunctionList.push("寅亥相破");
  }
  if (zhiSet.has("巳") && zhiSet.has("申")) {
    conjunctionList.push("巳申相破");
  }
  return conjunctionList;
}

/**
 * 地支六穿
 */
export function branchesHarm(zhiList) {
  const zhiSet = new Set(zhiList);
  const conjunctionList: string[] = [];
  if (zhiSet.has("子") && zhiSet.has("未")) {
    conjunctionList.push("子未相害");
  }
  if (zhiSet.has("丑") && zhiSet.has("午")) {
    conjunctionList.push("丑午相害");
  }
  if (zhiSet.has("寅") && zhiSet.has("巳")) {
    conjunctionList.push("寅巳相害");
  }
  if (zhiSet.has("卯") && zhiSet.has("辰")) {
    conjunctionList.push("卯辰相害");
  }
  if (zhiSet.has("申") && zhiSet.has("亥")) {
    conjunctionList.push("申亥相害");
  }
  if (zhiSet.has("酉") && zhiSet.has("戌")) {
    conjunctionList.push("酉戌相害");
  }
  return conjunctionList;
}

/**
 * 获取同方和异方
 */
export const getTokenImpactList = (
  horoscopeInfo,
  tenGodInfo,
  seasonFeature
) => {
  // 木火土金水的旺相休囚状态
  let seasonFeatureMap = {};
  seasonFeature.split(" ").forEach((item) => {
    seasonFeatureMap[item[0]] = item[1];
  });

  const sameKeys: string[] = ["比肩", "劫财"];
  const sealKeys: string[] = ["正印", "偏印"];
  const restraintKeys: string[] = ["正官", "七杀"];
  const wealthKeys: string[] = ["正财", "偏财"];
  const abilityKeys: string[] = ["食神", "伤官"];

  const sameList: string[] = [];
  const sealList: string[] = [];
  const restraintList: string[] = [];
  const wealthList: string[] = [];
  const abilityList: string[] = [];

  const supportAndInhibitionMap: Object = {};
  let samePower = 0;
  let sealPower = 0;
  let restraintPower = 0;
  let wealthPower = 0;
  let abilityPower = 0;

  for (let i in horoscopeInfo) {
    if (i.includes("Gan")) {
      const item = horoscopeInfo[i];
      const itemElement = gan_elements_dict[item];
      const itemSeasonFeature = seasonFeatureMap[itemElement];
      const itemStatePower = state_power_dict[itemSeasonFeature];
      if (sameKeys.includes(tenGodInfo[item])) {
        sameList.push(
          `${item}${itemElement}(${itemSeasonFeature}+${itemStatePower})`
        );
        samePower += itemStatePower;
      } else if (sealKeys.includes(tenGodInfo[item])) {
        sealList.push(
          `${item}${itemElement}(${itemSeasonFeature}+${itemStatePower})`
        );
        sealPower += itemStatePower;
      } else if (restraintKeys.includes(tenGodInfo[item])) {
        restraintList.push(
          `${item}${itemElement}(${itemSeasonFeature}+${itemStatePower})`
        );
        restraintPower += itemStatePower;
      } else if (wealthKeys.includes(tenGodInfo[item])) {
        wealthList.push(
          `${item}${itemElement}(${itemSeasonFeature}+${itemStatePower})`
        );
        wealthPower += itemStatePower;
      } else if (abilityKeys.includes(tenGodInfo[item])) {
        abilityList.push(
          `${item}${itemElement}(${itemSeasonFeature}+${itemStatePower})`
        );
        abilityPower += itemStatePower;
      }
      if (i !== "dayGan") {
        supportAndInhibitionMap[tenGodInfo[item]] = item;
      }
    } else if (i.includes("Zhi")) {
      const zhiItem = horoscopeInfo[i];
      const items = zhi_hide_gan_dict[zhiItem];
      items?.forEach((item: string, index: number) => {
        const itemElement = gan_elements_dict[item];
        const itemSeasonFeature = seasonFeatureMap[itemElement];
        const itemStatePower = toRounding(
          state_power_dict[itemSeasonFeature] *
            zhi_hide_gan_quantization_dict[zhiItem][index]
        );
        if (sameKeys.includes(tenGodInfo[item])) {
          sameList.push(
            `${item}${itemElement}(${itemSeasonFeature}+${itemStatePower})`
          );
          samePower += itemStatePower;
        } else if (sealKeys.includes(tenGodInfo[item])) {
          sealList.push(
            `${item}${itemElement}(${itemSeasonFeature}+${itemStatePower})`
          );
          sealPower += itemStatePower;
        } else if (restraintKeys.includes(tenGodInfo[item])) {
          restraintList.push(
            `${item}${itemElement}(${itemSeasonFeature}+${itemStatePower})`
          );
          restraintPower += itemStatePower;
        } else if (wealthKeys.includes(tenGodInfo[item])) {
          wealthList.push(
            `${item}${itemElement}(${itemSeasonFeature}+${itemStatePower})`
          );
          wealthPower += itemStatePower;
        } else if (abilityKeys.includes(tenGodInfo[item])) {
          abilityList.push(
            `${item}${itemElement}(${itemSeasonFeature}+${itemStatePower})`
          );
          abilityPower += itemStatePower;
        }
        if (index === 0) {
          supportAndInhibitionMap[tenGodInfo[item]] = zhiItem;
        }
      });
    }
  }
  samePower = toRounding(samePower);
  sealPower = toRounding(sealPower);
  restraintPower = toRounding(restraintPower);
  wealthPower = toRounding(wealthPower);
  abilityPower = toRounding(abilityPower);
  const totalPower =
    samePower + sealPower + restraintPower + wealthPower + abilityPower;

  const newRes = [
    {
      name: "比劫",
      list: sameList,
      power: samePower,
      percent: toRounding((samePower / totalPower) * 100),
    },
    {
      name: "印绶",
      list: sealList,
      power: sealPower,
      percent: toRounding((sealPower / totalPower) * 100),
    },
    {
      name: "官杀",
      list: restraintList,
      power: restraintPower,
      percent: toRounding((restraintPower / totalPower) * 100),
    },
    {
      name: "财星",
      list: wealthList,
      power: wealthPower,
      percent: toRounding((wealthPower / totalPower) * 100),
    },
    {
      name: "食伤",
      list: abilityList,
      power: abilityPower,
      percent: toRounding((abilityPower / totalPower) * 100),
    },
  ].sort((a, b) => b.power - a.power);
  // console.log("newRes", newRes);
  return newRes;
};

/**
 * 获取温度湿度
 */
export const getTemperatureAndHumidity = (horoscopeInfo) => {
  let scoring: number = 0;
  const ganTHList: string[] = [];
  const zhiTHList: string[] = [];
  const monthTHList: string[] = [];
  let climate: string = "";
  // 是否调候为先
  let isUrgent: boolean = false;
  for (let i in horoscopeInfo) {
    const item = horoscopeInfo[i];
    if (!item) continue;
    if (i.includes("Gan")) {
      const climateItem = climate_gan_dict[item];
      ganTHList.push(`${item}(${climateItem})`);
      scoring += climateItem;
    } else if (i.includes("Zhi")) {
      const climateItem = climate_zhi_dict[item];
      zhiTHList.push(`${item}(${climateItem})`);
      scoring += climateItem;
      if (i === "monthZhi") {
        const climateMonthItem = climate_month_dict[item];
        monthTHList.push(`${item}(${climateMonthItem})`);
        scoring += climateMonthItem;
      }
    }
  }
  if (scoring > 6) {
    climate = "暖燥";
    if (zhi_season_dict[horoscopeInfo.monthZhi][0] === "夏") {
      isUrgent = true;
    }
  } else if (scoring > 1) {
    climate = "略偏暖燥";
  } else if (scoring < -6) {
    climate = "寒湿";
    if (zhi_season_dict[horoscopeInfo.monthZhi][0] === "冬") {
      isUrgent = true;
    }
  } else if (scoring < -1) {
    climate = "略偏寒湿";
  } else {
    climate = "中和";
  }

  return {
    ganTHList,
    zhiTHList,
    monthTHList,
    scoring,
    climate,
    isUrgent,
  };
};
