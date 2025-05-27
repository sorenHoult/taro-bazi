import {
  gan_dict,
  gan_elements_dict,
  zhi_hide_gan_dict,
  zhi_hide_gan_score_dict,
  generating_relations_dict,
  overcoming_relations_dict,
} from "@/assets/dict/zodiacData";
import { toRounding } from "./index";

function fun2(gan1, gan2, samePillar = false, isDayGan = false) {
  const ganElement1 = gan_elements_dict[gan1];
  const ganElement2 = gan_elements_dict[gan2];
  const ganIndex1 = gan_dict.findIndex((gan) => gan === gan1);
  const ganIndex2 = gan_dict.findIndex((gan) => gan === gan2);

  const samePolarity = (ganIndex1 + ganIndex2) % 2 === 0;
  let relation = "";
  let coefficient = 0;

  const relations = {
    same: ganElement1 === ganElement2,
    generating: generating_relations_dict[ganElement1] === ganElement2,
    generatedBy: generating_relations_dict[ganElement2] === ganElement1,
    overcoming: overcoming_relations_dict[ganElement1] === ganElement2,
    overcomeBy: overcoming_relations_dict[ganElement2] === ganElement1,
  };

  if (relations.same) {
    relation = "同";
    coefficient = samePillar ? 0.5 : 0;
  } else if (relations.generating) {
    relation = "生";
    coefficient = samePillar ? -0.3 : isDayGan ? 0 : -0.3;
  } else if (relations.generatedBy) {
    relation = "被生";
    coefficient = samePillar ? 0.3 : samePolarity ? 0.2 : 0.3;
  } else if (relations.overcoming) {
    relation = "克";
    coefficient = samePillar ? -0.3 : 0;
  } else if (relations.overcomeBy) {
    relation = "被克";
    coefficient = samePillar ? -0.5 : 0;
  }

  return {
    relation,
    coefficient,
  };
}

/**
 * 日主旺衰
 */
export function fun1(horoscopeInfo) {
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
  const baseScore = 36;
  let currentCoefficient = 0;
  let extraScore = 0;

  const dayZhiHideGan = zhi_hide_gan_dict[dayZhi];
  // 日柱关系
  const dayRelation = fun2(dayGan, dayZhiHideGan[0], true);
  // 日干和月干关系
  const dayAndMonthRelation = fun2(dayGan, monthGan, false, true);
  // 日干和时干关系
  const dayAndHourRelation = fun2(dayGan, hourGan, false, true);
  // 日干和年干关系
  const dayAndYearRelation = fun2(dayGan, yearGan, false, true);

  currentCoefficient += dayRelation.coefficient;
  //  月干是同类五行
  if (dayAndMonthRelation.relation === "同") {
    const monthZhiHideGan = zhi_hide_gan_dict[monthZhi][0];
    // 月柱关系
    const monthRelation = fun2(monthGan, monthZhiHideGan, true);
    // 月干和年干关系
    const monthAndYearRelation = fun2(monthGan, yearGan);
    extraScore +=
      baseScore *
      (1 + monthRelation.coefficient + monthAndYearRelation.coefficient);
    // console.log("月", extraScore);
  } else {
    currentCoefficient += dayAndMonthRelation.coefficient;
  }

  //  时干是同类五行
  if (dayAndHourRelation.relation === "同") {
    const hourZhiHideGan = zhi_hide_gan_dict[hourZhi][0];
    // 时柱关系
    const hourRelation = fun2(hourGan, hourZhiHideGan, true);
    extraScore += baseScore * (1 + hourRelation.coefficient);
    // console.log("时", extraScore);
  } else {
    currentCoefficient += dayAndHourRelation.coefficient;
  }

  //  年干是同类五行
  if (dayAndYearRelation.relation === "同") {
    const yearZhiHideGan = zhi_hide_gan_dict[yearZhi][0];
    // 年柱关系
    const yearRelation = fun2(yearGan, yearZhiHideGan, true);
    // 年干和月干关系
    const yearAndMonthRelation = fun2(yearGan, monthGan);
    const yearScore =
      baseScore *
      (1 + yearRelation.coefficient + yearAndMonthRelation.coefficient);
    extraScore +=
      dayAndMonthRelation.relation === "同" ? yearScore : yearScore * 0.5;
    // console.log("年", extraScore);
  } else {
    if (dayAndMonthRelation.relation === dayAndYearRelation.relation) {
      currentCoefficient += dayAndYearRelation.coefficient;
    } else {
      currentCoefficient += dayAndYearRelation.coefficient * 0.5;
    }
  }

  const finalGanScore = baseScore * (1 + currentCoefficient) + extraScore;

  let finalZhiScore = 0;
  const dayGanElement = gan_elements_dict[dayGan];
  // 日支是否有根
  const dayRootedIndex = dayZhiHideGan.findIndex(
    (hideGan) => gan_elements_dict[hideGan] === dayGanElement
  );
  if (dayRootedIndex > -1) {
    finalZhiScore += zhi_hide_gan_score_dict[dayZhi][dayRootedIndex];
  }
  if (dayRootedIndex > -1 || dayGanElement === gan_elements_dict[monthGan]) {
    // 月支是否有根
    const monthRootedIndex = zhi_hide_gan_dict[monthZhi].findIndex(
      (hideGan) => gan_elements_dict[hideGan] === dayGanElement
    );
    if (
      monthRootedIndex > -1 ||
      (dayGanElement === gan_elements_dict[yearGan] &&
        gan_elements_dict[monthGan] === gan_elements_dict[yearGan])
    ) {
      finalZhiScore += zhi_hide_gan_score_dict[monthZhi][monthRootedIndex];
      // 年支是否有根
      const yearRootedIndex = zhi_hide_gan_dict[yearZhi].findIndex(
        (hideGan) => gan_elements_dict[hideGan] === dayGanElement
      );
      if (yearRootedIndex > -1) {
        finalZhiScore += zhi_hide_gan_score_dict[yearZhi][yearRootedIndex];
      }
    }
  }
  if (dayRootedIndex > -1 || dayGanElement === gan_elements_dict[hourGan]) {
    // 时支是否有根
    const hourRootedIndex = zhi_hide_gan_dict[hourZhi]?.findIndex(
      (hideGan) => gan_elements_dict[hideGan] === dayGanElement
    );
    if (hourRootedIndex > -1) {
      finalZhiScore += zhi_hide_gan_score_dict[hourZhi][hourRootedIndex];
    }
  }

  const finalScore = toRounding(finalGanScore + finalZhiScore);

  return {
    finalGanScore,
    finalZhiScore,
    finalScore,
  };
}
