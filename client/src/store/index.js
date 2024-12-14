import { configureStore } from "@reduxjs/toolkit";

import menuReducer from "./slicesRedux/menu";
import userReducer from "./slicesRedux/user";
import viewReducer from "./slicesRedux/view";

const store = configureStore({
  reducer: {
    menu: menuReducer,
    user: userReducer,
    view: viewReducer,
  },
});

export default store;
