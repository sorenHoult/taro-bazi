import { Component } from "react";
import { View, PickerView, PickerViewColumn } from "@tarojs/components";
import {
  getPickerGregorianList,
  getDate,
  getArrWithTime,
  formatDate,
  getDayList,
} from "./utils";

import "./index.scss";

export default class GregorianTimePicker extends Component<any, any> {
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
    };
  }

  componentDidMount() {
    this.initData();
  }

  // 初始化数据
  initData = () => {
    const { value, range } = this.props;
    const selectIndexList: number[] = [];
    const arr = getArrWithTime(value || getDate(range)); //优先当前选择的值，其次默认值，其次当前值
    const [year, month, day, hour, minute] = arr;
    const { yearList, monthList, dayList, hourList, minuteList }: any =
      getPickerGregorianList(year, month, range);

    //根据arr  数据索引
    selectIndexList[0] = yearList.indexOf(year);
    selectIndexList[1] = monthList.indexOf(month);
    selectIndexList[2] = dayList.indexOf(day);
    selectIndexList[3] = hourList.indexOf(hour);
    selectIndexList[4] = minuteList.indexOf(minute);

    this.setState({
      selectIndexList,
      init: true,
      yearList,
      monthList,
      dayList,
      hourList,
      minuteList,
    });
  };

  // 切换
  changeHandel = (e) => {
    const selectIndexList = e.detail.value;
    let [yearIndex, monthIndex, dayIndex, hourIndex, minuteIndex] =
      selectIndexList;
    const { yearList, monthList } = this.state;
    const year = yearList[yearIndex];
    const month = monthList[monthIndex];

    // 更新天数列表
    const newDayList = getDayList(year, month);
    if (dayIndex + 1 > newDayList.length) {
      dayIndex = newDayList.length - 1;
    }

    this.setState({
      dayList: newDayList,
      selectIndexList: [
        yearIndex,
        monthIndex,
        dayIndex,
        hourIndex,
        minuteIndex,
      ],
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
                const [
                  yearIndex,
                  monthIndex,
                  dayIndex,
                  hourIndex,
                  minuteIndex,
                ] = selectIndexList;
                const newValue = formatDate(
                  yearList[yearIndex],
                  monthList[monthIndex],
                  dayList[dayIndex],
                  hourList[hourIndex],
                  minuteList[minuteIndex]
                );
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
              indicatorStyle="height: 50px;"
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
                      {item}日
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
