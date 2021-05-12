import { database, firestore } from "../firebase";

export default async function updateAllBalance(flux, decimalValue) {
  try {
    const batch = firestore.batch();

    //update balance for current flux
    const currentFluxRef = database.fluxes.doc(flux.id);

    batch.update(currentFluxRef, {
      balance: database.increment(decimalValue),
    });

    //update total balance for current flux
    batch.update(currentFluxRef, {
      totalBalance: database.increment(decimalValue),
    });

    //update total balance for parent fluxes
    for (const el of flux.path) {
      const parentFluxRef = database.fluxes.doc(el.id);
      batch.update(parentFluxRef, {
        totalBalance: database.increment(decimalValue),
      });
    }

    await batch.commit();
  } finally {
  }
}
