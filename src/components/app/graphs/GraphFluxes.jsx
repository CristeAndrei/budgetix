import React, { useEffect, useState } from "react";
import { database } from "../../../firebase";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import StorageIcon from "@material-ui/icons/Storage";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { useHistory } from "react-router-dom";
import Message from "../../utils/Message";
import LoadingScreen from "../../utils/LoadingScreen";

export default function GraphFluxes({ graph }) {
  const [fluxList, setFluxList] = useState([]);
  const history = useHistory();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (graph?.fluxList?.length > 0) {
      (async () => {
        setLoading(true);
        try {
          const graphFluxesQuerySnapshot = await database.fluxes
            .where(database.documentId, "in", graph.fluxList)
            .get();

          const graphFluxesDocs = graphFluxesQuerySnapshot.docs;

          const graphFluxesData = graphFluxesDocs.map((doc) =>
            database.formatDoc(doc)
          );
          setFluxList(graphFluxesData);
        } catch (err) {
          setError("Failed to get the selected fluxes list");
          console.log(err);
        }
        setLoading(false);
      })();
    }
  }, [graph]);

  function redirectFlux(fluxId) {
    history.push(`/flux/${fluxId}`);
  }

  async function removeFlux(fluxId) {
    setLoading(true);
    try {
      const graphRef = database.graphs.doc(graph.id);
      await graphRef.update({
        fluxList: database.removeItemsFromArray(fluxId),
      });
    } catch (err) {
      setError("Failed to remove the selected flux");
      console.log(err);
    }
    setLoading(false);
  }

  const listItems = fluxList.map((flux) => (
    <ListItem key={flux.id}>
      <ListItemIcon>
        <IconButton
          onClick={() => redirectFlux(flux.id)}
          children={<StorageIcon />}
        />
      </ListItemIcon>
      <ListItemText primary={flux.name} />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() => removeFlux(flux.id)}
          children={<RemoveCircleIcon />}
        />
      </ListItemSecondaryAction>
    </ListItem>
  ));

  return (
    <>
      {!error ? (
        <List>{listItems}</List>
      ) : (
        <Typography align="center">Something went wrong</Typography>
      )}

      {error && (
        <Message
          type="error"
          text={error}
          onCloseCo={() => setError("")}
          vertical="top"
          horizontal="center"
        />
      )}
      {loading && <LoadingScreen open={loading} />}
    </>
  );
}
