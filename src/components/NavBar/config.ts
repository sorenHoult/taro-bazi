import Taro from "@tarojs/taro";

export function getWeiXinNavBarInfo() {
  if (process.env.TARO_ENV !== "weapp") {
    return {};
  }
  // 系统信息
  const systemInfo = Taro.getSystemInfoSync();
  // 是否ios
  const ios = systemInfo.system.toLowerCase().includes("ios");
  // 胶囊按钮位置信息
  const menuButtonInfo = Taro.getMenuButtonBoundingClientRect
    ? Taro.getMenuButtonBoundingClientRect()
    : getSimulatedMenuButtonInfo({
        ...systemInfo,
        ios,
      });
  // 状态栏高度
  const statusBarHeight = systemInfo.statusBarHeight ?? 0;
  // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度
  const navBarHeight =
    (menuButtonInfo.top - (systemInfo.statusBarHeight || 0)) * 2 +
    menuButtonInfo.height;
  // 胶囊高度
  const menuHeight = menuButtonInfo.height;
  // 胶囊距右方间距
  const menuRight = systemInfo.screenWidth - menuButtonInfo.right;
  // 胶囊距底部间距
  const menuBottom = menuButtonInfo.top - (systemInfo.statusBarHeight || 0);
  // 底部安全高度
  const bottomSafeHeight =
    systemInfo.screenHeight - (systemInfo.safeArea?.bottom ?? 0);
  return {
    ios,
    statusBarHeight,
    navBarHeight,
    bottomSafeHeight,
    menuHeight,
    menuRight,
    menuBottom,
  };
}

function getSimulatedMenuButtonInfo(systemInfo) {
  let gap = 4; //胶囊按钮上下间距 使导航内容居中
  let width = 88; //胶囊的宽度
  if (systemInfo.platform === "android") {
    gap = 8;
    width = 96;
  } else if (systemInfo.platform === "devtools") {
    if (systemInfo.ios) {
      gap = 5.5;
      width = 96;
    } else {
      gap = 7.5;
      width = 96;
    }
  }
  return {
    bottom: systemInfo.statusBarHeight + gap + 32,
    height: 32,
    left: systemInfo.windowWidth - width - 10,
    right: systemInfo.windowWidth - 10,
    top: systemInfo.statusBarHeight + gap,
    width,
  };
}
