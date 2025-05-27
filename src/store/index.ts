import { createStore, combineReducers } from "redux";
import global from "./global";

const rootReducer = combineReducers({
  global,
});

const store = createStore(rootReducer);

export default store;
