import { database, firestore } from "../firebase";
import updateBudgetTasks from "./updateBudgetTasks";

export default async function updateAllBudgetsBalance(flux, decimalValue) {
  try {
    const batch = firestore.batch();

    //add remove or update budget notification

    //update balance for all subscribed budgets
    for (const item of flux.subscribedBudgets) {
      const subscribedBudgetsRef = database.budgets.doc(item);

      await updateBudgetTasks(subscribedBudgetsRef, decimalValue);

      const newValue = flux.balance + decimalValue;

      batch.update(subscribedBudgetsRef, {
        totalBalance: database.increment(decimalValue),
      });

      batch.update(subscribedBudgetsRef, {
        subscribedFluxes: database.removeItemsFromArray({
          id: flux.id,
          name: flux.name,
          value: flux.balance,
          type: flux.type,
        }),
      });

      batch.update(subscribedBudgetsRef, {
        subscribedFluxes: database.addItemsToArray({
          id: flux.id,
          name: flux.name,
          value: newValue,
          type: flux.type,
        }),
      });
    }

    await batch.commit();
  } finally {
  }
}
