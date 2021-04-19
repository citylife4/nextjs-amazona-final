import React from 'react'
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Grid,
    Typography,

} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import MoneyIcon from '@material-ui/icons/Money';
import { useStyles } from '../../utils/styles';
import { curr } from '../../utils/config';

function Widget({ saleTotal }) {
    const classes = useStyles();
    return (
        <Card>
            <CardContent>
                <Grid
                    container
                    justify="space-between"
                    spacing={3}
                >
                    <Grid item>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="h6"
                        >
                            SALES
            </Typography>
                        <Typography
                            color="textPrimary"
                            variant="h3"
                        >
                            {curr}{saleTotal}
                        </Typography>
                    </Grid>

                </Grid>
                <Grid item>
                    <Avatar className={classes.dashboardavatar}>
                        <MoneyIcon />
                    </Avatar>
                </Grid>
                <Box
                    mt={2}
                    display="flex"
                    alignItems="center"
                >
                    <ArrowDownwardIcon className={classes.differenceIcon} />
                    <Typography
                        className={classes.differenceValue}
                        variant="body2"
                    >
                        12%
          </Typography>
                    <Typography
                        color="textSecondary"
                        variant="caption"
                    >
                        Since last month
          </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default Widget;
