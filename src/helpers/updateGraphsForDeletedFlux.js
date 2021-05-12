import { database, firestore } from "../firebase";

export default async function updateGraphsForDeletedFlux(fluxId) {
  try {
    const batch = firestore.batch();

    const graphsQuerySnap = await database.graphs
      .where("fluxList", "array-contains", fluxId)
      .get();

    const graphsDocs = graphsQuerySnap.docs;

    for (const graph of graphsDocs) {
      const graphRef = database.graphs.doc(graph.id);
      batch.update(graphRef, {
        fluxList: database.removeItemsFromArray(fluxId),
      });
    }

    await batch.commit();
  } finally {
  }
}
