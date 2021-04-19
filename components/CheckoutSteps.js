import React from 'react';
import { Step, Stepper, StepLabel, makeStyles } from '@material-ui/core';
import { useStyles } from '../utils/styles';
import { Check } from '@material-ui/icons';

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#784af4',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div className={[classes.root, { [classes.active]: active }]}>
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

function CheckoutSteps({ activeStep = 0 }) {
  const classes = useStyles();
  return (
    <Stepper activeStep={activeStep - 1} className={classes.p0}>
      {['Sign-In', 'Shipping Address', 'Payment Method', 'Place Order'].map(
        (x) => (
          <Step key={x}>
            <StepLabel StepIconComponent={QontoStepIcon}> {x}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
}

export default CheckoutSteps;
