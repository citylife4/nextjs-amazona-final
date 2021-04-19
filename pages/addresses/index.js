import { Alert } from '@material-ui/lab';
import {
    Box,
    Grid,
    Button,
    CircularProgress,
    Card,
    CardActionArea,
    Typography,
    ListItem,
    Link,
    CardActions,
    Slide,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Router from 'next/router';
import { useStyles } from '../../utils/styles';
import { Store } from '../../components/Store';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import { getErrorMessage } from '../../utils/error';
import DeleteIcon from '@material-ui/icons/Delete';
import NextLink from 'next/link';
import EditIcon from '@material-ui/icons/Edit';


function reducer(state, action) {
    switch (action.type) {
        case 'USER_ADDRESS_LIST_REQUEST':
            return { ...state, loading: true };
        case 'USER_ADDRESS_LIST_SUCCESS':
            return { ...state, loading: false, addresses: action.payload, success: true };
        case 'USER_ADDRESS_LIST_FAIL':
            return { ...state, loading: false, error: action.payload };


        case 'USER_ADDRESS_DELETE_REQUEST':
            return { ...state, loadingDelete: true };
        case 'USER_ADDRESS_DELETE_SUCCESS':
            return { ...state, loadingDelete: false, success: true };
        case 'USER_ADDRESS_DELETE_FAIL':
            return { ...state, loadingDelete: false, errorDelete: action.payload };
        case 'USER_ADDRESS_DELETE_RESET':
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


function Addresses(props) {
    const classes = useStyles();
    const [
        { loading, error, addresses, loadingDelete, errorDelete, successDelete },
        dispatch,
    ] = React.useReducer(reducer, {
        loading: true,
        loadingDelete: false,
        successDelete: false,
        errorDelete: '',
    });

    const { state } = useContext(Store);
    const { userInfo } = state;



    useEffect(() => {
        if (!userInfo) {
            return Router.push('/signin');
        }
        const fecthMyAddresses = async () => {
            dispatch({ type: 'USER_ADDRESS_LIST_REQUEST' });
            try {
                const { data } = await Axios.get(`/api/users/address`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'USER_ADDRESS_LIST_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'USER_ADDRESS_LIST_FAILL',
                    payload: getErrorMessage(err),
                });
            }
        };
        fecthMyAddresses();
    }, []);

    const handleCreateAddress = async () => {
        dispatch({ type: 'USER_ADDRESS_CREATE_REQUEST' });
        try {
            const { data } = await Axios.post(
                `/api/users/address`,
                {},
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({ type: 'USER_ADDRESS_CREATE_SUCCESS', payload: data });

            Router.push(`/addresses/${data.address._id}`);
        } catch (error) {
            dispatch({
                type: 'USER_ADDRESS_CREATE_FAIL',
                payload: getErrorMessage(error),
            });
        }
    }

    const deleteAddressHandler = async (address) => {
        if (!window.confirm('Are you sure to delete?')) {
            return;
        }
        dispatch({ type: 'USER_ADDRESS_DELETE_REQUEST' });
        try {
            const { data } = await Axios.delete(`/api/users/address/${address._id}`, {
                headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: 'USER_ADDRESS_DELETE_SUCCESS', payload: data });
        } catch (error) {
            dispatch({
                type: 'USER_ADDRESS_DELETE_FAIL',
                payload: getErrorMessage(error),
            });
        }
    };


    return (
        <Layout title="My Orders">
            <Grid container spacing={1}>
                <Grid item md={3}>
                    <ListItem href="#" >
                        <NextLink
                            href="/profile"
                        >
                            <Link
                                variant="body1"
                                color="inherit"
                                noWrap
                                href="/profile"
                            >
                                Account Setting
                            </Link>
                        </NextLink>
                    </ListItem>
                    <ListItem href="#">
                        <NextLink
                            href="/myorders"
                        >
                            <Link
                                variant="body1"
                                color="inherit"
                                noWrap
                                href="/myorders"
                            >
                                Order History
                            </Link>
                        </NextLink>
                    </ListItem>

                    <ListItem href="#" className={classes.selected}>
                        <NextLink
                            href="/addresses"
                        >
                            <Link
                                variant="body1"
                                color="inherit"
                                noWrap
                                href="/addresses"
                            >
                                Addresses
                            </Link>
                        </NextLink>
                    </ListItem>

                </Grid>
                <Grid item md={9}>
                    <Typography variant="h4" className={classes.mt2}>
                        {userInfo.name}'s' Profile &rsaquo; Addresses
                            </Typography>
                    <hr />
                    <Button
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleCreateAddress()}
                                            m-3
                                        >
                                            New Address
                                    </Button>
                    {loading ? (
                        <CircularProgress></CircularProgress>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : addresses && addresses.length == 0 ? (
                        <Alert severity="error" className={classes.mt2}>
                            No Addresses is registered.
                        </Alert>
                    ) : (
                                    <React.Fragment>

                                        {errorDelete && <Alert severity="error">{errorDelete}</Alert>}
                                        {loadingDelete && <CircularProgress />}
                                        {successDelete && (
                                            <Alert severity="success">Order deleted successfully</Alert>
                                        )}
                                       
                                        {addresses.map((address) => (
                                            <Slide direction="up" in={true} key={address._id}>

                                                <Card className={classes.mt1}>

                                                    <CardActionArea>
                                                        <address >
                                                            {address.fullName !== '' ? (
                                                                <React.Fragment>
                                                                    {address.isDefault && (
                                                                        <>
                                                                            <Typography variant="h6">Default Address</Typography> <br />
                                                                        </>
                                                                    )}
                                                                    {address.fullName}
                                                                    <br />
                                                                    {address.streetAddress}.<br />
                                                                    {address.city}
                                                                    <br />
                                                                    {address.postalCode}.<br />
                                                                    {address.states}({address.country}).
                                                                    <br />
                                                                    <strong>Phone:</strong> {address.phoneNumber}.<br />
                                                                    <strong>Deliver Instructions:</strong>
                                                                    {address.deliverInstructions}
                                                                    <br />
                                                                    <strong>Security code:</strong>
                                                                    {address.securityCode}
                                                                    <br />

                                                                </React.Fragment>
                                                            ) : (
                                                                    <Typography Variant="body1">
                                                                        Address is not valid. Click Edit to fix it.
                                                                    </Typography>
                                                                )}
                                                        </address>



                                                        <CardActions>
                                                            <NextLink
                                                                href={`/addresses/${address._id}`}
                                                            >
                                                                <Link href={`/addresses/${address._id}`}>
                                                                    <Button>
                                                                        <EditIcon
                                                                            style={{
                                                                                fontSize: "2rem",
                                                                                color: "green"
                                                                            }}

                                                                        />
                                                                    </Button>
                                                                </Link>

                                                            </NextLink>

                                                            <Button onClick={() => deleteAddressHandler(address)}>
                                                                <DeleteIcon
                                                                    style={{
                                                                        fontSize: "2rem",
                                                                        color: "red"
                                                                    }}
                                                                />
                                                            </Button>

                                                        </CardActions>
                                                    </CardActionArea>

                                                </Card>
                                            </Slide>
                                        ))}
                                    </React.Fragment>
                                )}
                </Grid>
            </Grid>
        </Layout>
    )

}


export default dynamic(() => Promise.resolve(Addresses), {
    ssr: false,
});

