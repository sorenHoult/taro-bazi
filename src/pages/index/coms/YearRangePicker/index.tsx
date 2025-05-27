import { Component } from "react";
import { View, PickerView, PickerViewColumn } from "@tarojs/components";

import "./index.scss";

const yearRangeList = [
  // "-2900~-2700",
  // "-2700~-2500",
  // "-2500~-2300",
  // "-2300~-2100",
  // "-2100~-1900",
  // "-1900~-1700",
  // "-1700~-1500",
  // "-1500~-1300",
  // "-1300~-1100",
  // "-1100~-900",
  // "-900~-700",
  // "-700~-500",
  // "-500~-300",
  // "-300~-100",
  // "-100~100",
  "100~300",
  "300~500",
  "500~700",
  "700~900",
  "900~1100",
  "1100~1300",
  "1300~1500",
  "1500~1700",
  "1700~1900",
  "1900~2100",
  "2100~2300",
  "2300~2500",
  "2500~2700",
  "2700~2900",
  "2900~3100",
];

export default class YearRangePicker extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      selectIndexList: [1], //PickerViewColumn选择的索引
      init: false, //是否可见
      yearRange: "", //时间值
    };
  }

  componentDidMount() {
    this.initData();
  }

  // 初始化数据
  initData = () => {
    const { value } = this.props;
    const selectIndexList: number[] = [];
    //根据arr  数据索引
    selectIndexList[0] = yearRangeList.indexOf(value);
    this.setState({
      selectIndexList,
      yearRange: value,
      init: true,
    });
  };

  // 切换
  changeHandel = (e) => {
    const selectIndexList = e.detail.value;
    const [yearRangeIndex] = selectIndexList;
    const yearRange: string = yearRangeList[yearRangeIndex];

    this.setState({
      yearRange,
      selectIndexList,
    });
  };

  render() {
    const { init, selectIndexList } = this.state;
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
                const { yearRange } = this.state;
                onConfirm && onConfirm(yearRange);
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
              {/*年区间*/}
              <PickerViewColumn className="picker-view-column">
                {yearRangeList.length &&
                  yearRangeList.map((item, index) => (
                    <View key={index} className="pick-view-column-item">
                      {item}年
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
