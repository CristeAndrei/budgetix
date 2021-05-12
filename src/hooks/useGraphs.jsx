import { useEffect, useState } from "react";
import { database } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGraph,
  updateAllGraphs,
  updateGraph,
} from "../redux/graphsSlice";

export function useGraphs(graphId = null) {
  const { uid } = useSelector(({ user }) => user.data);
  const { graphList, selectedGraph } = useSelector(({ graphs }) => graphs);
  const [errorGraph, setErrorGraph] = useState("");
  const [loadingGraph, setLoadingGraph] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (uid) {
      let unsubscribeGraph = () => {};
      let unsubscribeAllGraphs = () => {};
      setLoadingGraph(true);
      try {
        dispatch(selectGraph({ graphId }));

        unsubscribeGraph =
          graphId === null
            ? () => {}
            : database.graphs.doc(graphId).onSnapshot((snapshot) => {
                const formattedDoc = database.formatDoc(snapshot);

                formattedDoc.createdAt = formattedDoc.createdAt.toMillis();
                formattedDoc.fromDate = formattedDoc.fromDate.toMillis();
                formattedDoc.toDate = formattedDoc.toDate.toMillis();

                dispatch(updateGraph({ formattedDoc }));
              });

        unsubscribeAllGraphs = database.graphs
          .where("userId", "==", uid)
          .onSnapshot((snapshot) => {
            const docs = snapshot.docs.map(database.formatDoc);
            const formattedDocs = docs.map((doc) => {
              return {
                ...doc,
                createdAt: doc.createdAt.toMillis(),
                fromDate: doc.fromDate.toMillis(),
                toDate: doc.toDate.toMillis(),
              };
            });
            dispatch(updateAllGraphs({ formattedDocs }));
          });
      } catch (err) {
        setErrorGraph("Something went wrong while getting the graphs");
        console.log(err);
      } finally {
        setLoadingGraph(false);
        return () => {
          unsubscribeGraph();
          unsubscribeAllGraphs();
        };
      }
    }
  }, [uid, dispatch, graphId]);

  return { graphList, selectedGraph, errorGraph, setErrorGraph, loadingGraph };
}
