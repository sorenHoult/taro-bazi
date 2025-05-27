import {
  gan_adapt_dict,
  gan_conflict_dict,
  gan_index_dict,
  zhi_index_dict,
  zhi_adapt_dict,
  zhi_conflict_dict,
  zhi_adapt_half_dict,
  zhi_harm_dict,
  zhi_punishment_dict,
  zhi_hide_gan_dict,
  gan_elements_dict,
  zhi_elements_dict,
  generating_relations_dict,
  column_mark_dict,
} from "@/assets/dict/zodiacData";

/**
 * 流年引动大运
 */
export function getFleetingYearAffectLucky(luckyActive, fleetingYearActive) {
  if (luckyActive.gan === gan_adapt_dict[fleetingYearActive.gan]) {
    return true;
  } else if (luckyActive.gan === gan_conflict_dict[fleetingYearActive.gan]) {
    return true;
  } else if (luckyActive.gan === fleetingYearActive.gan) {
    return true;
  } else if (luckyActive.zhi === zhi_adapt_dict[fleetingYearActive.zhi]) {
    return true;
  } else if (luckyActive.zhi === zhi_conflict_dict[fleetingYearActive.zhi]) {
    return true;
  } else if (luckyActive.zhi === zhi_adapt_half_dict[fleetingYearActive.zhi]) {
    return true;
  } else if (luckyActive.zhi === zhi_harm_dict[fleetingYearActive.zhi]) {
    return true;
  } else if (luckyActive.zhi === zhi_punishment_dict[fleetingYearActive.zhi]) {
    return true;
  } else if (luckyActive.zhi === fleetingYearActive.zhi) {
    return true;
  } else {
    return false;
  }
}

/**
 * 合并多个对象，取并集
 */
export function mergeAndUnion(mainObj, list) {
  list.forEach((item) => {
    for (let i in item) {
      if (mainObj[i]) {
        mainObj[i] = [...mainObj[i], ...item[i]];
      } else {
        mainObj[i] = item[i];
      }
    }
  });
  return mainObj;
}

/**
 * 天干作用方式
 * 天干相合 天干相冲 天干到位
 */
export function getHeavenlyStemEffect(
  passiveGanList,
  initiativeGan,
  tenGodInfo
) {
  const adaptList: any[] = [];
  const conflictList: any[] = [];
  const coincideList: any[] = [];
  const energyMap = { 日干: 3 };

  const initiativeGanIndex = passiveGanList.length;
  passiveGanList.forEach((item, index) => {
    if (item === gan_adapt_dict[initiativeGan]) {
      adaptList.push({
        from: {
          name: gan_index_dict[initiativeGanIndex],
          ganZhi: initiativeGan,
          tenGod: tenGodInfo[initiativeGan],
        },
        to: {
          name: gan_index_dict[index],
          ganZhi: item,
          tenGod:
            gan_index_dict[index] === "日干"
              ? gan_index_dict[index]
              : tenGodInfo[item],
        },
        relation: "合",
        convertTenGod: "",
        energy: energyMap[gan_index_dict[index]] || 1,
      });
    } else if (item === gan_conflict_dict[initiativeGan]) {
      conflictList.push({
        from: {
          name: gan_index_dict[initiativeGanIndex],
          ganZhi: initiativeGan,
          tenGod: tenGodInfo[initiativeGan],
        },
        to: {
          name: gan_index_dict[index],
          ganZhi: item,
          tenGod:
            gan_index_dict[index] === "日干"
              ? gan_index_dict[index]
              : tenGodInfo[item],
        },
        relation: "冲",
        convertTenGod: tenGodInfo[initiativeGan],
        energy: energyMap[gan_index_dict[index]] || 1,
      });
    } else if (item === initiativeGan) {
      coincideList.push({
        from: {
          name: gan_index_dict[initiativeGanIndex],
          ganZhi: initiativeGan,
          tenGod: tenGodInfo[initiativeGan],
        },
        to: {
          name: gan_index_dict[index],
          ganZhi: item,
          tenGod:
            gan_index_dict[index] === "日干"
              ? gan_index_dict[index]
              : tenGodInfo[item],
          hide: true,
        },
        relation: "到位",
        convertTenGod: tenGodInfo[item],
        energy: 3,
      });
    }
  });

  return {
    adaptList,
    conflictList,
    coincideList,
  };
}

/**
 * 地支作用方式
 * 地支相合 地支相冲 地支半合 地支相害 地支相刑 地支到位
 */
export function getEarthlyBranchesEffect(
  passiveZhiList,
  initiativeZhi,
  tenGodInfo
) {
  const adaptList: any[] = [];
  const conflictList: any[] = [];
  const adaptHalfList: any[] = [];
  const harmList: any[] = [];
  const punishmentList: any[] = [];
  const coincideList: any[] = [];
  const energyMap = { 日支: 3 };

  const initiativeZhiIndex = passiveZhiList.length;
  const zhiHideGan = zhi_hide_gan_dict[initiativeZhi][0];
  passiveZhiList.forEach((item, index) => {
    if (item === zhi_adapt_dict[initiativeZhi]) {
      adaptList.push({
        from: {
          name: zhi_index_dict[initiativeZhiIndex],
          ganZhi: initiativeZhi,
          tenGod: tenGodInfo[zhiHideGan],
        },
        to: {
          name: zhi_index_dict[index],
          ganZhi: item,
          tenGod: tenGodInfo[zhi_hide_gan_dict[item][0]],
        },
        relation: "合",
        convertTenGod: "",
        energy: energyMap[zhi_index_dict[index]] || 1,
      });
    } else if (item === zhi_conflict_dict[initiativeZhi]) {
      conflictList.push({
        from: {
          name: zhi_index_dict[initiativeZhiIndex],
          ganZhi: initiativeZhi,
          tenGod: tenGodInfo[zhiHideGan],
        },
        to: {
          name: zhi_index_dict[index],
          ganZhi: item,
          tenGod: tenGodInfo[zhi_hide_gan_dict[item][0]],
        },
        relation: "冲",
        convertTenGod: tenGodInfo[zhiHideGan],
        energy: energyMap[zhi_index_dict[index]] || 1,
      });
    } else if (zhi_adapt_half_dict[initiativeZhi]?.includes(item)) {
      adaptHalfList.push({
        from: {
          name: zhi_index_dict[initiativeZhiIndex],
          ganZhi: initiativeZhi,
          tenGod: tenGodInfo[zhiHideGan],
        },
        to: {
          name: zhi_index_dict[index],
          ganZhi: item,
          tenGod: tenGodInfo[zhi_hide_gan_dict[item][0]],
        },
        relation: "半合",
        convertTenGod: "",
        energy: energyMap[zhi_index_dict[index]] || 1,
      });
    } else if (item === initiativeZhi) {
      coincideList.push({
        from: {
          name: zhi_index_dict[initiativeZhiIndex],
          ganZhi: initiativeZhi,
          tenGod: tenGodInfo[zhiHideGan],
        },
        to: {
          name: zhi_index_dict[index],
          ganZhi: item,
          tenGod: tenGodInfo[zhi_hide_gan_dict[item][0]],
          hide: true,
        },
        relation: "到位",
        convertTenGod: tenGodInfo[item],
        energy: 3,
      });
    } else if (item === zhi_harm_dict[initiativeZhi]) {
      harmList.push({
        from: {
          name: zhi_index_dict[initiativeZhiIndex],
          ganZhi: initiativeZhi,
          tenGod: tenGodInfo[zhiHideGan],
        },
        to: {
          name: zhi_index_dict[index],
          ganZhi: item,
          tenGod: tenGodInfo[zhi_hide_gan_dict[item][0]],
        },
        relation: "害",
        convertTenGod: "",
        energy: energyMap[zhi_index_dict[index]] || 1,
      });
    } else if (zhi_punishment_dict[initiativeZhi]?.includes(item)) {
      punishmentList.push({
        from: {
          name: zhi_index_dict[initiativeZhiIndex],
          ganZhi: initiativeZhi,
          tenGod: tenGodInfo[zhiHideGan],
        },
        to: {
          name: zhi_index_dict[index],
          ganZhi: item,
          tenGod: tenGodInfo[zhi_hide_gan_dict[item][0]],
        },
        relation: "刑",
        convertTenGod: "",
        energy: energyMap[zhi_index_dict[index]] || 1,
      });
    }
  });

  return {
    adaptList,
    conflictList,
    adaptHalfList,
    harmList,
    punishmentList,
    coincideList,
  };
}

/**
 * 全局作用方式
 * 乱动
 */
export function getOverallSituationEffect(
  passiveGanList,
  passiveZhiList,
  tenGodInfo
) {
  const countMap: Object = {};
  const moveAroundList: any[] = [];
  passiveGanList.forEach((item) => {
    if (item) {
      const tenGod = tenGodInfo[item];
      if (countMap[tenGod]) {
        countMap[tenGod] = countMap[tenGod] + 1;
      } else {
        countMap[tenGod] = 1;
      }
    }
  });
  passiveZhiList.forEach((item) => {
    if (item) {
      const zhiHideGan = zhi_hide_gan_dict[item][0];
      const tenGod = tenGodInfo[zhiHideGan];
      if (countMap[tenGod]) {
        countMap[tenGod] = countMap[tenGod] + 1;
      } else {
        countMap[tenGod] = 1;
      }
    }
  });
  for (let countName in countMap) {
    if (countMap[countName] >= 4) {
      moveAroundList.push({
        from: {
          name: "",
          ganZhi: "",
          tenGod: countName,
        },
        to: {
          name: "全局",
          ganZhi: "",
          tenGod: "",
        },
        relation: "乱动",
        energy: 2,
      });
    }
  }
  return {
    moveAroundList,
  };
}

/**
 * 进退气
 */
export function getAdvanceAndRetreat(
  passiveGanList,
  passiveZhiList,
  initiativeGan,
  initiativeZhi,
  heavenlyStemEffect,
  earthlyBranchesEffect
) {
  const gasObj: Object = {};
  const inGanElement = gan_elements_dict[initiativeGan];
  const inGanBornElement = generating_relations_dict[inGanElement];

  const inZhiElement = zhi_elements_dict[initiativeZhi];
  const inZhiBornElement = generating_relations_dict[inZhiElement];

  const length = passiveGanList.length;
  for (let i = 0; i < length; i++) {
    const gan = passiveGanList[i];
    const ganElement = gan_elements_dict[passiveGanList[i]];
    const zhi = passiveZhiList[i];
    const zhiElement = zhi_elements_dict[zhi];
    // 同是地支直接生扶
    if (zhiElement === inZhiElement || zhiElement === inZhiBornElement) {
      gasObj[zhi] = "真进气";
    }
    // 流年干或运干生扶地支，要判断是否有刑冲合害到位
    else if (zhiElement === inGanElement || zhiElement === inGanBornElement) {
      let isExist = false;
      for (let j in heavenlyStemEffect) {
        isExist = heavenlyStemEffect[j].find((item) => gan === item.to.ganZhi);
        if (isExist) {
          break;
        }
      }
      if (isExist) {
        gasObj[zhi] = "真进气";
      } else {
        gasObj[zhi] = "假进气";
      }
    } else {
      // 时干可能为空
      if (zhi) {
        gasObj[zhi] = "退气";
      }
    }

    // 同是天干直接生扶
    if (ganElement === inGanElement || ganElement === inGanBornElement) {
      gasObj[gan] = "真进气";
    }
    // 流年支或运支生扶天干，要判断是否有刑冲合害到位
    else if (ganElement === inZhiElement || ganElement === inZhiBornElement) {
      let isExist = false;
      for (let j in earthlyBranchesEffect) {
        isExist = earthlyBranchesEffect[j].find(
          (item) => zhi === item.to.ganZhi
        );
        if (isExist) {
          break;
        }
      }
      if (isExist) {
        gasObj[gan] = "真进气";
      } else {
        gasObj[gan] = "假进气";
      }
    } else {
      // 时支可能为空
      if (gan) {
        gasObj[gan] = "退气";
      }
    }
  }
  return gasObj;
}

/**
 * 按能量排序
 * 天干作用 地支作用 全局作用
 */
export function getEffectSortedByEnergy(
  heavenlyStemEffect,
  earthlyBranchesEffect,
  overallSituationEffect
) {
  const effectList: any[] = [];
  for (let i in heavenlyStemEffect) {
    heavenlyStemEffect[i].forEach((item) => {
      effectList.push(item);
    });
  }
  for (let j in earthlyBranchesEffect) {
    earthlyBranchesEffect[j].forEach((item) => {
      effectList.push(item);
    });
  }
  for (let o in overallSituationEffect) {
    overallSituationEffect[o].forEach((item) => {
      effectList.push(item);
    });
  }
  return effectList.sort((a, b) => b.energy - a.energy);
}

/**
 * 动静
 */
export function getMovementAndStillness(
  heavenlyStemEffect,
  earthlyBranchesEffect,
  ganZhiLocationMap,
  tenGodInfo
) {
  const movementObj: Object = {
    fleetingDay: {
      movement: false,
    },
    fleetingMonth: {
      movement: false,
    },
    fleetingYear: {
      movement: false,
    },
    lucky: {
      movement: false,
    },
    year: {
      movement: false,
    },
    month: {
      movement: false,
    },
    day: {
      movement: false,
    },
    hour: {
      movement: false,
    },
  };
  for (let i in heavenlyStemEffect) {
    heavenlyStemEffect[i].forEach((item) => {
      // 截掉最后一个字符
      const label = item.to.name.slice(0, -1);
      const mark = column_mark_dict[label];
      movementObj[mark]["movement"] = true;
      movementObj[mark]["gan"] = item;
      // 引动的十神
      const zhiItem = ganZhiLocationMap[mark]["zhi"];
      const zhiHideGan = zhi_hide_gan_dict[zhiItem][0];
      movementObj[mark]["zhi"] = {
        convertTenGod: tenGodInfo[zhiHideGan],
        relation: "引动",
      };
    });
  }
  for (let j in earthlyBranchesEffect) {
    earthlyBranchesEffect[j].forEach((item) => {
      const label = item.to.name.slice(0, -1);
      const mark = column_mark_dict[label];
      movementObj[mark]["movement"] = true;
      movementObj[mark]["zhi"] = item;
      // 引动的十神
      if (!movementObj[mark]["gan"]) {
        const ganItem = ganZhiLocationMap[mark]["gan"];
        movementObj[mark]["gan"] = {
          convertTenGod: mark === "day" ? "" : tenGodInfo[ganItem],
          relation: "引动",
        };
      }
    });
  }
  return movementObj;
}

/**
 * 是否流通
 * 作用结果convertTenGod
 * 缺少多个合一个的判断
 */
export function getIsCirculation(movementObj) {
  // 日主是否发动，不发动影响很小
  const isDayGanActivated = movementObj.day?.movement;
  let isCirculation = true;
  let disaster = "";
  const activatedTenGodObj = {
    正官: 0,
    七杀: 0,
    食神: 0,
    伤官: 0,
    正印: 0,
    偏印: 0,
    比肩: 0,
    劫财: 0,
    正财: 0,
    偏财: 0,
    日干: 0,
  };
  for (let i in movementObj) {
    const movementItem = movementObj[i];
    const movementGanItemTenGod = movementItem?.gan?.convertTenGod;
    if (movementGanItemTenGod) {
      activatedTenGodObj[movementGanItemTenGod] =
        activatedTenGodObj[movementGanItemTenGod] + 1;
    }
    const movementZhiItemTenGod = movementItem?.zhi?.convertTenGod;
    if (movementZhiItemTenGod) {
      activatedTenGodObj[movementZhiItemTenGod] =
        activatedTenGodObj[movementZhiItemTenGod] + 1;
    }
  }
  // console.log("流通十神统计：", activatedTenGodObj);
  if (movementObj.day?.zhi?.convertTenGod === "七杀") {
    // console.log("流通：七杀在日支");
    isCirculation = false;
  } else if (activatedTenGodObj["正官"] + activatedTenGodObj["七杀"] > 0) {
    if (activatedTenGodObj["正印"] + activatedTenGodObj["偏印"] === 0) {
      // console.log("不流通：有官杀，无印");
      isCirculation = false;
    }
  } else if (
    activatedTenGodObj["正财"] +
      activatedTenGodObj["偏财"] +
      activatedTenGodObj["食神"] +
      activatedTenGodObj["伤官"] >
    0
  ) {
    if (activatedTenGodObj["比肩"] + activatedTenGodObj["劫财"] === 0) {
      // 肾病死亡
      // console.log("不流通：有财食伤，无比劫");
      isCirculation = false;
    }
  } else if (
    activatedTenGodObj["正财"] +
      activatedTenGodObj["偏财"] +
      activatedTenGodObj["食神"] +
      activatedTenGodObj["伤官"] ===
    0
  ) {
    if (activatedTenGodObj["比肩"] + activatedTenGodObj["劫财"] > 0) {
      // 被拘留10天
      // 车撞人破财
      // console.log("不流通：有比劫，无财食伤");
      isCirculation = false;
    }
  }

  return {
    isDayGanActivated,
    isCirculation,
    disaster,
  };
}
