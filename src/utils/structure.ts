import { gan_elements_dict, zhu_index } from "@/assets/dict/zodiacData";

/**
 * 某天干是否有根
 * 强根
 * 杂气根
 */
export function getGanIsRooted(element: string, zhiMap: any) {
  const resultMap = {};
  for (let i in zhiMap) {
    const zhi: string = zhiMap[i];
    if (element === "木") {
      if (["寅", "卯", "亥", "未", "辰"].includes(zhi)) {
        resultMap[i] = zhi;
      }
    } else if (element === "火") {
      if (["巳", "午", "寅", "未", "戌"].includes(zhi)) {
        resultMap[i] = zhi;
      }
    } else if (element === "土") {
      if (["丑", "辰", "未", "戌", "午", "寅", "巳", "申"].includes(zhi)) {
        resultMap[i] = zhi;
      }
    } else if (element === "金") {
      if (["申", "酉", "巳", "戌", "辛"].includes(zhi)) {
        resultMap[i] = zhi;
      }
    } else if (element === "水") {
      if (["亥", "子", "丑", "申", "辰"].includes(zhi)) {
        resultMap[i] = zhi;
      }
    }
  }
  const isRooted = Object.keys(resultMap).length !== 0;
  return {
    isRooted,
    resultMap,
  };
}

/**
 * 对象反序列化
 */
function getReverseMap(originalMap: any) {
  const reverseMap = {};
  for (let i in originalMap) {
    const item = originalMap[i];
    if (reverseMap[item]) {
      reverseMap[item] = [...reverseMap[item], i];
    } else {
      reverseMap[item] = [i];
    }
  }
  return reverseMap;
}

/**
 * 通过年月日时的位置判断最终关系
 */
function getRelationByPosition(maxItem: any, minItem: any) {
  const totalNum = maxItem.num + minItem.num;
  let relation;
  if (totalNum === 2) {
    const zhuIndex1 = zhu_index[maxItem.position[0]];
    const zhuIndex2 = zhu_index[minItem.position[0]];
    const spacing = Math.abs(zhuIndex1 - zhuIndex2);
    if (spacing === 1) {
      relation = "相";
    } else if (spacing === 2) {
      relation = "隔";
    } else if (spacing === 3) {
      relation = "遥";
    }
  } else if (totalNum === 3) {
    const zhuIndex1 = zhu_index[maxItem.position[0]];
    const zhuIndex2 = zhu_index[maxItem.position[1]];
    const zhuIndex3 = zhu_index[minItem.position[0]];
    const spacing1 = Math.abs(zhuIndex1 - zhuIndex3);
    const spacing2 = Math.abs(zhuIndex2 - zhuIndex3);
    if (spacing1 === 1 && spacing2 === 1) {
      relation = "争";
    } else if (spacing1 === 1 || spacing2 === 1) {
      relation = "相";
    } else {
      relation = "遥";
    }
  } else if (totalNum === 4) {
    if (maxItem.num === minItem.num) {
      const zhuIndex1 = zhu_index[maxItem.position[0]];
      const zhuIndex2 = zhu_index[maxItem.position[1]];
      const spacing = Math.abs(zhuIndex1 - zhuIndex2);
      if (spacing === 1) {
        relation = "相";
      } else {
        relation = "双";
      }
    } else {
      const zhuIndex1 = zhu_index[minItem.position[0]];
      if (zhuIndex1 === 1 || zhuIndex1 === 4) {
        relation = "相";
      } else {
        relation = "争";
      }
    }
  }
  return {
    totalNum,
    relation,
  };
}

/**
 * 天干是否有合化
 * 天干五合，须得地支之助，方能化气
 */
export function getGanCombination(ganMap: any, zhiMap: any) {
  const ganMapReverse = getReverseMap(ganMap);
  const result: any[] = [];
  const pairs: any[] = [
    ["甲", "己", ["辰", "戌", "丑", "未"], "土"],
    ["乙", "庚", ["申", "酉", "戌"], "金"],
    ["丙", "辛", ["亥", "子", "丑"], "水"],
    ["丁", "壬", ["寅", "卯", "辰"], "木"],
    ["戊", "癸", ["巳", "午", "未"], "火"],
  ];

  pairs.forEach((pair) => {
    const [first, second, third, fourth] = pair;
    if (ganMapReverse[first] && ganMapReverse[second]) {
      let transformation = "";
      if (third?.includes(zhiMap.month)) {
        transformation = fourth;
      }
      const firstItem = {
        zhi: first,
        num: ganMapReverse[first].length,
        position: ganMapReverse[first],
      };
      const secondItem = {
        zhi: second,
        num: ganMapReverse[second].length,
        position: ganMapReverse[second],
      };
      const maxItem = firstItem.num >= secondItem.num ? firstItem : secondItem;
      const minItem = firstItem.num < secondItem.num ? firstItem : secondItem;
      result.push({
        maxItem,
        minItem,
        transformation,
      });
    }
  });
  const newResult = result.map(({ maxItem, minItem, transformation }) => {
    const { totalNum, relation } = getRelationByPosition(maxItem, minItem);
    let conclusion, grey, transformSuccess;
    const transformationText = transformation ? "化" + transformation : "";
    if (relation === "相") {
      transformSuccess = true;
      conclusion = `${maxItem.zhi}${minItem.zhi}${relation}合${transformationText}`;
    } else if (relation === "争") {
      conclusion = `二${maxItem.zhi}${relation}合一${minItem.zhi}`;
    } else if (relation === "双") {
      transformSuccess = true;
      conclusion = `二${maxItem.zhi}二${minItem.zhi}相合${transformationText}`;
    } else if (relation === "隔") {
      conclusion = `${maxItem.zhi}${minItem.zhi}${relation}合`;
      grey = true;
    } else if (relation === "遥") {
      conclusion = `${maxItem.zhi}${minItem.zhi}${relation}合`;
      grey = true;
    }
    return {
      maxItem,
      minItem,
      conclusion,
      grey,
      transformSuccess,
      transformation,
    };
  });

  return newResult;
}

/**
 * 地支六冲
 * 一对一则相冲
 * 二对一，则二冲一，一不冲二
 * 三对一，则三冲一
 */
export function getZhiOpposition(zhiMap: any) {
  const zhiMapReverse = getReverseMap(zhiMap);
  const result: any[] = [];
  const pairs = [
    ["子", "午"],
    ["丑", "未"],
    ["寅", "申"],
    ["卯", "酉"],
    ["辰", "戌"],
    ["巳", "亥"],
  ];
  pairs.forEach((pair) => {
    const [first, second] = pair;
    if (zhiMapReverse[first] && zhiMapReverse[second]) {
      const firstItem = {
        zhi: first,
        num: zhiMapReverse[first].length,
        position: zhiMapReverse[first],
      };
      const secondItem = {
        zhi: second,
        num: zhiMapReverse[second].length,
        position: zhiMapReverse[second],
      };
      const maxItem = firstItem.num >= secondItem.num ? firstItem : secondItem;
      const minItem = firstItem.num < secondItem.num ? firstItem : secondItem;
      result.push({
        maxItem,
        minItem,
      });
    }
  });

  const newResult = result.map(({ maxItem, minItem }) => {
    const { totalNum, relation } = getRelationByPosition(maxItem, minItem);
    let conclusion, grey;
    if (relation === "相") {
      conclusion = `${maxItem.zhi}${minItem.zhi}${relation}冲`;
    } else if (relation === "争") {
      conclusion = `二${maxItem.zhi}冲一${minItem.zhi}`;
    } else if (relation === "双") {
      conclusion = `二${maxItem.zhi}二${minItem.zhi}相冲`;
    } else if (relation === "隔") {
      conclusion = `${maxItem.zhi}${minItem.zhi}${relation}冲`;
      grey = true;
    } else if (relation === "遥") {
      conclusion = `${maxItem.zhi}${minItem.zhi}${relation}冲`;
      grey = true;
    }
    return { maxItem, minItem, conclusion, grey };
  });

  return newResult;
}

/**
 * 地支六合
 */
export function getZhiCompound(ganMap: any, zhiMap: any) {
  const ganElementSet = new Set();
  for (let i in ganMap) {
    ganElementSet.add(gan_elements_dict[ganMap[i]]);
  }
  const zhiMapReverse = getReverseMap(zhiMap);
  const result: any[] = [];
  const pairs = [
    ["子", "丑", "土"],
    ["寅", "亥", "木"],
    ["卯", "戌", "火"],
    ["辰", "酉", "金"],
    ["巳", "申", "水"],
    ["午", "未", "土"],
  ];
  pairs.forEach((pair) => {
    const [first, second, third] = pair;
    if (zhiMapReverse[first] && zhiMapReverse[second]) {
      let transformation = "";
      if (ganElementSet.has(third)) {
        transformation = third;
      }
      const firstItem = {
        zhi: first,
        num: zhiMapReverse[first].length,
        position: zhiMapReverse[first],
      };
      const secondItem = {
        zhi: second,
        num: zhiMapReverse[second].length,
        position: zhiMapReverse[second],
      };
      const maxItem = firstItem.num >= secondItem.num ? firstItem : secondItem;
      const minItem = firstItem.num < secondItem.num ? firstItem : secondItem;
      result.push({
        maxItem,
        minItem,
        transformation,
      });
    }
  });
  const newResult = result.map(({ maxItem, minItem, transformation }) => {
    const { totalNum, relation } = getRelationByPosition(maxItem, minItem);
    let conclusion, grey, transformSuccess;
    const transformationText = transformation ? "化" + transformation : "";
    if (relation === "相") {
      transformSuccess = true;
      conclusion = `${maxItem.zhi}${minItem.zhi}${relation}合${transformationText}`;
    } else if (relation === "争") {
      conclusion = `二${maxItem.zhi}${relation}合一${minItem.zhi}`;
    } else if (relation === "双") {
      transformSuccess = true;
      conclusion = `二${maxItem.zhi}二${minItem.zhi}相合${transformationText}`;
    } else if (relation === "隔") {
      conclusion = `${maxItem.zhi}${minItem.zhi}${relation}合`;
      grey = true;
    } else if (relation === "遥") {
      conclusion = `${maxItem.zhi}${minItem.zhi}${relation}合`;
      grey = true;
    }
    return {
      maxItem,
      minItem,
      conclusion,
      grey,
      transformSuccess,
      transformation,
    };
  });

  return newResult;
}

/**
 * 地支三刑
 */
export function getZhiPunishment(zhiMap: any) {
  const zhiMapReverse = getReverseMap(zhiMap);
  const result: any[] = [];
  const pairs = [
    ["寅", "申"],
    ["子", "卯"],
    ["辰"],
    ["巳", "寅"],
    ["午"],
    ["戌", "未"],
    ["巳", "申"],
    ["酉"],
    ["丑", "戌"],
    ["亥"],
    ["未", "丑"],
  ];
  pairs.forEach((pair) => {
    const [first, second] = pair;
    if (pair.length === 2) {
      if (zhiMapReverse[first] && zhiMapReverse[second]) {
        const firstItem = {
          zhi: first,
          num: zhiMapReverse[first].length,
          position: zhiMapReverse[first],
        };
        const secondItem = {
          zhi: second,
          num: zhiMapReverse[second].length,
          position: zhiMapReverse[second],
        };
        const maxItem =
          firstItem.num >= secondItem.num ? firstItem : secondItem;
        const minItem = firstItem.num < secondItem.num ? firstItem : secondItem;
        result.push({
          maxItem,
          minItem,
        });
      }
    } else if (pair.length === 1) {
      if (zhiMapReverse[first]?.length >= 2) {
        const positionArr = zhiMapReverse[first];
        const lastPosition = positionArr.pop();
        const firstItem = {
          zhi: first,
          num: positionArr.length,
          position: positionArr,
        };
        const secondItem = {
          zhi: first,
          num: 1,
          position: [lastPosition],
        };
        result.push({
          maxItem: firstItem,
          minItem: secondItem,
          self: true,
        });
      }
    }
  });
  const newResult = result.map(({ maxItem, minItem, self }) => {
    const { totalNum, relation } = getRelationByPosition(maxItem, minItem);
    let conclusion, grey;
    if (relation === "相") {
      conclusion = `${maxItem.zhi}${minItem.zhi}${relation}刑`;
    } else if (relation === "争") {
      conclusion = `二${maxItem.zhi}刑一${minItem.zhi}`;
    } else if (relation === "双") {
      conclusion = `二${maxItem.zhi}二${minItem.zhi}相刑`;
    } else if (relation === "隔") {
      conclusion = `${maxItem.zhi}${minItem.zhi}${relation}刑`;
      grey = true;
    } else if (relation === "遥") {
      conclusion = `${maxItem.zhi}${minItem.zhi}${relation}刑`;
      grey = true;
    }
    return { maxItem, minItem, conclusion, grey };
  });
  return newResult;
}

/**
 * 地支三合会局
 */
export function getZhiCombination(ganMap: any, zhiMap: any) {
  const ganElementMap = {};
  for (let i in ganMap) {
    const ganItem = ganMap[i];
    ganElementMap[gan_elements_dict[ganItem]] = ganItem;
  }
  const zhiMapReverse = getReverseMap(zhiMap);
  const result: any[] = [];
  const pairs = [
    ["申", "子", "辰", "水"],
    ["亥", "卯", "未", "木"],
    ["寅", "午", "戌", "火"],
    ["巳", "酉", "丑", "金"],
  ];
  pairs.forEach((pair) => {
    const [first, second, third, fourth] = pair;
    const firstItem = {
      zhi: first,
      num: zhiMapReverse[first]?.length,
      position: zhiMapReverse[first],
    };
    const secondItem = {
      zhi: second,
      num: zhiMapReverse[second]?.length,
      position: zhiMapReverse[second],
    };
    const thirdItem = {
      zhi: third,
      num: zhiMapReverse[third]?.length,
      position: zhiMapReverse[third],
    };
    const allPositionList = [
      ...(zhiMapReverse[first] || []),
      ...(zhiMapReverse[second] || []),
      ...(zhiMapReverse[third] || []),
    ];
    const isAdjacent =
      allPositionList.includes("month") && allPositionList.includes("day");
    if (zhiMapReverse[first] && zhiMapReverse[second] && zhiMapReverse[third]) {
      result.push({
        maxItem: firstItem,
        midItem: secondItem,
        minItem: thirdItem,
        transformation: fourth,
      });
    } else if (zhiMapReverse[first] && zhiMapReverse[second]) {
      const maxItem = firstItem.num >= secondItem.num ? firstItem : secondItem;
      const minItem = firstItem.num < secondItem.num ? firstItem : secondItem;
      result.push({
        maxItem,
        minItem,
        transformation: fourth,
      });
    } else if (zhiMapReverse[first] && zhiMapReverse[third]) {
      if (ganElementMap[fourth]) {
        const maxItem = firstItem.num >= thirdItem.num ? firstItem : thirdItem;
        const minItem = firstItem.num < thirdItem.num ? firstItem : thirdItem;
        result.push({
          maxItem,
          minItem,
          transformation: fourth,
          worship: ganElementMap[fourth],
        });
      }
    } else if (zhiMapReverse[second] && zhiMapReverse[third]) {
      const maxItem = secondItem.num >= thirdItem.num ? secondItem : thirdItem;
      const minItem = secondItem.num < thirdItem.num ? secondItem : thirdItem;
      result.push({
        maxItem,
        minItem,
        transformation: fourth,
      });
    }
  });
  const newResult = result.map(
    ({ maxItem, midItem, minItem, transformation, worship }) => {
      let conclusion, grey, transformSuccess;
      if (midItem) {
        transformSuccess = true;
        conclusion = `${maxItem.zhi}${midItem.zhi}${minItem.zhi}三合${transformation}局`;
        return { maxItem, minItem, conclusion };
      } else {
        const { totalNum, relation } = getRelationByPosition(maxItem, minItem);
        if (relation === "相") {
          if (worship) {
            transformSuccess = true;
            conclusion = `${maxItem.zhi}${minItem.zhi}暗拱${worship}合${transformation}局`;
          } else {
            transformSuccess = true;
            conclusion = `${maxItem.zhi}${minItem.zhi}半合`;
          }
        } else if (relation === "争") {
          conclusion = `二${maxItem.zhi}${relation}合一${minItem.zhi}`;
        } else if (relation === "双") {
          if (worship) {
            transformSuccess = true;
            conclusion = `二${maxItem.zhi}二${minItem.zhi}暗拱${worship}合${transformation}局`;
          } else {
            transformSuccess = true;
            conclusion = `二${maxItem.zhi}二${minItem.zhi}半合`;
          }
        } else if (relation === "隔") {
          conclusion = `${maxItem.zhi}${minItem.zhi}${relation}合`;
          grey = true;
        } else if (relation === "遥") {
          conclusion = `${maxItem.zhi}${minItem.zhi}${relation}合`;
          grey = true;
        }
      }
      return {
        maxItem,
        minItem,
        conclusion,
        grey,
        transformSuccess,
        transformation,
      };
    }
  );
  return newResult;
}

/**
 * 地支三会
 */
export function getZhiTriplet(ganMap: any, zhiMap: any) {
  const ganElementMap = {};
  for (let i in ganMap) {
    const ganItem = ganMap[i];
    ganElementMap[gan_elements_dict[ganItem]] = ganItem;
  }
  const zhiMapReverse = getReverseMap(zhiMap);
  const result: any[] = [];
  const pairs = [
    ["寅", "卯", "辰", "东方", "木"],
    ["申", "酉", "戌", "西方", "金"],
    ["巳", "午", "未", "南方", "火"],
    ["亥", "子", "丑", "北方", "水"],
  ];
  pairs.forEach((pair) => {
    const [first, second, third, fourth, fifth] = pair;
    const allPositionList = [
      ...(zhiMapReverse[first] || []),
      ...(zhiMapReverse[second] || []),
      ...(zhiMapReverse[third] || []),
    ];
    const isAdjacent =
      allPositionList.includes("month") && allPositionList.includes("day");
    if (zhiMapReverse[first] && zhiMapReverse[second] && zhiMapReverse[third]) {
      let transformation = "";
      if (ganElementMap[fifth]) {
        transformation = ganElementMap[fifth];
      }
      const firstItem = {
        zhi: first,
        num: zhiMapReverse[first]?.length,
        position: zhiMapReverse[first],
      };
      const secondItem = {
        zhi: second,
        num: zhiMapReverse[second]?.length,
        position: zhiMapReverse[second],
      };
      const thirdItem = {
        zhi: third,
        num: zhiMapReverse[third]?.length,
        position: zhiMapReverse[third],
      };
      result.push({
        maxItem: firstItem,
        midItem: secondItem,
        minItem: thirdItem,
        direction: fourth,
        transformation,
      });
    }
  });
  const newResult = result.map(
    ({ maxItem, midItem, minItem, direction, transformation }) => {
      let conclusion, transformSuccess;
      const transformationText = transformation
        ? "天干透" + transformation
        : "天干不透";
      transformSuccess = true;
      conclusion = `${maxItem.zhi}${midItem.zhi}${minItem.zhi}气聚${direction}, ${transformationText}`;
      return { maxItem, minItem, conclusion, transformSuccess, transformation };
    }
  );
  return newResult;
}

/**
 * 月令地支综合关系
 */
export function getMonthZhiRelation(
  oppositionConclusionList,
  compoundConclusionList,
  punishmentConclusionList,
  combinationConclusionList,
  tripletConclusionList
) {}

/**
 * 格局用神
 */
export function getWholeUse(
  horoscopeInfo,
  dayIsRooted,
  combinationGanList,
  oppositionConclusionList,
  compoundConclusionList,
  punishmentConclusionList,
  combinationConclusionList,
  tripletConclusionList
) {
  // console.log("日主是否有根", dayIsRooted);
  // console.log("天干合化", combinationGanList);
  // console.log("地支六冲", oppositionConclusionList);
  // console.log("地支六合", compoundConclusionList);
  // console.log("地支三刑", punishmentConclusionList);
  // console.log("地支三合会局", combinationConclusionList);
  // console.log("地支三合会方", tripletConclusionList);
  // const {
  //   yearGan,
  //   yearZhi,
  //   monthGan,
  //   monthZhi,
  //   dayGan,
  //   dayZhi,
  //   hourGan,
  //   hourZhi,
  // } = horoscopeInfo;
  // 天干是否有化神
  // let whole, use;
  // for (let i in combinationGanList) {
  //   if (combinationGanList[i]?.transformSuccess) {
  //     whole = combinationGanList[i].transformation;
  //   }
  // }
}
