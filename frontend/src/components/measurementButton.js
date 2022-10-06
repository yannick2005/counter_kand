import React, { useState } from 'react';
import {
  withStyles,
  Button,
  Icon
} from '@material-ui/core';

const styles = theme => ({
  button: props => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '10vh',
    overflow: "hidden",
    wordBreak: 'break-all',
  }),
});

function MeasurementButton(props) {
  const { classes, displayText } = props;
  const [groupName, setGroupName] = useState(props.groupName);
  const [buttonValue, setButtonValue] = useState(props.buttonValue);
  const [icon, setIcon] = useState(props.icon);

  const handleButtonPress = () => {
    const { onClick } = props
    onClick(groupName, buttonValue)
  }

  return (
    <Button variant="outlined"
      color="primary"
      className={classes.button}
      onClick={handleButtonPress}
    >
      { /* display text only if user wants that */}
      {displayText && (
        buttonValue
      )}
      <br />

      {icon && (
        <Icon>{icon}</Icon>
      )}
    </Button>
  )
}

export default withStyles(styles)(MeasurementButton);
