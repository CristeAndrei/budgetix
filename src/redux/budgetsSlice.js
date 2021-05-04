import { createSlice } from "@reduxjs/toolkit";

const budgetsSlice = createSlice({
  name: "budgets",
  initialState: {
    selectedBudget: {
      budgetId: null,
    },
    budgetList: [],
  },
  reducers: {
    selectBudget: (state, action) => {
      state.selectedBudget = { budgetId: action.payload.budgetId };
    },
    updateBudget: (state, action) => {
      state.selectedBudget = action.payload.formattedDoc;
    },
    updateAllBudgets: (state, action) => {
      state.budgetList = action.payload.formattedDocs;
    },
  },
  extraReducers: {},
});

export const {
  updateBudget,
  selectBudget,
  updateAllBudgets,
} = budgetsSlice.actions;

export default budgetsSlice.reducer;
