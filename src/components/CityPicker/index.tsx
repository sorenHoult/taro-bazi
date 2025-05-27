import { Component } from "react";
import { View, PickerView, PickerViewColumn } from "@tarojs/components";
import cityData from "@/assets/dict/cityData";

import "./index.scss";

export default class CityPicker extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      selectIndexList: [0, 0, 0], //PickerViewColumn选择的索引
      provinceList: [],
      cityList: [],
      areaList: [],
      init: false, //是否可见
    };
  }

  componentDidMount() {
    this.initData();
  }

  // 初始化数据
  initData = () => {
    const { value } = this.props;
    const {
      provinceId = "100000",
      cityId = "100101",
      areaId = "100101",
    } = value || {};
    const provinceList = cityData;
    const provinceIndex = provinceList.findIndex(
      (item) => item.id === provinceId
    );

    const cityList = provinceList[provinceIndex].children || [];
    const cityIndex = cityList.findIndex((item) => item.id === cityId);

    const areaList = cityList?.[cityIndex].children || [];
    const areaIndex = areaList.findIndex((item) => item.id === areaId);

    this.setState({
      selectIndexList: [provinceIndex, cityIndex, areaIndex],
      provinceList,
      cityList,
      areaList,
      init: true,
    });
  };

  // 切换
  changeHandel = (e) => {
    const { provinceList } = this.state;
    const selectIndexList = e.detail.value;

    let [provinceIndex, cityIndex, areaIndex] = selectIndexList;

    const cityList = provinceList[provinceIndex].children || [];
    if (cityIndex + 1 > cityList.length) cityIndex = cityList.length - 1;
    const areaList = cityList?.[cityIndex]?.children || [];
    if (areaIndex + 1 > areaList.length) areaIndex = areaList.length - 1;

    this.setState({
      selectIndexList: [provinceIndex, cityIndex, areaIndex],
      cityList,
      areaList,
    });
  };

  render() {
    const { init, selectIndexList, provinceList, cityList, areaList } =
      this.state;
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
                const province = provinceList[selectIndexList[0]];
                const city = province.children?.[selectIndexList[1]];
                const area = city?.children?.[selectIndexList[2]];
                const resultObj = {
                  provinceId: province.id,
                  provinceName: province.fullname,
                  cityId: city.id,
                  cityName: city.fullname,
                  areaId: area.id,
                  areaName: area.fullname,
                  location: area.location,
                };
                onConfirm && onConfirm(resultObj);
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
              {/*省区间*/}
              <PickerViewColumn className="picker-view-column">
                {provinceList.length &&
                  provinceList.map((item, index) => (
                    <View key={item.id} className="pick-view-column-item">
                      {item.fullname}
                    </View>
                  ))}
              </PickerViewColumn>
              {/*市区间*/}
              <PickerViewColumn className="picker-view-column">
                {cityList.length &&
                  cityList.map((item, index) => (
                    <View key={item.id} className="pick-view-column-item">
                      {item.fullname}
                    </View>
                  ))}
              </PickerViewColumn>
              {/*县区间*/}
              <PickerViewColumn className="picker-view-column">
                {areaList.length &&
                  areaList.map((item, index) => (
                    <View key={item.id} className="pick-view-column-item">
                      {item.fullname}
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
