import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Fab, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import BudgetAdd from './AddBudget';
import ListBudget from './ListBudget';

const useStyles = makeStyles((theme) => ({
	customMarginTop: {
		marginTop: '59px',
	},
	customMarginBottom: {
		marginBottom: '70px',
	},
	absoluteFluxNav: {
		position: 'sticky',
		top: '55px',
		width: '100%',
		zIndex: theme.zIndex.drawer + 1,
	},
	addNotificationButton: {
		position: 'fixed',
		bottom: '10px',
		right: '10px',
	},
}));

export default function Budget() {
	const classes = useStyles();

	const [open, setOpen] = useState(false);

	function openCreateBudget() {
		setOpen(true);
	}

	function closeCreateBudget() {
		setOpen(false);
	}

	return Notification.permission === 'granted' ? (
		<>
			<div className={classes.customMarginTop}>
				<Typography>Budgets</Typography>
				<Divider />
				<ListBudget />
			</div>
			<BudgetAdd open={open} onClose={closeCreateBudget} />
			<Fab className={classes.addNotificationButton} onClick={openCreateBudget}>
				<AddIcon />
			</Fab>
		</>
	) : (
		<></>
	);
}
