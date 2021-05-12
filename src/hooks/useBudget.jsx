import { useEffect, useState } from "react";
import { database } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBudget,
  updateAllBudgets,
  updateBudget,
} from "../redux/budgetsSlice";

export function useBudget(budgetId = null) {
  const { uid } = useSelector(({ user }) => user.data);
  const { budgetList, selectedBudget } = useSelector(({ budgets }) => budgets);
  const [errorBudget, setErrorBudget] = useState("");
  const [loadingBudget, setLoadingBudget] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (uid) {
      setLoadingBudget(true);
      let unsubscribeAllBudgets = () => {};
      let unsubscribeBudget = () => {};
      try {
        dispatch(selectBudget({ budgetId }));

        unsubscribeBudget =
          budgetId === null
            ? () => {}
            : database.budgets.doc(budgetId).onSnapshot((snapshot) => {
                const formattedDoc = database.formatDoc(snapshot);
                const canAddUsers = !formattedDoc.subscribedFluxes.some(
                  (flux) => flux.type === "flux"
                );
                formattedDoc.createdAt = formattedDoc.createdAt.toMillis();
                formattedDoc.budgetType = canAddUsers;
                dispatch(updateBudget({ formattedDoc }));
              });

        unsubscribeAllBudgets = database.budgets
          .where("userList", "array-contains", uid)
          .onSnapshot((snapshot) => {
            const docs = snapshot.docs.map(database.formatDoc);
            const formattedDocs = docs.map((doc) => {
              return {
                ...doc,
                createdAt: doc.createdAt.toMillis(),
                canAddUsers: !doc.subscribedFluxes.some(
                  (flux) => flux.type === "flux"
                ),
              };
            });
            dispatch(updateAllBudgets({ formattedDocs }));
          });
      } catch (err) {
        setErrorBudget("Something went wrong while getting the budgets");
        console.log(err);
      }
      setLoadingBudget(false);
      return () => {
        unsubscribeBudget();
        unsubscribeAllBudgets();
      };
    }
  }, [uid, dispatch, budgetId]);

  return {
    errorBudget,
    setErrorBudget,
    loadingBudget,
    budgetList,
    selectedBudget,
  };
}
