import React from 'react';
import {
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
} from '@material-ui/core';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import { useSelector } from 'react-redux';

export default function ListBudget() {
	const { budgetList } = useSelector(({ budget }) => budget);

	return (
		<>
			<List>
				{budgetList.map((item) => (
					<ListItem key={item.name}>
						<ListItemIcon>
							<IconButton aria-label='edit'>
								<LineWeightIcon />
							</IconButton>
						</ListItemIcon>
						<ListItemText>{item.name}</ListItemText>
						<ListItemSecondaryAction></ListItemSecondaryAction>
					</ListItem>
				))}
			</List>
		</>
	);
}
