import { createRef } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { View, Text, Image, Button } from "@tarojs/components";
import { BaseComponent, NavBar } from "@/components";
import { getCurrentInstance, showToast, setClipboardData } from "@tarojs/taro";
import dayjs from "dayjs";
import { getShareInfo, getSplitTime } from "@/utils";
import { getSolarTermInfo } from "@/utils/solarTerm";
import {
  calFleetingYearList,
  calHoroscope,
  calSolarTerm,
  calTenGod,
  calTwelveGrow,
  getAdjacentSolarTermTime,
  getNextMonth,
  getPreviousMonth,
} from "@/utils/horoscope";
import logoImage from "@/assets/images/logo.png";
import eyeIcon from "@/assets/icons/eye.svg";
import eyeOffIcon from "@/assets/icons/eye-off.svg";
import {
  branchesConjunction2_dict,
  branchesConjunction_dict,
  branchesDestruction_dict,
  branchesHarm_dict,
  branchesOpposition_dict,
  branchesPunishment_dict,
  branchesTriplet_dict,
  heavenlyStemsConjunction_dict,
  dayGan_dict,
  gan_dict,
  zhi_dict,
  hideGan_dict,
  tenGod_dict,
  situation_dict,
  sameAndDifferent_dict,
  time_dict,
  twelveGrow_dict,
  regulateTheClimate_dict,
  lucky_dict,
  wholeUse_dict,
} from "@/assets/dict/helpData";
import HelpModal from "@/pages/index/coms/HelpModal";

import BasicView from "./coms/BasicView";
import AnalyzeView from "./coms/AnalyzeView";
import "./index.scss";
import { zhi_hide_gan_dict } from "@/assets/dict/zodiacData";

const tabs = [
  {
    label: "原命局",
    key: "basic",
  },
  {
    label: "大运流年",
    key: "analyze",
  },
];

class Index extends BaseComponent {
  private modalRef: any;
  private basicRef: any;
  private analyzeRef: any;
  constructor(props) {
    super(props);
    const { eyeOn, gender, time, city } =
      getCurrentInstance().preloadData?.subHoroscope || {};
    this.state = {
      init: false,
      activeTab: "basic",
      eyeOn: eyeOn || 1,
      gender,
      time,
      city,
      solarTerm: "", // 当前节气
      solarTermInfo: {}, // 当月节气
      adjacentSolarTermTime: {}, // 相邻节气时间
      horoscopeInfo: {}, // 八字
      tenGodInfo: {}, // 十神
      twelveGrowInfo: {}, // 十二长生
    };
    this.modalRef = createRef();
    this.basicRef = createRef();
    this.analyzeRef = createRef();
  }

  componentDidMount() {
    this.initData();
  }

  onShareAppMessage() {
    const { eyeOn, gender, time } = this.state;
    return {
      title: "天干地支查询结果",
      path: `/pages/index/index?eyeOn=${
        eyeOn == 1 ? 1 : 2
      }&gender=${gender}&time=${time}`,
      imageUrl: logoImage,
    };
  }

  onShareTimeline() {
    return getShareInfo();
  }

  initData = () => {
    const { time } = this.state;
    if (!time) return;
    // console.log(time);
    const arr = getSplitTime(time);

    // 计算当月节气
    const solarTermInfo = getSolarTermInfo(arr[0], arr[1]);

    // 计算上个月节气
    const previousMonth = getPreviousMonth(arr[0], arr[1]);
    const solarTermPreviousInfo = getSolarTermInfo(
      previousMonth.year,
      previousMonth.month
    );

    // 计算下个月节气
    const nextMonth = getNextMonth(arr[0], arr[1]);
    const solarTermNextInfo = getSolarTermInfo(nextMonth.year, nextMonth.month);

    const { solarTerm, isCurrentMonthSolarTerm } = calSolarTerm(
      time,
      solarTermInfo
    );

    // 计算相邻节的时间
    const adjacentSolarTermTime = getAdjacentSolarTermTime(
      Object.assign(solarTermPreviousInfo, solarTermInfo, solarTermNextInfo),
      solarTerm
    );

    // console.log("adjacentSolarTermTime", adjacentSolarTermTime);

    const horoscopeInfo = calHoroscope(
      arr[0],
      arr[1],
      arr[2],
      arr[3],
      solarTerm,
      isCurrentMonthSolarTerm
    );

    const tenGodInfo = calTenGod(horoscopeInfo.dayGan);
    const twelveGrowInfo = calTwelveGrow(horoscopeInfo.dayGan);
    this.setState({
      init: true,
      solarTerm,
      solarTermInfo,
      adjacentSolarTermTime,
      horoscopeInfo,
      tenGodInfo,
      twelveGrowInfo,
    });
  };

  onStorageResult = () => {
    const { dispatch } = this.props;
    const { eyeOn, gender, time, horoscopeInfo } = this.state;
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
    if (eyeOn == 2) {
      showToast({
        title: "保存失败，分享人设置日期不可见",
        icon: "none",
      });
      return;
    }
    dispatch({
      type: "ADD_HISTORY_HOROSCOPE",
      payload: {
        storageKey: "historyHoroscope",
        key: +new Date(),
        gender,
        time,
        ganzhi: `${yearGan}${monthGan}${dayGan}${
          hourGan ?? "?"
        }${yearZhi}${monthZhi}${dayZhi}${hourZhi ?? "?"}`,
      },
    });
    showToast({
      title: "保存成功",
      icon: "none",
    });
  };

  onExportQuestion = () => {
    const { activeTab, time, gender, city, horoscopeInfo, tenGodInfo } =
      this.state;
    // 出生信息
    const birthMap = new Map();
    birthMap.set("公历", time);
    birthMap.set("性别", gender === "female" ? "女" : "男");
    if (city?.provinceName && city.provinceName !== "未知") {
      birthMap.set(
        "出生地",
        `${city.provinceName}${city.cityName}${city.areaName}`
      );
    }
    // 八字信息
    const horoscopeMap = new Map();
    horoscopeMap.set(
      "年柱",
      `${horoscopeInfo.yearGan}${horoscopeInfo.yearZhi}`
    );
    horoscopeMap.set(
      "月柱",
      `${horoscopeInfo.monthGan}${horoscopeInfo.monthZhi}`
    );
    horoscopeMap.set("日柱", `${horoscopeInfo.dayGan}${horoscopeInfo.dayZhi}`);
    horoscopeMap.set(
      "时柱",
      `${horoscopeInfo.hourGan}${horoscopeInfo.hourZhi}`
    );

    function setZhiWithHiddenGan(
      map: Map<string, string>,
      key: string,
      zhiValue: string,
      useTenGodInfo: boolean
    ) {
      const hiddenGans = zhi_hide_gan_dict[zhiValue] || [];
      const value = useTenGodInfo
        ? hiddenGans.map((item) => tenGodInfo[item]).join(" ")
        : hiddenGans.join(" ");
      map.set(key, value);
    }
    // 藏干信息
    const hiddenGanMap = new Map();
    // 设置地支
    setZhiWithHiddenGan(hiddenGanMap, "年支", horoscopeInfo.yearZhi, false);
    setZhiWithHiddenGan(hiddenGanMap, "月支", horoscopeInfo.monthZhi, false);
    setZhiWithHiddenGan(hiddenGanMap, "日支", horoscopeInfo.dayZhi, false);
    setZhiWithHiddenGan(hiddenGanMap, "时支", horoscopeInfo.hourZhi, false);

    // 十神信息
    const tenGodMap = new Map();
    // 设置天干
    tenGodMap.set("年干", tenGodInfo[horoscopeInfo.yearGan]);
    tenGodMap.set("月干", tenGodInfo[horoscopeInfo.monthGan]);
    tenGodMap.set("日干", tenGodInfo[horoscopeInfo.dayGan]);
    tenGodMap.set("时干", tenGodInfo[horoscopeInfo.hourGan]);
    // 设置地支
    setZhiWithHiddenGan(tenGodMap, "年支", horoscopeInfo.yearZhi, true);
    setZhiWithHiddenGan(tenGodMap, "月支", horoscopeInfo.monthZhi, true);
    setZhiWithHiddenGan(tenGodMap, "日支", horoscopeInfo.dayZhi, true);
    setZhiWithHiddenGan(tenGodMap, "时支", horoscopeInfo.hourZhi, true);

    const allData = {
      基本信息: Object.fromEntries(birthMap),
      八字排盘: Object.fromEntries(horoscopeMap),
      藏干信息: Object.fromEntries(hiddenGanMap),
      十神排盘: Object.fromEntries(tenGodMap),
    };
    if (activeTab === "basic") {
    } else if (activeTab === "analyze") {
      const data = this.analyzeRef.current?.getCombined();
      const luckyList: any[] = [];
      let fleetingYearList: any[] = [];
      data.luckyList?.forEach((item, index) => {
        if (index > 0 && item.age <= 100) {
          luckyList.push({
            开始年: item.startYear,
            结束年: item.endYear,
            运: `${item.gan}${item.zhi}`,
            起运年龄: item.age + 1,
          });
          const currentFleetingYearList = calFleetingYearList(
            item.startYear,
            item.endYear
          );
          const currentFleetingYearListFormat = currentFleetingYearList?.map(
            (item) => {
              return { 年份: item.year, 干支: `${item.gan}${item.zhi}` };
            }
          );
          fleetingYearList = [
            ...fleetingYearList,
            ...currentFleetingYearListFormat,
          ];
        }
      });
      allData["大运"] = luckyList;
      allData["流年"] = fleetingYearList;
    }
    const result =
      "你是一名专业的八字命理研究人员，分析这个八字的格局层次/人生运势/婚姻感情/性格特质\n" +
      JSON.stringify(allData, null, 2);
    this.modalRef.current?.setTitle("提示词预览");
    this.modalRef.current?.setList([
      {
        explain: result,
      },
    ]);
    this.modalRef.current?.setShow(true);
    setClipboardData({
      data: result,
      success: () => {
        showToast({
          title: "已复制到剪切板",
          icon: "none",
        });
      },
      fail: () => {
        showToast({
          title: "复制失败",
          icon: "none",
        });
      },
    });
  };

  onHelpShow = (name: string) => {
    let dict: any[] = [];
    switch (name) {
      case "时间":
        dict = time_dict;
        break;
      case "日主":
        dict = dayGan_dict;
        break;
      case "天干":
        dict = gan_dict;
        break;
      case "地支":
        dict = zhi_dict;
        break;
      case "藏干":
        dict = hideGan_dict;
        break;
      case "十神":
        dict = tenGod_dict;
        break;
      case "十二长生":
        dict = twelveGrow_dict;
        break;
      case "月令旺衰":
        dict = sameAndDifferent_dict;
        break;
      case "调候视角":
        dict = regulateTheClimate_dict;
        break;
      case "格局视角":
        dict = situation_dict;
        break;
      case "天干合化":
        dict = heavenlyStemsConjunction_dict;
        break;
      case "地支六合":
        dict = branchesConjunction_dict;
        break;
      case "地支三合会局":
        dict = branchesConjunction2_dict;
        break;
      case "地支三合会方":
        dict = branchesTriplet_dict;
        break;
      case "地支三刑":
        dict = branchesPunishment_dict;
        break;
      case "地支六冲":
        dict = branchesOpposition_dict;
        break;
      case "地支六破":
        dict = branchesDestruction_dict;
        break;
      case "地支六穿":
        dict = branchesHarm_dict;
        break;
      case "大运":
        dict = lucky_dict;
        break;
      case "格局用神":
        dict = wholeUse_dict;
        break;
    }
    this.modalRef.current?.setTitle(name);
    this.modalRef.current?.setList(dict);
    this.modalRef.current?.setShow(true);
  };

  renderTop = () => {
    const { eyeOn, gender, time, solarTerm, solarTermInfo } = this.state;
    const arr = getSplitTime(time);
    return (
      <View className="horoscope__top">
        <View className="horoscope__gregorian">
          公历：
          {eyeOn == 1
            ? `${arr[0]}年${arr[1]}月${arr[2]}日 ${arr[3]}时${arr[4]}分 `
            : "⬛⬛⬛⬛⬛⬛⬛⬛"}
          <Image
            src={eyeOn == 1 ? eyeIcon : eyeOffIcon}
            className="horoscope__eyeIcon"
            onClick={() => {
              if (eyeOn == 2) {
                showToast({
                  title: "分享人设置日期不可见",
                  icon: "none",
                });
                return;
              }
              this.setState({
                eyeOn: eyeOn == 1 ? 0 : 1,
              });
            }}
          ></Image>
          <Text className="horoscope__gender">
            ( {gender === "female" ? "坤造女命" : "乾造男命"} )
          </Text>
        </View>
        <View className="horoscope__solarTerm">出生时的节气 : {solarTerm}</View>
        {Object.keys(solarTermInfo).map((item, index) => {
          return (
            <View key={index} className="horoscope__solarTerm">
              {item} : {dayjs(solarTermInfo[item]).format("MM月DD日 HH时mm分")}
            </View>
          );
        })}
      </View>
    );
  };

  renderTab = () => {
    const { activeTab } = this.state;
    return (
      <View className="horoscope__tabs">
        {tabs.map((item) => {
          const isActive = item.key === activeTab;
          return (
            <View
              key={item.key}
              className={classNames("horoscope__tab", {
                horoscope__activeTab: isActive,
              })}
              onClick={() => {
                if (isActive) return;
                this.setState({
                  activeTab: item.key,
                });
              }}
            >
              {item.label}
            </View>
          );
        })}
      </View>
    );
  };

  render() {
    const {
      init,
      eyeOn,
      activeTab,
      time,
      gender,
      horoscopeInfo,
      tenGodInfo,
      twelveGrowInfo,
      adjacentSolarTermTime,
    } = this.state;
    if (!init) return null;
    return (
      <View className="page__bg">
        <NavBar title="查询结果" back />
        {this.renderTab()}
        {this.renderTop()}
        {activeTab === "basic" && (
          <BasicView
            cRef={this.basicRef}
            horoscopeInfo={horoscopeInfo}
            tenGodInfo={tenGodInfo}
            twelveGrowInfo={twelveGrowInfo}
            onHelpShow={this.onHelpShow}
          />
        )}
        {activeTab === "analyze" && (
          <AnalyzeView
            cRef={this.analyzeRef}
            eyeOn={eyeOn}
            time={time}
            gender={gender}
            horoscopeInfo={horoscopeInfo}
            tenGodInfo={tenGodInfo}
            twelveGrowInfo={twelveGrowInfo}
            adjacentSolarTermTime={adjacentSolarTermTime}
            onHelpShow={this.onHelpShow}
          />
        )}
        <View className="horoscope__btnGroup">
          <Button className="horoscope__btn" onClick={this.onExportQuestion}>
            复制提示词
          </Button>
          <Button className="horoscope__btn" onClick={this.onStorageResult}>
            保存查询
          </Button>
        </View>
        <HelpModal cRef={this.modalRef} />
      </View>
    );
  }
}

export default connect()(Index);
