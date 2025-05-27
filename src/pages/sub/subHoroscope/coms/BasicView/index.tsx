import { memo, useImperativeHandle } from "react";
import classNames from "classnames";
import { View, Text } from "@tarojs/components";
import {
  ganzhiDyeing,
  getTemperatureAndHumidity,
  climateDyeing,
  getTokenImpactList,
} from "@/utils/horoscope";
import {
  getGanCombination,
  getGanIsRooted,
  getWholeUse,
  getZhiCombination,
  getZhiCompound,
  getZhiOpposition,
  getZhiPunishment,
  getZhiTriplet,
} from "@/utils/structure";
import { fun1 } from "@/utils/quantization";
import {
  gan_elements_dict,
  season_state_dict,
  twelve_grow_state_dict,
  zhi_elements_dict,
  zhi_hide_gan_dict,
  zhi_season_dict,
} from "@/assets/dict/zodiacData";

import "./index.scss";

function BasicView({
  cRef,
  horoscopeInfo,
  tenGodInfo,
  twelveGrowInfo,
  onHelpShow,
}) {
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

  // 日主旺衰
  const fun1Value = fun1(horoscopeInfo);
  // console.log("日主旺衰", fun1Value);

  // 月令旺衰
  const seasonFeature = season_state_dict[zhi_season_dict[monthZhi]];
  const monthZhiImpactList = getTokenImpactList(
    horoscopeInfo,
    tenGodInfo,
    seasonFeature
  );

  // 日主是否有根
  // const dayIsRooted = getGanIsRooted(gan_elements_dict[dayGan], {
  //   year: yearZhi,
  //   month: monthZhi,
  //   day: dayZhi,
  //   hour: hourZhi,
  // });

  // 天干合化
  const combinationGanList = getGanCombination(
    {
      year: yearGan,
      month: monthGan,
      day: dayGan,
      hour: hourGan,
    },
    {
      year: yearZhi,
      month: monthZhi,
      day: dayZhi,
      hour: hourZhi,
    }
  );

  // 地支六冲
  const oppositionConclusionList = getZhiOpposition({
    year: yearZhi,
    month: monthZhi,
    day: dayZhi,
    hour: hourZhi,
  });

  // 地支六合
  const compoundConclusionList = getZhiCompound(
    {
      year: yearGan,
      month: monthGan,
      day: dayGan,
      hour: hourGan,
    },
    {
      year: yearZhi,
      month: monthZhi,
      day: dayZhi,
      hour: hourZhi,
    }
  );

  // 地支三刑
  const punishmentConclusionList = getZhiPunishment({
    year: yearZhi,
    month: monthZhi,
    day: dayZhi,
    hour: hourZhi,
  });

  // 地支三合会局
  const combinationConclusionList = getZhiCombination(
    {
      year: yearGan,
      month: monthGan,
      day: dayGan,
      hour: hourGan,
    },
    {
      year: yearZhi,
      month: monthZhi,
      day: dayZhi,
      hour: hourZhi,
    }
  );

  // 地支三合会方
  const tripletConclusionList = getZhiTriplet(
    {
      year: yearGan,
      month: monthGan,
      day: dayGan,
      hour: hourGan,
    },
    {
      year: yearZhi,
      month: monthZhi,
      day: dayZhi,
      hour: hourZhi,
    }
  );

  // 格局用神
  // const wholeUse = getWholeUse(horoscopeInfo, dayIsRooted, combinationGanList, oppositionConclusionList, compoundConclusionList, punishmentConclusionList, combinationConclusionList, tripletConclusionList);
  // console.log("格局用神", wholeUse);

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

  const renderZhiTenGod = (item, index) => {
    return <Text key={index}>{tenGodInfo[item]}</Text>;
  };

  const renderTwelveGrow = (zhi) => {
    const twelveGrowItem = twelveGrowInfo[zhi];
    return (
      <>
        <Text>{twelveGrowItem}</Text>
        <Text>({twelve_grow_state_dict[twelveGrowItem]})</Text>
      </>
    );
  };

  const renderMonthZhiImpact = () => {
    return (
      <>
        <Text> 季节特征 : {seasonFeature} </Text>
        {monthZhiImpactList.map((item) => {
          return (
            <View key={item.name} className="horoscope__trWrap__row">
              <Text className="horoscope__trWrap__name">
                {item.name}【{item.power}】
              </Text>
              <Text className="horoscope__trWrap__content">
                {item.list.join(" ")}
              </Text>
            </View>
          );
        })}
      </>
    );
  };

  const renderTemperatureAndHumidity = () => {
    const { ganTHList, zhiTHList, monthTHList, scoring, climate, isUrgent } =
      getTemperatureAndHumidity(horoscopeInfo);
    return (
      <>
        <Text> 天干 : {ganTHList.join(" ")} </Text>
        <Text> 地支 : {zhiTHList.join(" ")} </Text>
        <Text> 月地支 : {monthTHList.join(" ")} </Text>
        <Text>
          {" "}
          寒暖燥湿度 : {scoring}{" "}
          <Text
            style={{
              color: climateDyeing(climate),
            }}
          >
            {climate}
          </Text>{" "}
          {isUrgent && <Text>(调候为先)</Text>}
        </Text>
      </>
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
        };
      },
    };
  });

  return (
    <>
      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("时间");
          }}
        >
          时间
        </View>
        <View className="horoscope__th">年柱</View>
        <View className="horoscope__th">月柱</View>
        <View className="horoscope__th">日柱</View>
        <View className="horoscope__th">时柱</View>
      </View>
      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("十神");
          }}
        >
          十神
        </View>
        <View className="horoscope__td">{tenGodInfo[yearGan]}</View>
        <View className="horoscope__td">{tenGodInfo[monthGan]}</View>
        <View
          className="horoscope__td horoscope__line"
          onClick={() => {
            onHelpShow("日主");
          }}
        >
          日主
        </View>
        <View className="horoscope__td">{tenGodInfo[hourGan]}</View>
      </View>
      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("天干");
          }}
        >
          天干
        </View>
        <View
          className="horoscope__tm"
          style={{
            color: ganzhiDyeing(yearGan),
          }}
        >
          {yearGan}
          <Text className="horoscope__tmText">
            {gan_elements_dict[yearGan]}
          </Text>
        </View>
        <View
          className="horoscope__tm"
          style={{
            color: ganzhiDyeing(monthGan),
          }}
        >
          {monthGan}
          <Text className="horoscope__tmText">
            {gan_elements_dict[monthGan]}
          </Text>
        </View>
        <View
          className="horoscope__tm"
          style={{
            color: ganzhiDyeing(dayGan),
          }}
        >
          {dayGan}
          <Text className="horoscope__tmText">{gan_elements_dict[dayGan]}</Text>
        </View>
        <View
          className="horoscope__tm"
          style={{
            color: ganzhiDyeing(hourGan),
          }}
        >
          {hourGan}
          <Text className="horoscope__tmText">
            {gan_elements_dict[hourGan]}
          </Text>
        </View>
      </View>

      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("地支");
          }}
        >
          地支
        </View>
        <View
          className="horoscope__tm"
          style={{
            color: ganzhiDyeing(yearZhi),
          }}
        >
          {yearZhi}
          <Text className="horoscope__tmText">
            {zhi_elements_dict[yearZhi]}
          </Text>
        </View>
        <View
          className="horoscope__tm"
          style={{
            color: ganzhiDyeing(monthZhi),
          }}
        >
          {monthZhi}
          <Text className="horoscope__tmText">
            {zhi_elements_dict[monthZhi]}
          </Text>
        </View>
        <View
          className="horoscope__tm"
          style={{
            color: ganzhiDyeing(dayZhi),
          }}
        >
          {dayZhi}
          <Text className="horoscope__tmText">{zhi_elements_dict[dayZhi]}</Text>
        </View>
        <View
          className="horoscope__tm"
          style={{
            color: ganzhiDyeing(hourZhi),
          }}
        >
          {hourZhi}
          <Text className="horoscope__tmText">
            {zhi_elements_dict[hourZhi]}
          </Text>
        </View>
      </View>

      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("藏干");
          }}
        >
          藏干
        </View>
        <View className="horoscope__tl">
          {zhi_hide_gan_dict[yearZhi]?.map(renderHideGan)}
        </View>
        <View className="horoscope__tl">
          {zhi_hide_gan_dict[monthZhi]?.map(renderHideGan)}
        </View>
        <View className="horoscope__tl">
          {zhi_hide_gan_dict[dayZhi]?.map(renderHideGan)}
        </View>
        <View className="horoscope__tl">
          {zhi_hide_gan_dict[hourZhi]?.map(renderHideGan)}
        </View>
      </View>
      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("十神");
          }}
        >
          十神
        </View>
        <View className="horoscope__tl">
          {zhi_hide_gan_dict[yearZhi]?.map(renderZhiTenGod)}
        </View>
        <View className="horoscope__tl">
          {zhi_hide_gan_dict[monthZhi]?.map(renderZhiTenGod)}
        </View>
        <View className="horoscope__tl">
          {zhi_hide_gan_dict[dayZhi]?.map(renderZhiTenGod)}
        </View>
        <View className="horoscope__tl">
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
        <View className="horoscope__tl">{renderTwelveGrow(yearZhi)}</View>
        <View className="horoscope__tl">{renderTwelveGrow(monthZhi)}</View>
        <View className="horoscope__tl">{renderTwelveGrow(dayZhi)}</View>
        <View className="horoscope__tl">{renderTwelveGrow(hourZhi)}</View>
      </View>

      {/* <View className="horoscope__row">
        <View className="horoscope__th">空亡</View>
        <View className="horoscope__td">{getVacancy(yearGan, yearZhi)}</View>
        <View className="horoscope__td">{getVacancy(monthGan, monthZhi)}</View>
        <View className="horoscope__td">{getVacancy(dayGan, dayZhi)}</View>
        <View className="horoscope__td">{getVacancy(hourGan, hourZhi)}</View>
      </View> */}

      {/* <View className="horoscope__row">
        <View className="horoscope__th">纳音</View>
        <View className="horoscope__td">
          {nayin_dict[`${yearGan}${yearZhi}`]}
        </View>
        <View className="horoscope__td">
          {nayin_dict[`${monthGan}${monthZhi}`]}
        </View>
        <View className="horoscope__td">
          {nayin_dict[`${dayGan}${dayZhi}`]}
        </View>
        <View className="horoscope__td">
          {nayin_dict[`${hourGan}${hourZhi}`]}
        </View>
      </View> */}

      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("天干合化");
          }}
        >
          天干合化
        </View>
        <View className="horoscope__tr">
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

      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("地支六冲");
          }}
        >
          地支六冲
        </View>
        <View className="horoscope__tr">
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

      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("地支六合");
          }}
        >
          地支六合
        </View>
        <View className="horoscope__tr">
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

      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("地支三刑");
          }}
        >
          地支三刑
        </View>
        <View className="horoscope__tr">
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

      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("地支三合会局");
          }}
        >
          三合会局
        </View>
        <View className="horoscope__tr">
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

      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("地支三合会方");
          }}
        >
          三合会方
        </View>
        <View className="horoscope__tr">
          {tripletConclusionList.map((item, index) => (
            <Text key={index}> {item.conclusion} </Text>
          ))}
        </View>
      </View>

      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("月令旺衰");
          }}
        >
          月令旺衰
        </View>
        <View className="horoscope__tr horoscope__trWrap">
          <Text>
            月令
            <Text
              style={{
                color: ganzhiDyeing(monthZhi),
              }}
            >
              {monthZhi}
            </Text>
            表示
            <Text
              style={{
                color: ganzhiDyeing(monthZhi),
              }}
            >
              {zhi_season_dict[monthZhi]}季
            </Text>
          </Text>
          {renderMonthZhiImpact()}
        </View>
      </View>

      {/* <View className="horoscope__row">
        <View className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("格局用神");
          }}
        >
          格局用神
        </View>
        <View className="horoscope__tr">
          
        </View>
      </View> */}

      <View className="horoscope__row">
        <View
          className="horoscope__th horoscope__line"
          onClick={() => {
            onHelpShow("调候视角");
          }}
        >
          调候视角
        </View>
        <View className="horoscope__tr horoscope__trWrap">
          {renderTemperatureAndHumidity()}
        </View>
      </View>
    </>
  );
}

export default memo(BasicView);
