import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { database } from "../../../firebase";
import { useSelector } from "react-redux";
import Message from "../../utils/Message";
import LoadingScreen from "../../utils/LoadingScreen";

export default function GraphDialog({ open, onClose, graph = null }) {
  const [name, setName] = useState(graph?.name ?? "");
  const { uid } = useSelector(({ user }) => user.data);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(graph?.name ?? "");
  }, [open, graph]);

  function closeDialog() {
    onClose();
  }

  async function deleteGraph() {
    closeDialog();
    setLoading(true);
    try {
      const graphRef = database.graphs.doc(graph.id);

      await graphRef.delete();
    } catch (err) {
      setError("Failed to delete the graph");
      console.log(err);
    }
    setLoading(false);
  }

  async function handleGraphSubmit() {
    closeDialog();
    setLoading(true);
    try {
      switch (open) {
        case "add":
          await database.graphs.add({
            name: name.trim(),
            fluxList: [],
            userId: uid,
            createdAt: database.getTimestampFromMillis(Date.now()),
            fromDate: database.getTimestampFromMillis(Date.now()),
            toDate: database.getTimestampFromMillis(Date.now()),
            timeFormat: "months",
          });
          break;
        case "update":
          await database.graphs.doc(graph.id).update({
            name,
          });
          break;
        default:
      }
    } catch (err) {
      setError("Failed to create or update the graph");
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <>
      <Dialog open={Boolean(open)} onClose={onClose}>
        <DialogTitle>Graph</DialogTitle>
        <ValidatorForm onSubmit={handleGraphSubmit}>
          <DialogContent>
            <DialogContentText>
              {open === "add" ? "Create a new graph." : "Edit this graph."}
            </DialogContentText>
            <TextValidator
              fullWidth
              label="Name"
              onChange={(event) => setName(event.target.value)}
              name="name"
              value={name}
              validators={["required", "trim"]}
              errorMessages={[
                "This field is required",
                "This field is required",
              ]}
            />
          </DialogContent>
          <DialogActions>
            {open === "update" && <Button onClick={deleteGraph}>Delete</Button>}
            <Button type="submit">Submit</Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
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
