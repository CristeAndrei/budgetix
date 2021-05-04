import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Button,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  SvgIcon,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import { useDispatch, useSelector } from "react-redux";
import { setDeviceFCMToken, signOut } from "../../redux/userSlice";
import { database } from "../../firebase";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    position: "fixed",
    top: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

//TODO maybe add sig out error
export default function NavbarComponent() {
  const classes = useStyles();
  const { isAuthenticated, deviceFCMToken } = useSelector(({ user }) => user);
  const { uid } = useSelector(({ user }) => user.data);
  const history = useHistory();
  const [state, setState] = useState({
    left: false,
  });
  const dispatch = useDispatch();

  async function handleLogout() {
    if (deviceFCMToken) {
      await database.users
        .doc(uid)
        .update({ tokens: database.removeItemsFromArray(deviceFCMToken) });
    }

    dispatch(setDeviceFCMToken({ token: null }));

    dispatch(signOut());
    history.push("/login");
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ left: open });
  };

  const list = (anchor) => (
    <div
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <></>
      <Divider />
      <List>
        <ListItem button component={Link} to="/group">
          <ListItemIcon>
            <SvgIcon component={PeopleAltIcon} />
          </ListItemIcon>
          <ListItemText primary="Groups" />
        </ListItem>
        <ListItem button component={Link} to="/user">
          <ListItemIcon>
            <SvgIcon component={AccountCircleIcon} />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>
        <ListItem button component={Link} to="/notifications">
          <ListItemIcon>
            <SvgIcon component={NotificationsIcon} />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItem>
        <ListItem button component={Link} to="/budget">
          <ListItemIcon>
            <SvgIcon component={AccountBalanceWalletIcon} />
          </ListItemIcon>
          <ListItemText primary="Budget" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <SvgIcon component={ExitToAppIcon} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      {isAuthenticated ? (
        <AppBar className={classes.root}>
          <Toolbar>
            {["left"].map((anchor) => (
              <React.Fragment key={anchor}>
                <Button
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  style={{ marginLeft: "-20px" }}
                  onClick={toggleDrawer(anchor, true)}
                >
                  <SvgIcon component={MenuIcon} />
                </Button>
                <SwipeableDrawer
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                  onOpen={toggleDrawer(anchor, true)}
                >
                  {list(anchor)}
                </SwipeableDrawer>
              </React.Fragment>
            ))}

            <Link
              to="/login"
              style={{ color: "white", textDecoration: "none" }}
            >
              MoneyRoller
            </Link>
          </Toolbar>
        </AppBar>
      ) : (
        <></>
      )}
    </>
  );
}
