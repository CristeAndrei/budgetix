import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useSelector } from "react-redux";
import TransferList from "../../utils/TransferList";
import Message from "../../utils/Message";
import TimelineIcon from "@material-ui/icons/Timeline";
import { useGraphs } from "../../../hooks/useGraphs";
import { database, firestore } from "../../../firebase";
import getAddRemoveSubscriptions from "../../../helpers/getAddRemoveSubscriptions";
import LoadingScreen from "../../utils/LoadingScreen";

export default function AddFluxToGraph() {
  const [open, setOpen] = useState(false);
  const [subscribeGraphOption, setSubscribeGraphOption] = useState("all");
  const [subscribedElements, setSubscribedElements] = useState([]);
  const [chosenOptions, setChosenOptions] = useState([]);
  const [freeOptions, setFreeOptions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { flux } = useSelector(({ fluxes }) => fluxes);
  const { graphList, errorGraph, setErrorGraph, loadingGraph } = useGraphs();

  function openDialog() {
    setChoices();
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  function setChoices() {
    let freeOptionsAux = [];
    let chosenOptionsAux = [];

    for (const graph of graphList) {
      const verifyIfFluxIsInGraph = graph.fluxList.some(
        (fluxGraph) => fluxGraph === flux.id
      );
      if (verifyIfFluxIsInGraph) {
        chosenOptionsAux = [
          ...chosenOptionsAux,
          { id: graph.id, name: graph.name },
        ];
      } else
        freeOptionsAux = [
          ...freeOptionsAux,
          { id: graph.id, name: graph.name },
        ];
    }

    setFreeOptions(freeOptionsAux);
    setChosenOptions(chosenOptionsAux);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    closeDialog();
    setLoading(true);

    try {
      const {
        addedSubscriptions,
        removedSubscriptions,
      } = getAddRemoveSubscriptions(subscribedElements, chosenOptions);

      const batch = firestore.batch();

      //add new subscribed graphs
      for (const addSubscription of addedSubscriptions) {
        const graphRef = database.graphs.doc(addSubscription.id);

        batch.update(graphRef, { fluxList: database.addItemsToArray(flux.id) });

        if (subscribeGraphOption === "all") {
          const childFluxesQuerySnapshot = await database.fluxes
            .where("path", "array-contains", { id: flux.id, name: flux.name })
            .get();

          const childFluxesDocs = childFluxesQuerySnapshot.docs;

          const childFluxesData = childFluxesDocs.map((doc) =>
            database.formatDoc(doc)
          );

          for (const childFlux of childFluxesData) {
            batch.update(graphRef, {
              fluxList: database.addItemsToArray(childFlux.id),
            });
          }
        }
      }

      //remove unsubscribed graphs
      for (const removeSubscription of removedSubscriptions) {
        const graphRef = database.graphs.doc(removeSubscription.id);

        batch.update(graphRef, {
          fluxList: database.removeItemsFromArray(flux.id),
        });

        if (subscribeGraphOption === "all") {
          const childFluxesQuerySnapshot = await database.fluxes
            .where("path", "array-contains", { id: flux.id, name: flux.name })
            .get();

          const childFluxesDocs = childFluxesQuerySnapshot.docs;

          const childFluxesData = childFluxesDocs.map((doc) =>
            database.formatDoc(doc)
          );

          for (const childFlux of childFluxesData) {
            batch.update(graphRef, {
              fluxList: database.removeItemsFromArray(childFlux.id),
            });
          }
        }
      }
      await batch.commit();
    } catch (err) {
      console.log(err);
      setError("Failed to make changes to the selected graphs");
    }

    setLoading(false);
  }

  function handleRadioChange(event) {
    setSubscribeGraphOption(event.target.value);
  }

  return (
    <>
      <Tooltip placement="left" title="Subscribe to Graphs">
        <IconButton onClick={openDialog} children={<TimelineIcon />} />
      </Tooltip>

      {open && (
        <Dialog
          open={open}
          onClose={closeDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
            Graph Subscriptions
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TransferList
                chosenOptions={chosenOptions}
                freeOptions={freeOptions}
                setSubscribedElements={setSubscribedElements}
              />
              <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
              <FormControl component="fieldset">
                <FormLabel component="legend">Options</FormLabel>
                <RadioGroup
                  aria-label="subscribeOptions"
                  name="subscribeOptions"
                  value={subscribeGraphOption}
                  onChange={handleRadioChange}
                >
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label="The flux and its sub fluxes"
                  />
                  <FormControlLabel
                    value="flux"
                    control={<Radio />}
                    label="Just the current flux"
                  />
                </RadioGroup>
                <FormHelperText style={{ maxWidth: "100%" }}>
                  Chose what fluxes are to be (un)subscribed
                </FormHelperText>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
      {(error || errorGraph) !== "" && (
        <Message
          onCloseCo={() => {
            setErrorGraph("");
            setError("");
          }}
          text={error || errorGraph}
          type="error"
          vertical="top"
          horizontal="center"
        />
      )}
      {(loadingGraph || loading) && (
        <LoadingScreen open={loading || loadingGraph} />
      )}
    </>
  );
}
