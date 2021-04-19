import React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import { useStyles } from '../../utils/styles';

function TotalCustomers({ userTotal }) {
  const classes = useStyles();
  return (
    <Card>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h3">
              CUSTOMERS
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {userTotal}
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Avatar className={classes.dashboardavatar}>
            <PeopleIcon />
          </Avatar>
        </Grid>
        <Box mt={2} display="flex" alignItems="center">
          <ArrowUpwardIcon className={classes.differenceIcon} />
          <Typography className={classes.differenceValue} variant="body2">
            20%
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Since last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TotalCustomers;
