import {
  getCurrentInstance,
  getCurrentPages,
  switchTab,
  navigateTo,
  reLaunch,
  redirectTo,
  navigateBack,
} from "@tarojs/taro";
import logoImage from "@/assets/images/logo.png";

/**
 * 四舍五入
 */
export function toRounding(num: number, _precision: number = 2) {
  const multiple = Math.pow(10, _precision);
  return Math.round(num * multiple) / multiple;
}

/**
 * 计算数组某个key的总数
 */
export function getArraySum(data: any[], key: string): number {
  if (!data?.length) return 0;
  const sum = data.reduce((acc: any, cur: any) => {
    const value = parseFloat(cur[key]) || 0;
    return acc + value;
  }, 0);
  return toRounding(sum);
}

/**
 * 返回数组中(某个key)最大的值
 */
export function getArrayMaxNum(data: any[], key: string) {
  return data.reduce((acc, cur) => {
    if (!acc) {
      return cur;
    } else {
      if (acc[key] < cur[key]) {
        return cur;
      } else {
        return acc;
      }
    }
  }, null);
}

/**
 * 标记小数，然后通过css控制小数的样式
 */
export function markDecimal(
  value: number | string,
  separator?: boolean
): any[] {
  const [price, decimal] = String(value).split(".");
  const newPrice = separator ? price.replace(/\B(?=(\d{3})+\b)/g, ",") : price;
  return [newPrice, `.${decimal || "00"}`];
}

/**
 * 对象转化成key=value&key=value...的形式
 */
export function getRouteStringify(obj: any): string {
  let str = "";
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      str += `${key}=${obj[key]}&`;
    }
  }
  return str.slice(0, -1);
}

/**
 * 获取页面路由参数
 */
export function getRouteParams() {
  const params: any = getCurrentInstance().router?.params || {};
  if (/\%/.test(JSON.stringify(params))) {
    Object.keys(params).map((key) => {
      if (/\%/.test(params[key])) {
        params[key] = decodeURIComponent(params[key]);
      }
    });
  }
  return params;
}

/**
 * 获取当前页面路径
 */
export function getCurrentRoute() {
  const pages = getCurrentPages(); // 获取当前页面栈
  const currentPage = pages[pages.length - 1]; // 获取当前页面
  const currentUrl = `/${currentPage.route}`; // 获取当前页面路径
  return currentUrl;
}

/**
 * 获取分包名
 */
function getSubpackName(page: string) {
  let subpackName = "/";
  if (/^chart/.test(page)) {
    subpackName = "/chart/";
  } else if (/^sub/.test(page)) {
    subpackName = "/sub/";
  }
  return subpackName;
}

/**
 * 页面路由封装
 */
export function pageTo(page: string) {
  const subpackName = getSubpackName(page);
  if (!subpackName) return;
  return navigateTo({
    url: `/pages${subpackName}${page}/index`,
  });
}

export function pageRedirect(page: string) {
  const subpackName = getSubpackName(page);
  if (!subpackName) return;
  return redirectTo({
    url: `/pages${subpackName}${page}/index`,
  });
}

export function pageReLaunch(page: string) {
  const subpackName = getSubpackName(page);
  if (!subpackName) return;
  return reLaunch({
    url: `/pages${subpackName}${page}/index`,
  });
}

export function pageBack(page?: string) {
  if (page) {
    const pageList = [...getCurrentPages()].reverse();
    const pageIndex =
      pageList.findIndex(
        ({ route }: any) => route.indexOf(`/${page}/index`) > 0
      ) || 1;
    return navigateBack({
      delta: pageIndex,
    });
  }
  return navigateBack().catch(() => {
    switchTab({ url: "/pages/index/index" });
  });
}

/**
 * 数组下标取值优化版
 */
export function getArrayItem(arr: any[], index: number) {
  if (index < 0) return getArrayItem(arr, arr.length + index);
  if (index > arr.length - 1) return getArrayItem(arr, index - arr.length);
  else return arr[index];
}

/**
 * 将时间字符串分割成数组
 */
export function getSplitTime(str: string) {
  const arr = str.split(/[-\s:]/);
  return arr;
}

/**
 * 分享功能
 */
export function getShareInfo() {
  return {
    title: `天干地支查询工具`,
    path: `/pages/index/index`,
    imageUrl: logoImage,
  };
}
