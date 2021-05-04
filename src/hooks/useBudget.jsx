import { useEffect } from "react";
import { database } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  updateBudget,
  updateAllBudgets,
  selectBudget,
} from "../redux/budgetsSlice";

export function useBudget(budgetId = null) {
  const { userName } = useSelector(({ user }) => user.data);
  const { budgetList, selectedBudget } = useSelector(({ budgets }) => budgets);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userName) {
      dispatch(selectBudget({ budgetId }));

      let unsubscribeBudget =
        budgetId === null
          ? () => {}
          : database.budgets.doc(budgetId).onSnapshot((snapshot) => {
              const formattedDoc = database.formatDoc(snapshot);
              formattedDoc.createdAt = formattedDoc.createdAt.toMillis();
              dispatch(updateBudget({ formattedDoc }));
            });

      const unsubscribeAllBudgets = database.budgets
        .where("userList", "array-contains", userName)
        .onSnapshot((snapshot) => {
          const docs = snapshot.docs.map(database.formatDoc);
          const formattedDocs = docs.map((item) => {
            return { ...item, createdAt: item.createdAt.toMillis() };
          });
          dispatch(updateAllBudgets({ formattedDocs }));
        });

      return () => {
        unsubscribeBudget();
        unsubscribeAllBudgets();
      };
    }
  }, [userName, dispatch, budgetId]);

  return { budgetList, selectedBudget };
}
