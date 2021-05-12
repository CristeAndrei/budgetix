import { createSlice } from "@reduxjs/toolkit";

const graphsSlice = createSlice({
  name: "graph",
  initialState: {
    selectedGraph: {
      graphId: null,
    },
    graphList: [],
  },
  reducers: {
    selectGraph: (state, action) => {
      state.selectedGraph = { graphId: action.payload.graphId };
    },
    updateGraph: (state, action) => {
      state.selectedGraph = action.payload.formattedDoc;
    },
    updateAllGraphs: (state, action) => {
      state.graphList = action.payload.formattedDocs;
    },
  },
  extraReducers: {},
});

export const {
  updateGraph,
  selectGraph,
  updateAllGraphs,
} = graphsSlice.actions;

export default graphsSlice.reducer;
