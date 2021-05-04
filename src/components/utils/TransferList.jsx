import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import { Button, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  cardBody: {
    width: "50%",
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: "100%",
    height: 150,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function TransferList({
  chosenOptions,
  freeOptions,
  setSubscribedElements,
}) {
  const classes = useStyles();
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState(freeOptions);
  const [right, setRight] = useState(chosenOptions);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  useEffect(() => {
    setLeft(freeOptions);
    setRight(chosenOptions);
  }, [chosenOptions, freeOptions]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    setSubscribedElements(right.concat(leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    setSubscribedElements(not(right, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
            size="small"
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} `}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value.id}
              role="listItem"
              button
              disableGutters
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  inputProps={{ "aria-labelledby": labelId }}
                  size="small"
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primaryTypographyProps={{ noWrap: true }}
                primary={`${value.name}`}
                style={{ marginLeft: "-1.25rem" }}
              />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid
      container
      alignContent="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Grid
          alignContent="center"
          alignItems="center"
          direction="row"
          container
        >
          <Grid className={classes.cardBody} item>
            {customList("Choices", left)}
          </Grid>
          <Grid className={classes.cardBody} item>
            {customList("Chosen", right)}
          </Grid>
        </Grid>
      </Grid>
      <Grid item style={{ width: "100%" }}>
        <Grid
          container
          justify="space-evenly"
          direction="row"
          alignItems="center"
        >
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
