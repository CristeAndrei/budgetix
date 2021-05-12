import React, { useState } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LoadingScreen from "../../utils/LoadingScreen";
import { Link, useHistory, useParams } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import StorageIcon from "@material-ui/icons/Storage";
import List from "@material-ui/core/List";
import BudgetPie from "./BudgetPie";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import removeFluxFromBudget from "../../../helpers/removeFluxFromBudget";
import removeBudgetSubscription from "../../../helpers/removeBudgetSubscription";
import LinearProgressWithLabel from "../../utils/LinearProgressWithLabel";
import { useBudget } from "../../../hooks/useBudget";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useNotifications } from "../../../hooks/useNotifications";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import EditIcon from "@material-ui/icons/Edit";
import NotificationDialog from "../notifications/NotificationDialog";
import Message from "../../utils/Message";

const useStyles = makeStyles((theme) => ({
  graphContainer: {
    margin: "auto",
    marginTop: "2.5rem",
    maxWidth: "40rem",
  },
  marginTitle: {
    marginTop: "2.5rem",
  },
  budgetInfoContainer: { ...theme.dashboardMarginTop },
}));

export default function BudgetInfo() {
  const classes = useStyles();
  const { budgetId = null } = useParams();
  const {
    selectedBudget,
    errorBudget,
    setErrorBudget,
    loadingBudget,
  } = useBudget(budgetId);
  const {
    notificationList,
    errorNotifications,
    setErrorNotifications,
    loadingNotifications,
  } = useNotifications();
  const [open, setOpen] = useState("");
  const history = useHistory();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function closeNotificationDialog() {
    setOpen("");
  }

  function openUpdateNotification() {
    setOpen("update");
  }

  function redirectFlux(id) {
    history.push(`/flux/${id}`);
  }

  function redirectNotifications() {
    history.push(`/notifications`);
  }

  async function removeSubscribedFlux(flux) {
    setLoading(true);
    try {
      await removeBudgetSubscription(flux, selectedBudget);
      await removeFluxFromBudget(flux, selectedBudget);
    } catch (err) {
      setError("Failed to remove flux from budget");
      console.log(err);
    }
    setLoading(false);
  }

  if (selectedBudget.subscribedFluxes === undefined)
    return <LoadingScreen open={true} />;

  const fluxesList = selectedBudget.subscribedFluxes.map((flux) => (
    <ListItem key={flux.id}>
      <ListItemIcon>
        <IconButton
          onClick={() => redirectFlux(flux.id)}
          children={<StorageIcon />}
        />
      </ListItemIcon>
      <ListItemText
        onClick={() => redirectFlux(flux.id)}
        style={{ maxWidth: "70%", color: "black" }}
        primaryTypographyProps={{ noWrap: true }}
        primary={flux.name}
        secondary={`Value: ${flux.value}`}
      />

      <ListItemSecondaryAction>
        <IconButton
          onClick={() => removeSubscribedFlux(flux)}
          children={<HighlightOffIcon />}
        />
      </ListItemSecondaryAction>
    </ListItem>
  ));

  const budgetNotifications = notificationList.filter(
    (notification) => notification.id === budgetId
  );

  const budgetNotificationList =
    budgetNotifications.length > 0 ? (
      <ListItem key={budgetNotifications[0].id}>
        <ListItemIcon>
          <IconButton
            onClick={redirectNotifications}
            children={<NotificationsNoneIcon />}
          />
        </ListItemIcon>
        <ListItemText
          onClick={() => console.log()}
          style={{ maxWidth: "70%", color: "black" }}
          primaryTypographyProps={{ noWrap: true }}
          primary={"Notification"}
        />

        <ListItemSecondaryAction>
          <IconButton
            onClick={openUpdateNotification}
            children={<EditIcon />}
          />
        </ListItemSecondaryAction>
      </ListItem>
    ) : (
      <Typography variant="h6">
        No notifications set yet. You haven't get over your set limit
      </Typography>
    );

  return (
    <div className={classes.budgetInfoContainer}>
      <div>
        <IconButton
          children={<ArrowBackIcon />}
          component={Link}
          to="/budget"
        />
        <Typography display={"inline"}>{selectedBudget.name}</Typography>
      </div>
      <Typography align="center" variant="h6" style={{ marginTop: "0.5rem" }}>
        Budget Fluxes
      </Typography>
      {selectedBudget.subscribedFluxes.length > 0 ? (
        <>
          <div className={classes.graphContainer}>
            <BudgetPie fluxes={selectedBudget.subscribedFluxes} />
          </div>
          <div className={classes.marginTitle}>
            <Typography variant="h6" align="center">
              Budget Progress
            </Typography>
            <LinearProgressWithLabel
              value={(selectedBudget.totalBalance * 100) / selectedBudget.limit}
              limit={selectedBudget.limit}
            />
            <Typography variant="h6" align="center">
              Budget limit:{selectedBudget.limit}
            </Typography>
            <Typography variant="h6" align="center">
              Fluxes balance:{selectedBudget.totalBalance}
            </Typography>
          </div>
          <div className={classes.marginTitle}>
            <Typography align="center" variant="h6">
              Fluxes
            </Typography>
            <List>{fluxesList}</List>
          </div>
          <div className={classes.marginTitle}>
            <Typography align="center" variant="h6">
              Notification
            </Typography>
            <List>{budgetNotificationList}</List>
          </div>
          {open && (
            <NotificationDialog
              open={open}
              notification={budgetNotifications[0]}
              onClose={closeNotificationDialog}
            />
          )}
        </>
      ) : (
        <Typography align="center" variant="h4" style={{ marginTop: "12rem" }}>
          No flux Subscribed
        </Typography>
      )}
      {(error || errorBudget || errorNotifications) && (
        <Message
          type="error"
          text={error || errorBudget || errorNotifications}
          onCloseCo={() => {
            setErrorBudget("");
            setError("");
            setErrorNotifications("");
          }}
          vertical="top"
          horizontal="center"
        />
      )}
      {(loading || loadingBudget || loadingNotifications) && (
        <LoadingScreen
          open={loading || loadingBudget || loadingNotifications}
        />
      )}
    </div>
  );
}
