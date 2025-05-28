import { Component } from "react";
import { View, PickerView, PickerViewColumn } from "@tarojs/components";
import {
  getPickerLunarList,
  getDate,
  getArrWithTime,
  formatDate,
  getDayList,
  getMonthList,
} from "./utils";

import "./index.scss";

export default class LunarTimePicker extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      yearList: [], //年
      monthList: [], //月
      dayList: [], //日
      hourList: [], //时
      minuteList: [], //分
      selectIndexList: [1, 1, 1, 1, 1], //PickerViewColumn选择的索引
      init: false, //是否可见
      year: "", //时间值
      month: "",
      day: "",
      hour: "",
      minute: "",
    };
  }

  componentDidMount() {
    this.initData();
  }

  // 初始化数据
  initData = () => {
    const { value } = this.props;
    const selectIndexList: string[] = [];
    const arr = getArrWithTime(value || getDate()); //优先当前选择的值，其次默认值，其次当前值
    const [year, month, day, hour, minute] = arr;
    const { yearList, monthList, dayList, hourList, minuteList }: any =
      getPickerLunarList(year, month);

    //根据arr  数据索引
    selectIndexList[0] = yearList.indexOf(arr[0]);
    selectIndexList[1] = monthList.indexOf(arr[1]);
    selectIndexList[2] = dayList.indexOf(arr[2]);
    selectIndexList[3] = hourList.indexOf(arr[3]);
    selectIndexList[4] = minuteList.indexOf(arr[4]);

    this.setState({
      selectIndexList,
      init: true,
      yearList,
      monthList,
      dayList,
      hourList,
      minuteList,
      year,
      month,
      day,
      hour,
      minute,
    });
  };

  // 切换
  changeHandel = (e) => {
    const selectIndexList = e.detail.value;
    const [yearIndex, monthIndex, dayIndex, hourIndex, minuteIndex] =
      selectIndexList;
    const { yearList, monthList, dayList, hourList, minuteList } = this.state;
    const year: string = yearList[yearIndex];
    const month: string = monthList[monthIndex];
    const day: string = dayList[dayIndex];
    const hour: string = hourList[hourIndex];
    const minute: string = minuteList[minuteIndex];

    // 更新月份列表
    const newMonthList = getMonthList(year);
    // 更新天数列表
    const newDayList = getDayList(year, month);

    this.setState({
      monthList: newMonthList,
      dayList: newDayList,
      year,
      month,
      day,
      hour,
      minute,
      selectIndexList,
    });
  };

  render() {
    const {
      init,
      yearList,
      monthList,
      dayList,
      hourList,
      minuteList,
      selectIndexList,
    } = this.state;
    const { onConfirm, onCancel } = this.props;
    if (!init) return null;
    return (
      <View className="datetime-picker-wrap">
        <View className="wrapper">
          {/*日期组件 */}
          <View className="button-model">
            <View className="btn-txt" onClick={onCancel}>
              取消
            </View>
            <View
              className="btn-txt"
              onClick={() => {
                const { year, month, day, hour, minute } = this.state;
                const newValue = formatDate(year, month, day, hour, minute);
                onConfirm && onConfirm(newValue);
              }}
            >
              确定
            </View>
          </View>
          <View className="cont_model">
            <PickerView
              immediateChange
              className="pick-view"
              value={selectIndexList}
              onChange={this.changeHandel}
            >
              {/*年*/}
              <PickerViewColumn className="picker-view-column">
                {yearList.length &&
                  yearList.map((item, index) => (
                    <View key={index} className="pick-view-column-item">
                      {item}年
                    </View>
                  ))}
              </PickerViewColumn>
              {/*月*/}
              <PickerViewColumn className="picker-view-column">
                {monthList.length &&
                  monthList.map((item, index) => (
                    <View key={index} className="pick-view-column-item">
                      {item}月
                    </View>
                  ))}
              </PickerViewColumn>
              {/*日*/}
              <PickerViewColumn className="picker-view-column">
                {dayList.length &&
                  dayList.map((item, index) => (
                    <View key={index} className="pick-view-column-item">
                      {item}
                    </View>
                  ))}
              </PickerViewColumn>
              {/*时*/}
              <PickerViewColumn className="picker-view-column">
                {hourList.length &&
                  hourList.map((item, index) => (
                    <View key={index} className="pick-view-column-item">
                      {item === "未知" ? item : `${item}时`}
                    </View>
                  ))}
              </PickerViewColumn>
              {/*分*/}
              <PickerViewColumn className="picker-view-column">
                {minuteList.length &&
                  minuteList.map((item, index) => (
                    <View key={index} className="pick-view-column-item">
                      {item === "未知" ? item : `${item}分`}
                    </View>
                  ))}
              </PickerViewColumn>
            </PickerView>
          </View>
        </View>
      </View>
    );
  }
}
