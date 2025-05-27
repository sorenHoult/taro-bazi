export default defineAppConfig({
  pages: ["pages/index/index", "pages/case/index", "pages/record/index"],
  window: {
    navigationStyle: "custom",
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: true,
    list: [
      {
        text: "排盘",
        pagePath: "pages/index/index",
        iconPath: "assets/tabs/contrast-outline.png",
        selectedIconPath: "assets/tabs/contrast.png",
      },
      {
        text: "案例",
        pagePath: "pages/case/index",
        iconPath: "assets/tabs/reader-outline.png",
        selectedIconPath: "assets/tabs/reader.png",
      },
      {
        text: "记录",
        pagePath: "pages/record/index",
        iconPath: "assets/tabs/reader-outline.png",
        selectedIconPath: "assets/tabs/reader.png",
      },
    ],
  },
  subpackages: [
    {
      root: "pages/sub/",
      pages: ["subHoroscope/index"],
    },
  ],
});
