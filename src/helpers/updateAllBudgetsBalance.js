import { database, firestore } from "../firebase";

export default async function updateAllBudgetsBalance(flux, decimalValue) {
  //update  balance for all budgets

  const batch = firestore.batch();

  for (const item of flux.subscribedBudgets) {
    const docRef = database.budgets.doc(item.id);

    const newValue = flux.balance + decimalValue;

    batch.update(docRef, {
      totalBalance: database.increment(decimalValue),
    });

    batch.update(docRef, {
      balance: database.removeItemsFromArray({
        id: flux.id,
        name: flux.name,
        value: flux.balance,
        path: flux.path,
        parentId: flux.parentId,
      }),
    });

    batch.update(docRef, {
      balance: database.addItemsToArray({
        id: flux.id,
        name: flux.name,
        value: newValue,
        path: flux.path,
        parentId: flux.parentId,
      }),
    });
  }

  await batch.commit();
}
