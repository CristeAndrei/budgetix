import { useEffect } from "react";
import { database } from "../firebase";

import { useDispatch, useSelector } from "react-redux";
import {
  selectFlux,
  updateFluxRoot,
  UpdateChildFluxes,
  UpdateChildLines,
  UpdateFlux,
} from "../redux/fluxesSlice";

export const ROOT_FLUX = { name: "Root", id: null, path: [] };

export function useFlux(fluxId = null, type = null) {
  const dispatch = useDispatch();
  const { uid } = useSelector(({ user }) => user.data);
  const { childFluxes, childLines } = useSelector(({ fluxes }) => fluxes);
  const { flux } = useSelector(({ fluxes }) => fluxes);

  useEffect(() => {
    if (uid) {
      dispatch(selectFlux({ fluxId }));
      let unsubscribeFlux = () => {};
      if (fluxId === null) {
        dispatch(updateFluxRoot({ ROOT_FLUX }));
      } else {
        unsubscribeFlux = database.fluxes.doc(fluxId).onSnapshot((snapshot) => {
          const doc = database.formatDoc(snapshot);
          doc.createdAt = doc.createdAt.toMillis();
          dispatch(UpdateFlux({ doc }));
        });
      }

      const unsubscribeFluxes = database.fluxes
        .where("parentId", "==", fluxId)
        .where("userId", "array-contains", uid)
        .orderBy("createdAt")
        .onSnapshot((snapshot) => {
          const docs = snapshot.docs.map(database.formatDoc);
          const formattedDocs= docs.map((item)=> {
            return {...item, createdAt: item.createdAt.toMillis()}
          })
          dispatch(UpdateChildFluxes({ formattedDocs }));
        });
      const unsubscribeLines = database.lines
        .where("fluxId", "==", fluxId)
        .where("userId", "array-contains", uid)
        .orderBy("createdAt")
        .onSnapshot((snapshot) => {
          const docs = snapshot.docs.map(database.formatDoc);
          const formattedDocs= docs.map((item)=> {
            return {...item, createdAt: item.createdAt.toMillis()}
          })
          dispatch(UpdateChildLines({ formattedDocs }));
        });

      return () => {
        unsubscribeFlux();
        unsubscribeFluxes();
        unsubscribeLines();
      };
    }
  }, [fluxId, uid, type, dispatch]);

  return { fluxId, flux, childFluxes, childLines };
}
