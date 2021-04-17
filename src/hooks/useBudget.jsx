import { useEffect } from 'react';
import { database } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { updateBudget } from '../redux/budgetSlice';

export function useBudget() {
	const { userName } = useSelector(({ user }) => user.data);
	const dispatch = useDispatch();

	useEffect(() => {
		if (userName) {
			return database.budgets
				.where('userList', 'array-contains', userName)
				.onSnapshot((snapshot) => {
					const docs = snapshot.docs.map(database.formatDoc);
					const formattedDocs = docs.map((item) => {
						return { ...item, createdAt: item.createdAt.toMillis() };
					});
					console.log(formattedDocs);
					dispatch(updateBudget({ formattedDocs }));
				});
		}
	}, [userName, dispatch]);
}
