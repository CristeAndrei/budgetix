import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import AddIcon from "@material-ui/icons/Add";
import InfoIcon from "@material-ui/icons/Info";

import { ClickAwayListener, Badge, Divider, Popover } from "@material-ui/core";
import AddFluxButton from "./AddFluxButton";
import FluxInfo from "./FluxInfo";
import AddFileLineButton from "./AddFileLineButton";
import AddBasicLineButton from "./AddBasicLineButton";
import { useSelector } from "react-redux";
import ListUploadingFiles from "./ListUploadingFiles";
import AddUserToFlux from "./AddUserToFlux";
import ListGroupUsers from "./ListGroupUsers";

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: "0",
    position: "fixed",
    width: "100%",
  },
  paperPending: {
    bottom: "60px",
    position: "fixed",
    //width: '10rem',
    width: "35%",
  },
  addButtons: {
    bottom: "65px",
    right: "35px",
    position: "fixed",
  },
}));

export default function BottomActions({ type }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(null);
  const [openPending, setOpenPending] = useState(true);
  const [addButtonsAnchorEl, setAddButtonsAnchorEl] = useState(null);
  const addButtonsOpen = Boolean(addButtonsAnchorEl);
  const [infoAnchorEl, setInfoAnchorEl] = useState(null);
  const infoOpen = Boolean(infoAnchorEl);
  const { fluxId, uploadingFiles } = useSelector(({ fluxes }) => fluxes);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleClickAdd(e) {
    setAddButtonsAnchorEl(e.currentTarget);
  }

  function handleCloseAdd() {
    setAddButtonsAnchorEl(null);
    setValue(null);
  }

  function handleClickInfo(e) {
    setInfoAnchorEl(e.currentTarget);
  }

  function handleCloseInfo() {
    setInfoAnchorEl(null);
    setValue(null);
  }

  function handleClickPending() {
    setOpenPending(!openPending);
  }

  function handleCloseAll() {
    setValue(false);
    setOpenPending(true);
    setAddButtonsAnchorEl(false);
  }
  return (
    <>
      <ClickAwayListener onClickAway={handleCloseAll}>
        <div>
          <BottomNavigation
            value={value}
            onChange={handleChange}
            showLabels
            className={classes.root}
          >
            <BottomNavigationAction
              label="Pending files"
              icon={
                <Badge badgeContent={uploadingFiles.length} color="primary">
                  <HourglassEmptyIcon />
                </Badge>
              }
              onClick={handleClickPending}
            />
            <BottomNavigationAction
              label="Info"
              icon={<InfoIcon />}
              onClick={handleClickInfo}
            />
            <BottomNavigationAction
              label="Add"
              onClick={handleClickAdd}
              icon={<AddIcon />}
            />
          </BottomNavigation>

          <Popover
            open={infoOpen}
            anchorEl={infoAnchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            onClose={handleCloseInfo}
          >
            <FluxInfo type={type} />
            <Divider />
            {type === "group" && fluxId !== null && <ListGroupUsers />}
          </Popover>

          <Popover
            open={addButtonsOpen}
            anchorEl={addButtonsAnchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            onClose={handleCloseAdd}
          >
            <AddFluxButton type={type} />
            <Divider />
            {fluxId != null && (
              <>
                {type === "group" && (
                  <>
                    <AddUserToFlux type={type} />
                    <Divider />
                  </>
                )}
                <AddFileLineButton type={type} />
                <Divider />
                <AddBasicLineButton type={type} />
              </>
            )}
          </Popover>
        </div>
      </ClickAwayListener>

      <div hidden={openPending} className={classes.paperPending}>
        <ListUploadingFiles />
      </div>
    </>
  );
}
