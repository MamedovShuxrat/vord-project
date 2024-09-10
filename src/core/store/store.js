import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";
import connectionsReducer from "./connectionsSlice";
import foldersReducer from "./foldersSlice";
import chartsReducer from "./chartsSlice";
import dashboardSliceReducer from "./DashboardsSlice"
import visualizationsSliceReducer from "./chartvisualizationSlice"

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    connections: connectionsReducer,
    folders: foldersReducer,
    charts: chartsReducer,
    dashboard: dashboardSliceReducer,
    visualizations: visualizationsSliceReducer,
  }
});

export default store;
