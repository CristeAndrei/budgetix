import React, { useEffect, useState } from "react";
import MomentUtils from "@date-io/moment";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import moment from "moment";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import Message from "../../utils/Message";
import { database } from "../../../firebase";
import LoadingScreen from "../../utils/LoadingScreen";

export default function GraphSettings({ graph }) {
  const [selectedFromDate, setSelectedFromDate] = useState(moment());
  const [selectedToDate, setSelectedToDate] = useState(moment());
  const [timeFormat, setTimeFormat] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (graph.timeFormat) {
      setSelectedFromDate(moment(graph.fromDate));
      setSelectedToDate(moment(graph.toDate));
      setTimeFormat(graph.timeFormat);
    }
  }, [graph]);

  function handleChange(event) {
    setTimeFormat(event.target.value);
  }

  async function handleGraphSettings(event) {
    event.preventDefault();
    setLoading(true);
    if (
      selectedFromDate.valueOf() >= selectedToDate.valueOf() ||
      selectedToDate.valueOf() <= selectedFromDate.valueOf()
    ) {
      setError("Start or end date are not correct");
      return;
    }

    try {
      const graphRef = database.graphs.doc(graph.id);

      await graphRef.update({
        fromDate: database.getTimestampFromMillis(selectedFromDate.valueOf()),
        toDate: database.getTimestampFromMillis(selectedToDate.valueOf()),
        timeFormat,
      });
    } catch (err) {
      console.log(err);
      setError("Failed to update the settings");
    }
    setLoading(false);
  }

  return (
    <>
      <form onSubmit={handleGraphSettings}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Box display="flex" justifyContent="center">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-start"
              label="Start date picker"
              value={selectedFromDate}
              onChange={(date) => setSelectedFromDate(date)}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Box>
          <Box display="flex" justifyContent="center">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-end"
              label="End date picker"
              value={selectedToDate}
              onChange={(date) => setSelectedToDate(date)}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Box>
          <Box display="flex" justifyContent="center">
            <FormControl required>
              <InputLabel htmlFor="time-native-simple">Time Format</InputLabel>
              <Select
                native
                value={timeFormat}
                onChange={handleChange}
                style={{ width: "8rem" }}
              >
                <option value={"days"}>Days</option>
                <option value={"months"}>Months</option>
                <option value={"years"}>Years</option>
              </Select>
            </FormControl>
          </Box>
          <Box
            style={{ marginTop: "2rem" }}
            display="flex"
            justifyContent="center"
          >
            <Button type="submit">Update Settings</Button>
          </Box>
        </MuiPickersUtilsProvider>
      </form>
      {error && (
        <Message
          text={error}
          type="error"
          onCloseCo={() => setError("")}
          vertical="top"
          horizontal="center"
        />
      )}
      {loading && <LoadingScreen open={loading} />}
    </>
  );
}
