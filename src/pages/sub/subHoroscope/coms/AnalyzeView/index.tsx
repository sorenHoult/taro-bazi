import { memo, useEffect, useMemo, useState, useImperativeHandle } from "react";
import classNames from "classnames";
import { vibrateShort } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import dayjs from "dayjs";
import {
  calFleetingDayList,
  calFleetingMonthList,
  calFleetingYearList,
  calLuckyAge,
  calLuckyList,
  calLuckySequence,
  ganzhiDyeing,
  getAdjacentSolarTermTime,
  getNextMonth,
  getPreviousMonth,
} from "@/utils/horoscope";
import {
  getGanCombination,
  getZhiCombination,
  getZhiCompound,
  getZhiOpposition,
  getZhiPunishment,
  getZhiTriplet,
} from "@/utils/structure";
import { getSolarTermInfo } from "@/utils/solarTerm";
import {
  gan_elements_dict,
  twelve_grow_state_dict,
  zhi_elements_dict,
  zhi_hide_gan_dict,
} from "@/assets/dict/zodiacData";

import "./index.scss";

function AnalyzeView({
  cRef,
  eyeOn,
  time,
  gender,
  horoscopeInfo,
  tenGodInfo,
  twelveGrowInfo,
  adjacentSolarTermTime,
  onHelpShow,
}) {
  // console.log("AnalyzeView render");

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

  const { luckyAge, luckyList, defaultLucky } = useMemo(() => {
    // 大运顺序
    const sequence = calLuckySequence(gender, yearGan);
    // 起运数
    const luckyAge = calLuckyAge(sequence, time, adjacentSolarTermTime);
    // 大运列表
    const luckyList = calLuckyList(
      sequence,
      luckyAge.startYear,
      luckyAge.age,
      monthGan,
      monthZhi,
      hourGan,
      hourZhi
    );
    // 默认第一项
    const defaultLucky = luckyList[0];
    return {
      luckyAge,
      luckyList,
      defaultLucky,
    };
  }, [time, gender, horoscopeInfo, adjacentSolarTermTime]);

  // 大运
  const [luckyActive, setLuckyActive] = useState<any>({});

  // 流年
  const [fleetingYearActive, setFleetingYearActive] = useState<any>({});
  const [fleetingYearList, setFleetingYearList] = useState<any[]>([]);

  // 是否有选中流年
  const hasFleetingYear = !!fleetingYearActive.year;

  // 流月
  const [fleetingMonthActive, setFleetingMonthActive] = useState<any>({});
  const [fleetingMonthList, setFleetingMonthList] = useState<any[]>([]);

  // 是否有选中流月
  const hasFleetingMonth = !!fleetingMonthActive.solarTerm;

  // 流日
  const [fleetingDayActive, setFleetingDayActive] = useState<any>({});
  const [fleetingDayList, setFleetingDayList] = useState<any[]>([]);

  // 是否有选中流日
  const hasFleetingDay = !!fleetingDayActive.date;

  // 大运/流年旺衰
  // const { impactToken, seasonFeature, tokenImpactList, impactActiveZhi } = useMemo(() => {
  //   if (!!fleetingYearActive.year) {
  //     const seasonFeature = season_state_dict[zhi_season_dict[monthZhi]];
  //     const tokenImpactList = getTokenImpactList({
  //       ...horoscopeInfo,
  //       luckyGan: luckyActive.gan,
  //       luckyZhi: luckyActive.zhi,
  //       fleetingYearGan: fleetingYearActive.gan,
  //       fleetingYearZhi: fleetingYearActive.zhi,
  //     }, tenGodInfo, seasonFeature);
  //     return {
  //       impactToken: "流年",
  //       seasonFeature,
  //       tokenImpactList,
  //       impactActiveZhi: fleetingYearActive.zhi
  //     }
  //   } else if (!!luckyActive.gan) {
  //     const seasonFeature = season_state_dict[zhi_season_dict[monthZhi]];
  //     const tokenImpactList = getTokenImpactList({
  //       ...horoscopeInfo,
  //       luckyGan: luckyActive.gan,
  //       luckyZhi: luckyActive.zhi,
  //     }, tenGodInfo, seasonFeature);
  //     return {
  //       impactToken: "大运",
  //       seasonFeature,
  //       tokenImpactList,
  //       impactActiveZhi: luckyActive.zhi
  //     }
  //   } else {
  //     return {}
  //   }
  // }, [luckyActive, fleetingYearActive, monthZhi])

  // 天干合化
  const combinationGanList = getGanCombination(
    {
      year: yearGan,
      month: monthGan,
      day: dayGan,
      hour: hourGan,
      lucky: luckyActive.gan,
      fleetingYear: fleetingYearActive.gan,
    },
    {
      year: yearZhi,
      month: monthZhi,
      day: dayZhi,
      hour: hourZhi,
      lucky: luckyActive.zhi,
      fleetingYear: fleetingYearActive.zhi,
    }
  );

  // 地支六冲
  const oppositionConclusionList = getZhiOpposition({
    year: yearZhi,
    month: monthZhi,
    day: dayZhi,
    hour: hourZhi,
    lucky: luckyActive.zhi,
    fleetingYear: fleetingYearActive.zhi,
  });

  // 地支六合
  const compoundConclusionList = getZhiCompound(
    {
      year: yearGan,
      month: monthGan,
      day: dayGan,
      hour: hourGan,
      lucky: luckyActive.gan,
      fleetingYear: fleetingYearActive.gan,
    },
    {
      year: yearZhi,
      month: monthZhi,
      day: dayZhi,
      hour: hourZhi,
      lucky: luckyActive.zhi,
      fleetingYear: fleetingYearActive.zhi,
    }
  );

  // 地支三刑
  const punishmentConclusionList = getZhiPunishment({
    year: yearZhi,
    month: monthZhi,
    day: dayZhi,
    hour: hourZhi,
    lucky: luckyActive.zhi,
    fleetingYear: fleetingYearActive.zhi,
  });

  // 地支三合会局
  const combinationConclusionList = getZhiCombination(
    {
      year: yearGan,
      month: monthGan,
      day: dayGan,
      hour: hourGan,
      lucky: luckyActive.gan,
      fleetingYear: fleetingYearActive.gan,
    },
    {
      year: yearZhi,
      month: monthZhi,
      day: dayZhi,
      hour: hourZhi,
      lucky: luckyActive.zhi,
      fleetingYear: fleetingYearActive.zhi,
    }
  );

  // 地支三合会方
  const tripletConclusionList = getZhiTriplet(
    {
      year: yearGan,
      month: monthGan,
      day: dayGan,
      hour: hourGan,
      lucky: luckyActive.gan,
      fleetingYear: fleetingYearActive.gan,
    },
    {
      year: yearZhi,
      month: monthZhi,
      day: dayZhi,
      hour: hourZhi,
      lucky: luckyActive.zhi,
      fleetingYear: fleetingYearActive.zhi,
    }
  );

  useEffect(() => {
    if (defaultLucky) {
      updateFleetingYearList(defaultLucky);
    }
  }, []);

  // 更新流年列表
  const updateFleetingYearList = (newActive) => {
    const fleetingYearList = calFleetingYearList(
      newActive.startYear,
      newActive.endYear
    );

    setLuckyActive(newActive || {});
    setFleetingYearList(fleetingYearList);
    updateFleetingMonthList({});
  };

  // 更新流月列表
  const updateFleetingMonthList = (newActive2) => {
    const fleetingMonthList = calFleetingMonthList(newActive2.gan);

    setFleetingYearActive(newActive2);
    setFleetingMonthList(fleetingMonthList);
    updateFleetingDayList({});
  };

  // 更新流日列表
  const updateFleetingDayList = (newActive3) => {
    if (!newActive3.solarTerm) {
      setFleetingMonthActive(newActive3);
      setFleetingDayActive({});
      setFleetingDayList([]);
      return;
    }
    let year = fleetingYearActive.year;
    let month = newActive3.month;
    // 处理month为13的情况
    if (month > 12) {
      year++;
      month = month - 12;
    }

    // 计算当月节气
    const solarTermInfo = getSolarTermInfo(year, month);

    // 计算上个月节气
    const previousMonth = getPreviousMonth(year, month);
    const solarTermPreviousInfo = getSolarTermInfo(
      previousMonth.year,
      previousMonth.month
    );

    // 计算下个月节气
    const nextMonth = getNextMonth(year, month);
    const solarTermNextInfo = getSolarTermInfo(nextMonth.year, nextMonth.month);

    const solarTermAllInfo = Object.assign(
      solarTermPreviousInfo,
      solarTermInfo,
      solarTermNextInfo
    );
    const solarTermTime = solarTermAllInfo[newActive3.solarTerm];

    newActive3.solarTermTime = solarTermTime;

    // 计算相邻节的时间
    const adjacentSolarTermTime = getAdjacentSolarTermTime(
      solarTermAllInfo,
      newActive3.solarTerm
    );

    // console.log("adjacentSolarTermTime", adjacentSolarTermTime);

    const fleetingDayList = calFleetingDayList(adjacentSolarTermTime);

    setFleetingMonthActive(newActive3);
    setFleetingDayActive({});
    setFleetingDayList(fleetingDayList);
  };

  const renderHideGan = (item, index) => {
    return (
      <Text
        key={index}
        style={{
          color: ganzhiDyeing(item),
        }}
      >
        {item}
        {gan_elements_dict[item]}
      </Text>
    );
  };

  useImperativeHandle(cRef, () => {
    return {
      getCombined: () => {
        return {
          combinationGanList,
          oppositionConclusionList,
          compoundConclusionList,
          punishmentConclusionList,
          combinationConclusionList,
          tripletConclusionList,
          luckyList,
        };
      },
    };
  });

  const renderZhiTenGod = (item, index) => {
    return <Text key={index}>{tenGodInfo[item]}</Text>;
  };

  const renderTwelveGrow = (zhi) => {
    const twelveGrowItem = twelveGrowInfo[zhi];
    if (!twelveGrowItem) return null;
    return (
      <>
        <Text>{twelveGrowItem}</Text>
        <Text>({twelve_grow_state_dict[twelveGrowItem]})</Text>
      </>
    );
  };

  const renderLuckyItem = (item, index) => {
    const isActive =
      luckyActive.startYear === item.startYear &&
      luckyActive.endYear === item.endYear;
    return (
      <View
        key={index}
        className={classNames("horoscope2__tsItem", {
          horoscope2__tsActiveItem: isActive,
        })}
        onClick={() => {
          if (isActive) return;
          vibrateShort({
            type: "light",
          });
          updateFleetingYearList(item);
        }}
      >
        <View className="horoscope2__tsTag">{item.startYear}</View>
        {eyeOn === 1 && (
          <View className="horoscope2__tsTag">
            {index === 0 && item.age !== 0 ? `1~${item.age}` : item.age + 1}岁
          </View>
        )}
        <View
          style={{
            color: ganzhiDyeing(item.gan),
          }}
        >
          {item.gan}
        </View>
        <View
          style={{
            color: ganzhiDyeing(item.zhi),
          }}
        >
          {item.zhi}
        </View>
      </View>
    );
  };

  const renderFleetingYearItem = (item, index) => {
    const isActive = fleetingYearActive.year === item.year;
    return (
      <View
        key={index}
        className={classNames("horoscope2__tsItem", {
          horoscope2__tsActiveItem: isActive,
        })}
        onClick={() => {
          if (isActive) {
            updateFleetingMonthList({});
            return;
          }
          vibrateShort({
            type: "light",
          });
          updateFleetingMonthList(item);
        }}
      >
        <View className="horoscope2__tsTag">{item.year}</View>
        {eyeOn === 1 && (
          <View className="horoscope2__tsTag">
            {item.year - luckyAge.startYear + 1}岁
          </View>
        )}
        <View
          style={{
            color: ganzhiDyeing(item.gan),
          }}
        >
          {item.gan}
        </View>
        <View
          style={{
            color: ganzhiDyeing(item.zhi),
          }}
        >
          {item.zhi}
        </View>
      </View>
    );
  };

  const renderFleetingMonthItem = (item, index) => {
    const isActive = fleetingMonthActive.solarTerm === item.solarTerm;
    return (
      <View
        key={index}
        className={classNames("horoscope2__tsItem", {
          horoscope2__tsActiveItem: isActive,
        })}
        onClick={() => {
          if (isActive) {
            updateFleetingDayList({});
            return;
          }
          vibrateShort({
            type: "light",
          });
          updateFleetingDayList(item);
        }}
      >
        <View className="horoscope2__tsTag">{item.solarTerm}</View>
        {!!item.solarTermTime && (
          <View className="horoscope2__tsTag2">
            {dayjs(item.solarTermTime).format("YYYY-M-D HH:mm")}
          </View>
        )}
        <View
          style={{
            color: ganzhiDyeing(item.gan),
          }}
        >
          {item.gan}
        </View>
        <View
          style={{
            color: ganzhiDyeing(item.zhi),
          }}
        >
          {item.zhi}
        </View>
      </View>
    );
  };

  const renderFleetingDayItem = (item, index) => {
    const isActive = fleetingDayActive.date === item.date;
    return (
      <View
        key={index}
        className={classNames("horoscope2__tsItem", {
          horoscope2__tsActiveItem: isActive,
        })}
        onClick={() => {
          if (isActive) {
            setFleetingDayActive({});
            return;
          }
          vibrateShort({
            type: "light",
          });
          setFleetingDayActive(item);
        }}
      >
        <View className="horoscope2__tsTag">{item.date}</View>
        <View
          style={{
            color: ganzhiDyeing(item.gan),
          }}
        >
          {item.gan}
        </View>
        <View
          style={{
            color: ganzhiDyeing(item.zhi),
          }}
        >
          {item.zhi}
        </View>
      </View>
    );
  };

  return (
    <>
      <View className="horoscope2__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("时间");
          }}
        >
          时间
        </View>
        {hasFleetingDay && <View className="horoscope2__th">流日</View>}
        {hasFleetingMonth && <View className="horoscope2__th">流月</View>}
        {hasFleetingYear && <View className="horoscope2__th">流年</View>}
        <View className="horoscope2__th">大运</View>
        <View className="horoscope2__th">年柱</View>
        <View className="horoscope2__th">月柱</View>
        <View className="horoscope2__th">日柱</View>
        <View className="horoscope2__th">时柱</View>
      </View>
      <View className="horoscope2__row">
        <View
          className="horoscope2__th horoscope__line"
          onClick={() => {
            onHelpShow("十神");
          }}
        >
          十神
        </View>
        {hasFleetingDay && (
          <View className="horoscope2__td">
            {tenGodInfo[fleetingDayActive.gan]}
          </View>
        )}
        {hasFleetingMonth && (
          <View className="horoscope2__td">
            {tenGodInfo[fleetingMonthActive.gan]}
          </View>
        )}
        {hasFleetingYear && (
          <View className="horoscope2__td">
            {tenGodInfo[fleetingYearActive.gan]}
          </View>
        )}
        <View className="horoscope2__td">{tenGodInfo[luckyActive.gan]}</View>
        <View className="horoscope2__td">{tenGodInfo[yearGan]}</View>
        <View className="horoscope2__td">{tenGodInfo[monthGan]}</View>
        <View
          className="horoscope2__td horoscope__line"
          onClick={() => {
            onHelpShow("日主");
          }}
        >
          日主
        </View>
        <View className="horoscope2__td">{tenGodInfo[hourGan]}</View>
      </View>
      <View className="horoscope2__row">
        <View
          className="horoscope2__th horoscope__line"
          onClick={() => {
            onHelpShow("天干");
          }}
        >
          天干
        </View>

        {hasFleetingDay && (
          <View
            className="horoscope2__tm"
            style={{
              color: ganzhiDyeing(fleetingDayActive.gan),
            }}
          >
            {fleetingDayActive.gan}
            <Text className="horoscope2__tmText">
              {gan_elements_dict[fleetingDayActive.gan]}
            </Text>
          </View>
        )}

        {hasFleetingMonth && (
          <View
            className="horoscope2__tm"
            style={{
              color: ganzhiDyeing(fleetingMonthActive.gan),
            }}
          >
            {fleetingMonthActive.gan}
            <Text className="horoscope2__tmText">
              {gan_elements_dict[fleetingMonthActive.gan]}
            </Text>
          </View>
        )}

        {hasFleetingYear && (
          <View
            className="horoscope2__tm"
            style={{
              color: ganzhiDyeing(fleetingYearActive.gan),
            }}
          >
            {fleetingYearActive.gan}
            <Text className="horoscope2__tmText">
              {gan_elements_dict[fleetingYearActive.gan]}
            </Text>
          </View>
        )}

        <View
          className="horoscope2__tm"
          style={{
            color: ganzhiDyeing(luckyActive.gan),
          }}
        >
          {luckyActive.gan}
          <Text className="horoscope2__tmText">
            {gan_elements_dict[luckyActive.gan]}
          </Text>
        </View>

        <View
          className="horoscope2__tm"
          style={{
            color: ganzhiDyeing(yearGan),
          }}
        >
          {yearGan}
          <Text className="horoscope2__tmText">
            {gan_elements_dict[yearGan]}
          </Text>
        </View>
        <View
          className="horoscope2__tm"
          style={{
            color: ganzhiDyeing(monthGan),
          }}
        >
          {monthGan}
          <Text className="horoscope2__tmText">
            {gan_elements_dict[monthGan]}
          </Text>
        </View>
        <View
          className="horoscope2__tm"
          style={{
            color: ganzhiDyeing(dayGan),
          }}
        >
          {dayGan}
          <Text className="horoscope2__tmText">
            {gan_elements_dict[dayGan]}
          </Text>
        </View>
        <View
          className="horoscope2__tm"
          style={{
            color: ganzhiDyeing(hourGan),
          }}
        >
          {hourGan}
          <Text className="horoscope2__tmText">
            {gan_elements_dict[hourGan]}
          </Text>
        </View>
      </View>

      <View className="horoscope2__row">
        <View
          className="horoscope2__th horoscope__line"
          onClick={() => {
            onHelpShow("地支");
          }}
        >
          地支
        </View>

        {hasFleetingDay && (
          <View
            className="horoscope2__tm"
            style={{
              color: ganzhiDyeing(fleetingDayActive.zhi),
            }}
          >
            {fleetingDayActive.zhi}
            <Text className="horoscope2__tmText">
              {zhi_elements_dict[fleetingDayActive.zhi]}
            </Text>
          </View>
        )}

        {hasFleetingMonth && (
          <View
            className="horoscope2__tm"
            style={{
              color: ganzhiDyeing(fleetingMonthActive.zhi),
            }}
          >
            {fleetingMonthActive.zhi}
            <Text className="horoscope2__tmText">
              {zhi_elements_dict[fleetingMonthActive.zhi]}
            </Text>
          </View>
        )}

        {hasFleetingYear && (
          <View
            className="horoscope2__tm"
            style={{
              color: ganzhiDyeing(fleetingYearActive.zhi),
            }}
          >
            {fleetingYearActive.zhi}
            <Text className="horoscope2__tmText">
              {zhi_elements_dict[fleetingYearActive.zhi]}
            </Text>
          </View>
        )}

        <View
          className="horoscope2__tm"
          style={{
            color: ganzhiDyeing(luckyActive.zhi),
          }}
        >
          {luckyActive.zhi}
          <Text className="horoscope2__tmText">
            {zhi_elements_dict[luckyActive.zhi]}
          </Text>
        </View>

        <View
          className="horoscope2__tm"
          style={{
            color: ganzhiDyeing(yearZhi),
          }}
        >
          {yearZhi}
          <Text className="horoscope2__tmText">
            {zhi_elements_dict[yearZhi]}
          </Text>
        </View>
        <View
          className="horoscope2__tm"
          style={{
            color: ganzhiDyeing(monthZhi),
          }}
        >
          {monthZhi}
          <Text className="horoscope2__tmText">
            {zhi_elements_dict[monthZhi]}
          </Text>
        </View>
        <View
          className="horoscope2__tm"
          style={{
            color: ganzhiDyeing(dayZhi),
          }}
        >
          {dayZhi}
          <Text className="horoscope2__tmText">
            {zhi_elements_dict[dayZhi]}
          </Text>
        </View>
        <View
          className="horoscope2__tm"
          style={{
            color: ganzhiDyeing(hourZhi),
          }}
        >
          {hourZhi}
          <Text className="horoscope2__tmText">
            {zhi_elements_dict[hourZhi]}
          </Text>
        </View>
      </View>

      <View className="horoscope2__row">
        <View
          className="horoscope2__th horoscope__line"
          onClick={() => {
            onHelpShow("藏干");
          }}
        >
          藏干
        </View>
        {hasFleetingDay && (
          <View className="horoscope2__tl">
            {zhi_hide_gan_dict[fleetingDayActive.zhi]?.map(renderHideGan)}
          </View>
        )}
        {hasFleetingMonth && (
          <View className="horoscope2__tl">
            {zhi_hide_gan_dict[fleetingMonthActive.zhi]?.map(renderHideGan)}
          </View>
        )}
        {hasFleetingYear && (
          <View className="horoscope2__tl">
            {zhi_hide_gan_dict[fleetingYearActive.zhi]?.map(renderHideGan)}
          </View>
        )}
        <View className="horoscope2__tl">
          {zhi_hide_gan_dict[luckyActive.zhi]?.map(renderHideGan)}
        </View>
        <View className="horoscope2__tl">
          {zhi_hide_gan_dict[yearZhi]?.map(renderHideGan)}
        </View>
        <View className="horoscope2__tl">
          {zhi_hide_gan_dict[monthZhi]?.map(renderHideGan)}
        </View>
        <View className="horoscope2__tl">
          {zhi_hide_gan_dict[dayZhi]?.map(renderHideGan)}
        </View>
        <View className="horoscope2__tl">
          {zhi_hide_gan_dict[hourZhi]?.map(renderHideGan)}
        </View>
      </View>

      <View className="horoscope2__row">
        <View
          className="horoscope2__th horoscope__line"
          onClick={() => {
            onHelpShow("十神");
          }}
        >
          十神
        </View>
        {hasFleetingDay && (
          <View className="horoscope2__tl">
            {zhi_hide_gan_dict[fleetingDayActive.zhi]?.map(renderZhiTenGod)}
          </View>
        )}
        {hasFleetingMonth && (
          <View className="horoscope2__tl">
            {zhi_hide_gan_dict[fleetingMonthActive.zhi]?.map(renderZhiTenGod)}
          </View>
        )}
        {hasFleetingYear && (
          <View className="horoscope2__tl">
            {zhi_hide_gan_dict[fleetingYearActive.zhi]?.map(renderZhiTenGod)}
          </View>
        )}
        <View className="horoscope2__tl">
          {zhi_hide_gan_dict[luckyActive.zhi]?.map(renderZhiTenGod)}
        </View>
        <View className="horoscope2__tl">
          {zhi_hide_gan_dict[yearZhi]?.map(renderZhiTenGod)}
        </View>
        <View className="horoscope2__tl">
          {zhi_hide_gan_dict[monthZhi]?.map(renderZhiTenGod)}
        </View>
        <View className="horoscope2__tl">
          {zhi_hide_gan_dict[dayZhi]?.map(renderZhiTenGod)}
        </View>
        <View className="horoscope2__tl">
          {zhi_hide_gan_dict[hourZhi]?.map(renderZhiTenGod)}
        </View>
      </View>

      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("十二长生");
          }}
        >
          长生
        </View>
        {hasFleetingDay && (
          <View className="horoscope2__tl">
            {renderTwelveGrow(fleetingDayActive.zhi)}
          </View>
        )}
        {hasFleetingMonth && (
          <View className="horoscope2__tl">
            {renderTwelveGrow(fleetingMonthActive.zhi)}
          </View>
        )}
        {hasFleetingYear && (
          <View className="horoscope2__tl">
            {renderTwelveGrow(fleetingYearActive.zhi)}
          </View>
        )}
        <View className="horoscope2__tl">
          {renderTwelveGrow(luckyActive.zhi)}
        </View>
        <View className="horoscope2__tl">{renderTwelveGrow(yearZhi)}</View>
        <View className="horoscope2__tl">{renderTwelveGrow(monthZhi)}</View>
        <View className="horoscope2__tl">{renderTwelveGrow(dayZhi)}</View>
        <View className="horoscope2__tl">{renderTwelveGrow(hourZhi)}</View>
      </View>

      {/* <View className="horoscope2__row">
        <View className="horoscope2__th">空亡</View>
        {hasFleetingDay && (
          <View className="horoscope2__td">
            {getVacancy(fleetingDayActive.gan, fleetingDayActive.zhi)}
          </View>
        )}
        {hasFleetingMonth && (
          <View className="horoscope2__td">
            {getVacancy(fleetingMonthActive.gan, fleetingMonthActive.zhi)}
          </View>
        )}
        <View className="horoscope2__td">
          {getVacancy(fleetingYearActive.gan, fleetingYearActive.zhi)}
        </View>
        <View className="horoscope2__td">
          {getVacancy(luckyActive.gan, luckyActive.zhi)}
        </View>
        <View className="horoscope2__td">{getVacancy(yearGan, yearZhi)}</View>
        <View className="horoscope2__td">{getVacancy(monthGan, monthZhi)}</View>
        <View className="horoscope2__td">{getVacancy(dayGan, dayZhi)}</View>
        <View className="horoscope2__td">{getVacancy(hourGan, hourZhi)}</View>
      </View> */}

      {/* <View className="horoscope2__row">
        <View className="horoscope2__th">纳音</View>
        {hasFleetingDay && (
          <View className="horoscope2__td">
            {nayin_dict[`${fleetingDayActive.gan}${fleetingDayActive.zhi}`]}
          </View>
        )}
        {hasFleetingMonth && (
          <View className="horoscope2__td">
            {nayin_dict[`${fleetingMonthActive.gan}${fleetingMonthActive.zhi}`]}
          </View>
        )}
        <View className="horoscope2__td">
          {nayin_dict[`${fleetingYearActive.gan}${fleetingYearActive.zhi}`]}
        </View>
        <View className="horoscope2__td">
          {nayin_dict[`${luckyActive.gan}${luckyActive.zhi}`]}
        </View>
        <View className="horoscope2__td">
          {nayin_dict[`${yearGan}${yearZhi}`]}
        </View>
        <View className="horoscope2__td">
          {nayin_dict[`${monthGan}${monthZhi}`]}
        </View>
        <View className="horoscope2__td">
          {nayin_dict[`${dayGan}${dayZhi}`]}
        </View>
        <View className="horoscope2__td">
          {nayin_dict[`${hourGan}${hourZhi}`]}
        </View>
      </View> */}

      <View className="horoscope2__row">
        <View className="horoscope2__th">起运</View>
        <View className="horoscope2__tr">
          出生后{luckyAge.year}年{luckyAge.month}月{luckyAge.day}天
          {luckyAge.hour}时起运
        </View>
      </View>

      <View className="horoscope2__row">
        <View
          className="horoscope2__th horoscope__line"
          onClick={() => {
            onHelpShow("大运");
          }}
        >
          大运
        </View>
        <ScrollView className="horoscope2__ts" scrollX>
          <View className="horoscope2__tsView">
            {luckyList.map(renderLuckyItem)}
          </View>
        </ScrollView>
      </View>

      <View className="horoscope2__row">
        <View className="horoscope2__th">流年</View>
        <ScrollView className="horoscope2__ts" scrollX>
          <View className="horoscope2__tsView">
            {fleetingYearList.map(renderFleetingYearItem)}
          </View>
        </ScrollView>
      </View>

      <View className="horoscope2__row">
        <View className="horoscope2__th">流月</View>
        <ScrollView className="horoscope2__ts" scrollX>
          <View className="horoscope2__tsView">
            {fleetingMonthList.map(renderFleetingMonthItem)}
          </View>
        </ScrollView>
      </View>

      <View className="horoscope2__row">
        <View className="horoscope2__th">流日</View>
        <ScrollView className="horoscope2__ts" scrollX>
          <View className="horoscope2__tsView">
            {fleetingDayList.map(renderFleetingDayItem)}
          </View>
        </ScrollView>
      </View>

      <View className="horoscope2__row">
        <View
          className="horoscope2__th horoscope__line"
          onClick={() => {
            onHelpShow("天干合化");
          }}
        >
          天干合化
        </View>
        <View className="horoscope2__tr">
          {combinationGanList.map((item, index) => (
            <Text
              key={index}
              className={classNames({
                horoscope__grayText: item.grey,
              })}
            >
              {" "}
              {item.conclusion}{" "}
            </Text>
          ))}
        </View>
      </View>

      <View className="horoscope2__row">
        <View
          className="horoscope2__th horoscope__line"
          onClick={() => {
            onHelpShow("地支六冲");
          }}
        >
          地支六冲
        </View>
        <View className="horoscope2__tr">
          {oppositionConclusionList.map((item, index) => (
            <Text
              key={index}
              className={classNames({
                horoscope__grayText: item.grey,
              })}
            >
              {" "}
              {item.conclusion}{" "}
            </Text>
          ))}
        </View>
      </View>

      <View className="horoscope2__row">
        <View
          className="horoscope2__th horoscope__line"
          onClick={() => {
            onHelpShow("地支六合");
          }}
        >
          地支六合
        </View>
        <View className="horoscope2__tr">
          {compoundConclusionList.map((item, index) => (
            <Text
              key={index}
              className={classNames({
                horoscope__grayText: item.grey,
              })}
            >
              {" "}
              {item.conclusion}{" "}
            </Text>
          ))}
        </View>
      </View>

      <View className="horoscope2__row">
        <View
          className="horoscope2__th horoscope__line"
          onClick={() => {
            onHelpShow("地支三刑");
          }}
        >
          地支三刑
        </View>
        <View className="horoscope2__tr">
          {punishmentConclusionList.map((item, index) => (
            <Text
              key={index}
              className={classNames({
                horoscope__grayText: item.grey,
              })}
            >
              {" "}
              {item.conclusion}{" "}
            </Text>
          ))}
        </View>
      </View>

      <View className="horoscope2__row">
        <View
          className="horoscope2__th horoscope__line"
          onClick={() => {
            onHelpShow("地支三合会局");
          }}
        >
          三合会局
        </View>
        <View className="horoscope2__tr">
          {combinationConclusionList.map((item, index) => (
            <Text
              key={index}
              className={classNames({
                horoscope__grayText: item.grey,
              })}
            >
              {" "}
              {item.conclusion}{" "}
            </Text>
          ))}
        </View>
      </View>

      <View className="horoscope2__row">
        <View
          className="horoscope2__th horoscope__line"
          onClick={() => {
            onHelpShow("地支三合会方");
          }}
        >
          三合会方
        </View>
        <View className="horoscope2__tr">
          {tripletConclusionList.map((item, index) => (
            <Text key={index}> {item.conclusion} </Text>
          ))}
        </View>
      </View>
    </>
  );
}

export default memo(AnalyzeView);
