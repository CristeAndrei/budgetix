import { createSlice } from '@reduxjs/toolkit';

const budgetSlice = createSlice({
	name: 'budget',
	initialState: {
		budgetList: [],
	},
	reducers: {
		updateBudget: (state, action) => {
			state.budgetList = action.payload.formattedDocs;
		},
	},
	extraReducers: {},
});

export const { updateBudget } = budgetSlice.actions;

export default budgetSlice.reducer;
