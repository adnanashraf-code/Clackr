import { configureStore } from "@reduxjs/toolkit";
import testReducer from "./testSlice";
import settingsReducer from "./settingsSlice";
import resultsReducer from "./resultsSlice";

export const store = configureStore({
  reducer: {
    test: testReducer,
    settings: settingsReducer,
    results: resultsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
