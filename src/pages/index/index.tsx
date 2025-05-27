import { createRef } from "react";
import classNames from "classnames";
import { preload, showToast } from "@tarojs/taro";
import { Button, View, Image } from "@tarojs/components";
import dayjs from "dayjs";
import {
  BaseComponent,
  NavBar,
  Form,
  FormItem,
  RadioGroup,
  Input,
} from "@/components";
import { FormInstance, createForm } from "@/components/Form";
import { getRouteParams, getShareInfo, getSplitTime, pageTo } from "@/utils";
import { getRealSolarTime } from "@/utils/solarTerm";
import { guessGregorian } from "@/utils/horoscope";

import TimePickerDrawer from "./coms/TimePickerDrawer";
import "./index.scss";
import HelpModal from "./coms/HelpModal";
import ResultModal from "./coms/ResultModal";

const genderOptions = [
  {
    label: "男",
    key: "male",
  },
  {
    label: "女",
    key: "female",
  },
];

const calendarOptions = [
  {
    label: "公历查询",
    key: "gregorian",
  },
  {
    label: "干支反查",
    key: "pillars",
  },
];

class Index extends BaseComponent {
  private form: FormInstance;
  private drawerRef: any;
  private modalRef: any;
  private modal2Ref: any;
  constructor(props) {
    super(props);
    this.state = {
      calendar: calendarOptions[0].key,
      realTime: "",
      coordinate: null,
    };
    this.form = createForm();
    this.drawerRef = createRef();
    this.modalRef = createRef();
    this.modal2Ref = createRef();
  }

  componentDidMount() {
    this.initData();
  }

  initData() {
    const { time, city } = this.form?.getFieldsValue();
    this.getRealTime(time, city);
    const params = getRouteParams();
    if (params.time) {
      preload("subHoroscope", params);
      pageTo("subHoroscope");
    }
  }

  onShareAppMessage() {
    return getShareInfo();
  }

  onShareTimeline() {
    return getShareInfo();
  }

  getRealTime = (time, city) => {
    // 无时间，无法计算
    if (!time) {
      this.setState({
        realTime: "时辰未知",
        coordinate: null,
      });
      return;
    }
    const arr = getSplitTime(time);
    const { lng } = city?.location || {};
    // 时辰未知
    if (arr[3] === "未知" || arr[4] === "未知") {
      this.setState({
        realTime: "时辰未知",
        coordinate: null,
      });
      return;
    }
    // 无经纬度，返回原时间
    if (!lng) {
      this.setState({
        realTime: time,
        coordinate: null,
      });
      return;
    }
    const realSolarTime = getRealSolarTime(
      arr[0],
      arr[1],
      arr[2],
      `${arr[3]}:${arr[4]}:00`,
      lng
    );
    let realTime = `${arr[0]}-${arr[1]}-${arr[2]} ${realSolarTime}`;
    const diffTime = dayjs(time).diff(dayjs(realTime), "h");
    if (diffTime < -12) {
      realTime = dayjs(realTime).subtract(1, "d").format("YYYY-MM-DD HH:mm");
    } else {
      realTime = dayjs(realTime).format("YYYY-MM-DD HH:mm");
    }
    this.setState({
      realTime,
      coordinate: city?.location,
    });
  };

  renderTop = () => {
    const { calendar } = this.state;
    return (
      <View className="index__tabs">
        {calendarOptions.map((item) => {
          const isActive = calendar === item.key;
          return (
            <View
              key={item.key}
              className={classNames("index__tabItem", {
                index__tabActiveItem: isActive,
              })}
              onClick={() => {
                if (isActive) return;
                this.setState({
                  calendar: item.key,
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

  renderBottom = () => {
    const { calendar, realTime } = this.state;
    return (
      <View className="index__btnGroup">
        {calendar === "gregorian" && (
          <Button
            className="index__btn"
            onClick={() => {
              const { gender, yearRange, time, city } =
                this.form?.getFieldsValue();
              if (!time) {
                this.drawerRef.current?.setCalendarType(calendar);
                this.drawerRef.current?.setValue("");
                this.drawerRef.current?.setRange(yearRange.split("~"));
                this.drawerRef.current?.setShow(true);
                return;
              }
              if (realTime?.slice(0, 3) === "99-") {
                showToast({
                  title: "不支持该年份",
                  icon: "none",
                });
                return;
              }
              preload("subHoroscope", {
                gender,
                time: realTime === "时辰未知" ? time : realTime,
                city,
              });
              pageTo("subHoroscope");
            }}
          >
            开始查询
          </Button>
        )}
        {calendar === "pillars" && (
          <Button
            className="index__btn"
            onClick={() => {
              const { gender, yearRange, ganzhi } = this.form?.getFieldsValue();
              const timeArray = guessGregorian(
                yearRange,
                ganzhi || "癸亥 癸亥 癸亥 癸亥"
              );
              if (!timeArray?.length) {
                showToast({
                  title: "查无结果",
                  icon: "none",
                });
                return;
              }
              this.modal2Ref.current?.setList(
                timeArray.map((item) => {
                  return {
                    time: item,
                    onClick: () => {
                      preload("subHoroscope", {
                        gender,
                        time: item,
                      });
                      pageTo("subHoroscope");
                    },
                  };
                })
              );
              this.modal2Ref.current?.setShow(true);
            }}
          >
            开始查询
          </Button>
        )}
      </View>
    );
  };

  render() {
    const { calendar, realTime, coordinate } = this.state;
    return (
      <View className="page__bg">
        <NavBar />
        {this.renderTop()}
        <View className="index__card">
          <Form
            form={this.form}
            initialValues={{
              gender: "male",
              yearRange: "1900~2100",
              time: "2000-01-01 00:00",
              city: {
                areaId: "100101",
                areaName: "-",
                cityId: "100101",
                cityName: "-",
                provinceId: "100000",
                provinceName: "未知",
              },
            }}
          >
            <FormItem name="gender">
              <RadioGroup
                options={genderOptions}
                className="index__genderItem"
                allowedChange={() => true}
              />
            </FormItem>
            <FormItem name="yearRange">
              <Input
                disabled
                placeholder="请选择年份范围"
                className="index__pickerItem"
                onClick={() => {
                  const { yearRange } = this.form?.getFieldsValue();
                  this.drawerRef.current?.setCalendarType("year");
                  this.drawerRef.current?.setValue(yearRange);
                  this.drawerRef.current?.setShow(true);
                }}
              />
            </FormItem>
            {calendar === "gregorian" && (
              <>
                <FormItem name="time">
                  <Input
                    disabled
                    placeholder="请选择时间"
                    className="index__pickerItem"
                    onClick={() => {
                      const { yearRange, time } = this.form?.getFieldsValue();
                      this.drawerRef.current?.setCalendarType(calendar);
                      this.drawerRef.current?.setValue(time);
                      this.drawerRef.current?.setRange(yearRange.split("~"));
                      this.drawerRef.current?.setShow(true);
                    }}
                  />
                </FormItem>
                <FormItem name="city">
                  <Input
                    disabled
                    placeholder="请选择地区"
                    className="index__pickerItem"
                    formatValue={(value: any) => {
                      if (!value) return value;
                      return `${value.provinceName} ${value.cityName} ${value.areaName}`;
                    }}
                    onClick={() => {
                      const { city } = this.form?.getFieldsValue();
                      this.drawerRef.current?.setCalendarType("city");
                      this.drawerRef.current?.setValue(city);
                      this.drawerRef.current?.setShow(true);
                    }}
                  />
                </FormItem>
                <View className="index__realTimeItem">
                  <View className="index__realTimeLabel">
                    真太阳时：
                    {/* <Image
                      className="index__helpIcon"
                      src={helpIcon}
                      onClick={() => {
                        this.modalRef.current?.setList(realTime_dict);
                        this.modalRef.current?.setShow(true);
                      }}
                    /> */}
                  </View>
                  {realTime}
                </View>
                {coordinate?.lng && (
                  <View className="index__realTimeItem">
                    <View className="index__realTimeLabel">经纬度：</View>
                    北纬{coordinate.lat} 东经{coordinate.lng}
                  </View>
                )}
              </>
            )}
            {calendar === "pillars" && (
              <>
                <FormItem name="ganzhi">
                  <Input
                    maxLength={20}
                    placeholder="例如：癸亥 癸亥 癸亥 癸亥"
                    className="index__pickerItem"
                  />
                </FormItem>
              </>
            )}
          </Form>
          {this.renderBottom()}
          <View className="index__tip">节气算法来源于《寿星天文历》</View>
          <View className="index__tip">
            格局以《子平真诠》《滴天髓》为理论基础
          </View>
        </View>
        <TimePickerDrawer
          cRef={this.drawerRef}
          onChange={(value: string, calendarType: string) => {
            // console.log("drawer传值:", value);
            const { time, city } = this.form?.getFieldsValue();
            if (calendarType === "year") {
              this.form?.setFieldsValue({
                yearRange: value,
                time: "",
              });
              this.getRealTime("", city);
            } else if (calendarType === "city") {
              this.form?.setFieldsValue({
                city: value,
              });
              this.getRealTime(time, value);
            } else if (calendarType === "gregorian") {
              this.form?.setFieldsValue({
                time: value,
              });
              this.getRealTime(value, city);
            }
          }}
        />
        <HelpModal cRef={this.modalRef} />
        <ResultModal cRef={this.modal2Ref} />
      </View>
    );
  }
}

export default Index;
