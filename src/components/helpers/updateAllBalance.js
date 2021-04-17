import { database, firestore } from "../../firebase";


export default async function updateAllBalance(flux, decimalValue) {
  //update balance for parent flux
  const currentDocRef = database.fluxes.doc(flux.id);
  await currentDocRef.update({
    balance: database.increment(decimalValue),
  });

  //update total balance for parent fluxes
  const batch = firestore.batch();

  batch.update(currentDocRef, {
    totalBalance: database.increment(decimalValue),
  });

  for (const el of flux.path) {
    const docRef = database.fluxes.doc(el.id);
    batch.update(docRef, {
      totalBalance: database.increment(decimalValue),
    });
  }

  await batch.commit();
}
