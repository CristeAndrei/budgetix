import { database, firestore } from "../firebase";

export default async function removeBudgetSubscription(flux, budget) {
  try {
    const batch = firestore.batch();

    const fluxRef = database.fluxes.doc(flux.id);

    batch.update(fluxRef, {
      subscribedBudgets: database.removeItemsFromArray(budget.id),
    });

    await batch.commit();
  } finally {
  }
}
