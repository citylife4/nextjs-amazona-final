import { Alert } from '@material-ui/lab';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Slide,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    InputBase,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import Layout from '../../components/Layout';
import Router from 'next/router';
import { Store } from '../../components/Store';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import { getErrorMessage } from '../../utils/error';
import Link from 'next/link';
import AdminSidebar from '../../components/AdminSideBar';
import { curr } from '../../utils/config';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import { useStyles } from '../../utils/styles';
import { useRouter } from 'next/router';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SearchIcon from '@material-ui/icons/Search';
import dayjs from 'dayjs';

function reducer(state, action) {
    switch (action.type) {
        case 'ORDER_HISTORY_REQUEST':
            return { ...state, loading: true };
        case 'ORDER_HISTORY_SUCCESS':
            return { ...state, loading: false, orders: action.payload };
        case 'ORDER_HISTORY_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'ORDER_DELETE_REQUEST':
            return { ...state, loadingDelete: true };
        case 'ORDER_DELETE_SUCCESS':
            return { ...state, loadingDelete: false, successDelete: true };
        case 'ORDER_DELETE_FAIL':
            return { ...state, loadingDelete: false, errorDelete: action.payload };
        case 'ORDER_DELETE_RESET':
            return {
                ...state,
                loadingDelete: false,
                successDelete: false,
                errorDelete: '',
            };
        default:
            return state;
    }
}

function Orders() {
    const classes = useStyles();
    const [
        { loading, error, orders, loadingDelete, errorDelete, successDelete },
        dispatch,
    ] = React.useReducer(reducer, {
        loading: true,
        loadingDelete: false,
        successDelete: false,
        errorDelete: '',
    });

    const { state } = useContext(Store);
    const { userInfo } = state;

    const router = useRouter();
    const { query = 'all' } = router.query;

    useEffect(() => {
        if (!userInfo) {
            return Router.push('/signin');
        }
        const fecthOrders = async () => {
            dispatch({ type: 'ORDER_HISTORY_REQUEST', payload: { query: '' } });
            try {
                const { data } = await Axios.get(`/api/orders/history?query=${query}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'ORDER_HISTORY_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'ORDER_HISTORY_FAIL',
                    payload: getErrorMessage(err),
                });
            }
        };
        fecthOrders();
    }, [successDelete, query]);

    const deleteOrderHandler = async (order) => {
        if (!window.confirm('Are you sure to delete?')) {
            return;
        }
        dispatch({ type: 'ORDER_DELETE_REQUEST' });
        try {
            const { data } = await Axios.delete(`/api/orders/${order._id}`, {
                headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: 'ORDER_DELETE_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'ORDER_DELETE_FAIL', payload: getErrorMessage(error) });
        }
    };

   console.log(orders);

    return (
        <Layout title="Order History">
            <Grid container spacing={1}>
                <Grid item md={3}>
                    <AdminSidebar selected="orders" />
                </Grid>

                <Grid item md={9}>
                    {loading ? (
                        <CircularProgress></CircularProgress>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                                <Paper className={classes.p1}>
                                    <Typography component="h4" variant="h4">
                                        Transactions &rsaquo; Order History
                                                </Typography>
                                                <Grid
                                                    container
                                                    alignItems="center"
                                                    className={classes.justifyContentSpaceBetween}
                                                >
                                                     <Grid item>
                                                     {orders.length === 0 ? 'No' : orders.length} Results {query !== 'all' && query !== '' && ' : ' + query}
                                                        {(query !== 'all' && query !== '') ? (
                                                            <Button onClick={() => router.push('/admin/orders')}>
                                                                <HighlightOffIcon /> Filter
                                                            </Button>
                                                        ) : null}
                                                    </Grid>

                                                    <Grid>
                                                    <form action="/admin/orders">
                                                        <div className={classes.search}>
                                                        <div className={classes.searchIcon}>
                                                            <SearchIcon />
                                                        </div>
                                                        <InputBase
                                                            placeholder="Search Orders here…"
                                                            name="query"
                                                            classes={{
                                                            root: classes.inputRoot,
                                                            input: classes.inputInput,
                                                            }}
                                                            inputProps={{ 'aria-label': 'search' }}
                                                        />
                                                        </div>
                                                    </form>
                                                    </Grid>

                                                </Grid>    


                                    {errorDelete && <Alert severity="error">{errorDelete}</Alert>}
                                    {loadingDelete && <CircularProgress />}
                                    {successDelete && (
                                        <Alert severity="success">Order deleted successfully</Alert>
                                    )}

                                    <Slide direction="up" in={true}>
                                        <TableContainer>
                                            <Table aria-label="Orders">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Order Id</TableCell>
                                                        <TableCell>Item</TableCell>
                                                        <TableCell>Item Price</TableCell>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell align="right">Total Price</TableCell>
                                                        <TableCell align="right">Total Buy </TableCell>
                                                        <TableCell>Buyer</TableCell>
                                                        <TableCell>Paid</TableCell>
                                                        <TableCell>Mode</TableCell>
                                                        <TableCell>Delivered</TableCell>
                                                        <TableCell>Canceled</TableCell>
                                                        <TableCell>Refunded</TableCell>
                                                        <TableCell>Action</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {orders.map((order) => (
                                                        <TableRow key={order._id}>
                                                            <TableCell component="th" scope="row">
                                                                {order._id}
                                                            </TableCell>
                                                            <TableCell>
                                                                {order.orderItems.map((item) => (

                                                                    <p>{item.name}</p>

                                                                ))}
                                                            </TableCell>
                                                            <TableCell>
                                                                {order.orderItems.map((item) => (
                                                                    <p>{curr}{item.price}</p>
                                                                ))}
                                                            </TableCell>
                                                            <TableCell>
                                                            {dayjs(order.createdAt).format('DD-MMM-YYYY', {
                                                                timeZone: 'UTC',
                                                            })}
                                                            </TableCell>
                                                            <TableCell align="right">{curr}{order.totalPrice}</TableCell>
                                                            <TableCell align="right">{curr}{order.totalBuyPrice}</TableCell>
                                                            <TableCell>{order.user.name}</TableCell>
                                                            <TableCell>
                                                                {order.isPaid ? dayjs(order.paidAt).format('DD-MMM-YYYY', {
                                                                timeZone: 'UTC',
                                                                  })
                                                                    :
                                                                    <ClearOutlinedIcon
                                                                        style={{ color: 'red', fontSize: 25 }}
                                                                    />

                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                              {order.paymentMethod}
                                                            </TableCell>
                                                            <TableCell>
                                                                {order.isDelivered
                                                                    ? dayjs(order.deliveredAt).format('DD-MMM-YYYY', {
                                                                        timeZone: 'UTC',
                                                                          })
                                                                    
                                                                    :
                                                                    <ClearOutlinedIcon
                                                                        style={{ color: 'red', fontSize: 25 }}
                                                                    />
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {order.isCanceled
                                                                    ? 
                                                                    dayjs(order.canceledAt).format('DD-MMM-YYYY', {
                                                                        timeZone: 'UTC',
                                                                          })
                                                                    
                                                                    :
                                                                    <ClearOutlinedIcon
                                                                        style={{ color: 'red', fontSize: 25 }}
                                                                    />
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {order.isRefunded
                                                                    ? 
                                                                    dayjs(order.refundedAt).format('DD-MMM-YYYY', {
                                                                        timeZone: 'UTC',
                                                                          })
                                                                    :
                                                                    <ClearOutlinedIcon
                                                                        style={{ color: 'red', fontSize: 25 }}
                                                                    />
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <Link href={`/orders/${order._id}`}>
                                                                    <Button>Details</Button>
                                                                </Link>
                                                                <Button onClick={() => deleteOrderHandler(order)}>
                                                                    <DeleteForeverIcon
                                                                        style={{ color: 'red', fontSize: 35 }}
                                                                    />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Slide>
                                </Paper>
                            )}
                </Grid>
            </Grid>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(Orders), {
    ssr: false,
});
