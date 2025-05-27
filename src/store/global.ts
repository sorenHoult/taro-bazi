import {
  getStorageSync,
  setStorageSync,
  removeStorageSync,
} from "@tarojs/taro";

const historyHoroscopeStorage = getStorageSync("historyHoroscope");

const initialState = {
  historyHoroscope: historyHoroscopeStorage
    ? JSON.parse(historyHoroscopeStorage)
    : [],
};

export default function global(state = initialState, action) {
  const { type, payload } = action;
  const { storageKey, ...payloadData } = payload || {};
  switch (type) {
    // 添加历史记录
    case "ADD_HISTORY_HOROSCOPE":
      const newHistoryHoroscope = [
        payloadData,
        ...state[storageKey].slice(0, 99),
      ];
      setStorageSync(storageKey, JSON.stringify(newHistoryHoroscope));
      return { ...state, [storageKey]: newHistoryHoroscope };
    // 删除历史记录
    case "REMOVE_HISTORY_HOROSCOPE":
      const newHistoryHoroscope2 = state[payload.storageKey].filter(
        (item) => item.key !== payload.key
      );
      setStorageSync(storageKey, JSON.stringify(newHistoryHoroscope2));
      return { ...state, [storageKey]: newHistoryHoroscope2 };
    default:
      return state;
  }
}
