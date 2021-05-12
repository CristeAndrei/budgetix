import { useEffect, useState } from "react";
import { database } from "../firebase";

import { useDispatch, useSelector } from "react-redux";
import {
  selectFlux,
  UpdateChildFluxes,
  UpdateChildLines,
  UpdateFlux,
  updateFluxRoot,
} from "../redux/fluxesSlice";

export const ROOT_FLUX = { name: "Root", id: null, path: [] };

export function useFlux(fluxId = null, type = null) {
  const dispatch = useDispatch();
  const { uid } = useSelector(({ user }) => user.data);
  const { childFluxes, childLines } = useSelector(({ fluxes }) => fluxes);
  const { flux } = useSelector(({ fluxes }) => fluxes);
  const [loadingFlux, setLoadingFlux] = useState(false);
  const [errorFlux, setErrorFlux] = useState("");

  useEffect(() => {
    if (uid) {
      let unsubscribeFlux = () => {};
      let unsubscribeFluxes = () => {};
      let unsubscribeLines = () => {};
      try {
        dispatch(selectFlux({ fluxId }));

        unsubscribeFlux =
          fluxId === null
            ? (() => {
                dispatch(updateFluxRoot());
                return () => {};
              })()
            : database.fluxes.doc(fluxId).onSnapshot((snapshot) => {
                const doc = database.formatDoc(snapshot);
                doc.createdAt = doc.createdAt.toMillis();
                dispatch(UpdateFlux({ doc }));
              });

        unsubscribeFluxes = database.fluxes
          .where("parentId", "==", fluxId)
          .where("userId", "array-contains", uid)
          .orderBy("createdAt")
          .onSnapshot((snapshot) => {
            const docs = snapshot.docs.map(database.formatDoc);
            const formattedDocs = docs.map((item) => {
              return { ...item, createdAt: item.createdAt.toMillis() };
            });
            dispatch(UpdateChildFluxes({ formattedDocs }));
          });

        unsubscribeLines = database.lines
          .where("fluxId", "==", fluxId)
          .where("userId", "array-contains", uid)
          .orderBy("createdAt")
          .onSnapshot((snapshot) => {
            const docs = snapshot.docs.map(database.formatDoc);
            const formattedDocs = docs.map((item) => {
              return { ...item, createdAt: item.createdAt.toMillis() };
            });
            dispatch(UpdateChildLines({ formattedDocs }));
          });
      } catch (err) {
        setErrorFlux("Something went wrong while getting the fluxes");
        console.log(err);
      }
      setLoadingFlux(false);
      return () => {
        unsubscribeFlux();
        unsubscribeFluxes();
        unsubscribeLines();
      };
    }
  }, [fluxId, uid, type, dispatch]);

  return {
    fluxId,
    flux,
    childFluxes,
    childLines,
    errorFlux,
    loadingFlux,
    setErrorFlux,
  };
}
