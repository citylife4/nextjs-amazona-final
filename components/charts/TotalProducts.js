import React from 'react'
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Grid,
    Typography,

} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import BorderAllIcon from '@material-ui/icons/BorderAll';
import { useStyles } from '../../utils/styles';

function TotalProducts({ productTotal }) {
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
                            PRODUCTS
                     </Typography>
                        <Typography
                            color="textPrimary"
                            variant="h3"
                        >
                            {productTotal}
                        </Typography>
                    </Grid>

                </Grid>
                <Grid item>
                    <Avatar className={classes.dashboardavatar}>
                        <BorderAllIcon />
                    </Avatar>
                </Grid>
                <Box
                    mt={2}
                    display="flex"
                    alignItems="center"
                >
                    <ArrowUpwardIcon className={classes.differenceIcon} />
                    <Typography
                        className={classes.differenceValue}
                        variant="body2"
                    >
                        40%
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

export default TotalProducts;