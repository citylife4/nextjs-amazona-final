import { Alert } from '@material-ui/lab';
import {
    Box,
    Grid,
    Button,
    CircularProgress,
    TextField,
    Typography,
    ListItem,
    Slide,
    Link
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Router from 'next/router';
import { useStyles } from '../../utils/styles';
import { Store } from '../../components/Store';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import { getErrorMessage } from '../../utils/error';
import NextLink from 'next/link';




function reducer(state, action) {
    switch (action.type) {
        case 'USER_ADDRESS_DETAILS_REQUEST':
            return { ...state, loading: true };
        case 'USER_ADDRESS_DETAILS_SUCCESS':
            return { ...state, loading: false, address: action.payload };
        case 'USER_ADDRESS_DETAILS_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'USER_ADDRESS_UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'USER_ADDRESS_UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false, successUpdate: true };
        case 'USER_ADDRESS_UPDATE_FAIL':
            return { ...state, loadingUpdate: false, errorUpdate: action.payload };
        case 'USER_ADDRESS_UPDATE_RESET':
            return {
                ...state,
                loadingUpdate: false,
                successUpdate: false,
                errorUpdate: '',
            };

        default:
            return state;
    }
}



function Address({ params }) {
    const classes = useStyles();
    const addressId = params.id;
    const [
        { loading, error, address, loadingUpdate, errorUpdate, successUpdate },
        dispatch,
    ] = React.useReducer(reducer, {
        loading: true,
        loadingUpdate: false,
        successUpdate: false,
        errorUpdate: '',
    });

    const { state } = useContext(Store);
    const { userInfo } = state;


    const [fullName, setFullName] = useState('');
    const [country, setCountry] = useState('India');
    const [streetAddress, setStreetAddress] = useState('');
    const [isDefault, setIsDefault] = useState('');
    const [city, setCity] = useState('');
    const [states, setStates] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [deliverInstructions, setDeliverInstructions] = useState('');
    const [securityCode, setSecurityCode] = useState('');




    useEffect(() => {
        if (!userInfo) {
            return Router.push('/signin');
        }
        const fecthMyAddress = async () => {
            dispatch({ type: 'USER_ADDRESS_DETAILS_REQUEST' });
            try {
                const { data } = await Axios.get(`/api/users/address/${addressId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'USER_ADDRESS_DETAILS_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'USER_ADDRESS_DETAILS_FAIL',
                    payload: getErrorMessage(err),
                });
            }
        };
        if (address) {
            setFullName(address.fullName || '');
            setCity(address.city || '');
            setIsDefault(address.isDefault || false);
            setCountry(address.country || '');
            setPostalCode(address.postalCode || '');
            setDeliverInstructions(address.deliverInstructions || '');
            setStreetAddress(address.streetAddress || '');
            setSecurityCode(address.securityCode || '');
            setPhoneNumber(address.phoneNumber || '');
            setStates(address.states || '');
        } else {
            fecthMyAddress();
        }
    }, [address]);

    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch({ type: 'USER_ADDRESS_UPDATE_REQUEST' });
        try {
            const { data } = await Axios.put(
                `/api/users/address/${address._id}`,
                { fullName, country, streetAddress, city, postalCode, phoneNumber, states, deliverInstructions, securityCode, isDefault },
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({ type: 'USER_ADDRESS_UPDATE_SUCCESS', payload: data });
            Router.push('/addresses');
        } catch (error) {
            dispatch({
                type: 'USER_ADDRESS_UPDATE_FAIL',
                payload: getErrorMessage(error),
            });
        }
    };


    return (
        <Layout title="Edit Address">

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
                    {loading ? (
                        <CircularProgress></CircularProgress>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                                <React.Fragment>
                                    <Slide direction="up" in={true}>
                                        <form className={classes.form} onSubmit={submitHandler}>
                                            <Typography  variant="h4">
                                                Edit Address  &rsaquo; {address._id.substring(18, 24)}
                                            </Typography>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                label="Full Name"
                                                name="fullName"
                                                autoFocus
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                            />
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                label="Steet Address"
                                                name="streetAddress"
                                                autoFocus
                                                value={streetAddress}
                                                onChange={(e) => setStreetAddress(e.target.value)}
                                            />
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                label="Country"
                                                name="country"
                                                value={country}
                                                type="country"
                                                onChange={(e) => setCountry(e.target.value)}
                                            />
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                label="City"
                                                name="city"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                            />
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                label="States"
                                                name="states"
                                                value={states}
                                                onChange={(e) => setStates(e.target.value)}
                                            />
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                label="Postal Code"
                                                name="postalCode"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                            />
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                label="Phone Number"
                                                name="phoneNumber"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />

                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                label="Delivery Instructions"
                                                name="deliverInstructions"
                                                value={deliverInstructions}
                                                onChange={(e) => setDeliverInstructions(e.target.value)}
                                            />

                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                label="Security Code"
                                                name="securityCode"
                                                value={securityCode}
                                                onChange={(e) => setSecurityCode(e.target.value)}
                                            />

                                            <Box>
                                                <label htmlFor="isDefault">Default Address?</label>
                                                <input
                                                    type="checkbox"
                                                    name="isDefault"
                                                    checked={isDefault}
                                                    id="isDefault"
                                                    onChange={(e) => setIsDefault(e.target.checked)}
                                                ></input>
                                            </Box>


                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}
                                            >
                                                Update
                                            </Button>
                                            <Box>
                                                {loadingUpdate && <CircularProgress></CircularProgress>}
                                                {errorUpdate && <Alert severity="error">{errorUpdate}</Alert>}
                                                {successUpdate && (

                                                    <Alert severity="success">
                                                        Address updated successfully.
                                                    </Alert>

                                                )}
                                            </Box>
                                        </form>
                                    </Slide>
                                </React.Fragment>
                            )}
                </Grid>
            </Grid>





        </Layout>
    );
}
export async function getServerSideProps({ params }) {
    return {
        props: { params },
    };
}

export default dynamic(() => Promise.resolve(Address), {
    ssr: false,
});
