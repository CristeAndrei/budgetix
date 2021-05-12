import { database, firestore } from "../firebase";
import updateBudgetTasks from "./updateBudgetTasks";

export default async function removeFluxFromBudget(flux, budget) {
  try {
    const batch = firestore.batch();

    const budgetRef = database.budgets.doc(budget.id);

    batch.update(budgetRef, {
      totalBalance: database.increment(-flux.value),
      subscribedFluxes: database.removeItemsFromArray({
        id: flux.id,
        name: flux.name,
        value: flux.value,
        type: flux.type,
      }),
    });

    //add update or remove budget notification if exists
    await updateBudgetTasks(budgetRef, -flux.value);

    await batch.commit();
  } finally {
  }
}
