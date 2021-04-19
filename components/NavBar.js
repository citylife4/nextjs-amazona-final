/* eslint-disable react/jsx-key */
import React, { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import AppBar from '@material-ui/core/AppBar';
import NextLink from 'next/link';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import MoreIcon from '@material-ui/icons/MoreVert';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {
  Toolbar,
  Badge,
  IconButton,
  Drawer,
  Link,
  MenuItem,
  Menu,
  Typography,
  ListItem,
  List,
  ListItemText,
  Box,
  InputBase,
  Divider,
  Tooltip,
  Button,
  Switch,
} from '@material-ui/core';
import { useStyles } from '../utils/styles';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { categories } from '../utils/sidebardata';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { signout } from '../utils/actions';
import axios from 'axios';
import Sidebar from './SideBar';
import SearchBar from 'material-ui-search-bar';

export default function NavBar({ darkMode, onDarkModeChanged }) {
  const classes = useStyles();

  const { state, dispatch } = useContext(Store);
  const {
    cart,
    wish,
    userInfo,
    subcategoriesinit,
    categories,
    departments,
  } = state;

  const [activeMenu, setActiveMenu] = useState(null);

  const fecthInit = async () => {
    dispatch({ type: 'INIT_LIST_REQUEST' });
    try {
      const { data } = await axios.get(`/api/products/init`);
      dispatch({ type: 'INIT_LIST_SUCCESS', payload: data });
    } catch (err) {
      dispatch({
        type: 'INIT_LIST_FAIL',
        payload: err.message, // getErrorMessage(err),
      });
    }
  };

  useEffect(() => {
    if (departments.length === 0) {
      fecthInit();
    }
  }, [departments]);

  const signoutHandler = () => {
    signout(dispatch);
  };

  const [sidbarVisible, setSidebarVisible] = React.useState(false);
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [adminAnchorEl, setAdminAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const isAdminMenuOpen = Boolean(adminAnchorEl);

  const handleAdminMenuOpen = (event) => {
    setAdminAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAdminAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const adminMenuId = 'primary-search-account-menu';

  const renderMenu = (
    <>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        {userInfo ? (
          <div>
            <MenuItem
              onClick={() => {
                Router.push('/profile');
                handleMenuClose();
              }}
            >
              Profile
            </MenuItem>
            <MenuItem onClick={signoutHandler}>Signout</MenuItem>
          </div>
        ) : (
          <MenuItem
            onClick={() => {
              Router.push('/signin');
              handleMenuClose();
            }}
          >
            Sign In
          </MenuItem>
        )}
      </Menu>

      <Menu
        anchorEl={adminAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={adminMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isAdminMenuOpen}
        onClose={handleMenuClose}
      >
        {userInfo && userInfo.isAdmin && (
          <MenuItem
            onClick={() => {
              Router.push('/admin/dashboard');
              handleMenuClose();
            }}
          >
            Dashboard
          </MenuItem>
        )}
      </Menu>
    </>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {userInfo ? (
        <div>
          <MenuItem>
            <IconButton
              aria-label="show 4 new mails"
              color="inherit"
              onClick={() => Router.push('/cart')}
            >
              {cart && cart.cartItems.length > 0 ? (
                <Badge badgeContent={cart.cartItems.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              ) : (
                <ShoppingCartOutlinedIcon />
              )}
            </IconButton>
            <p>Cart</p>
          </MenuItem>
          <Divider />
          <MenuItem>
            <IconButton
              aria-label="show 11 new notifications"
              color="inherit"
              onClick={() => Router.push('/wish')}
            >
              {wish && wish.wishItems.length > 0 ? (
                <Badge badgeContent={wish.wishItems.length} color="secondary">
                  <FavoriteIcon />
                </Badge>
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <p>Wish List</p>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>{userInfo.name}'s Profile</p>
          </MenuItem>
          <Divider />
          {userInfo && userInfo.isAdmin && (
            <MenuItem onClick={handleAdminMenuOpen}>
              <IconButton
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                color="inherit"
              >
                <DashboardIcon />
              </IconButton>
              <p>Admin Dashboard</p>
            </MenuItem>
          )}
        </div>
      ) : (
        <MenuItem
          onClick={() => {
            Router.push('/signin');
            handleMenuClose();
          }}
        >
          Sign In
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.navbar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={sidebarOpenHandler}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="left"
            open={sidbarVisible}
            onClose={sidebarCloseHandler}
            className={classes.sidebar}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={1}
              m={1}
            >
              <Typography variant="h6">Shopping by category</Typography>
              <IconButton aria-label="close" onClick={sidebarCloseHandler}>
                <CancelIcon />
              </IconButton>
            </Box>
            <Divider light />

            <Sidebar departments={departments} />
          </Drawer>
          <NextLink href="/">
            <Link href="/">
              <Typography variant="h3">amazona</Typography>
            </Link>
          </NextLink>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <form action="/search" className={classes.searchForm}>
              <InputBase
                name="query"
                className={classes.searchInput}
                placeholder="Search products"
                inputProps={{ 'aria-label': 'search products' }}
              />
              <IconButton
                type="submit"
                className={classes.iconButton}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </form>
          </div>

          <div className={classes.grow} />
          <Switch checked={darkMode} onChange={onDarkModeChanged} />
          <div className={classes.sectionDesktop}>
            <Tooltip title="Shopping Cart" arrow>
              <IconButton
                aria-label="show cart items"
                color="inherit"
                onClick={() => Router.push('/cart')}
              >
                {cart && cart.cartItems.length > 0 ? (
                  <Badge
                    badgeContent={cart.cartItems.reduce(
                      (a, c) => a + c.quantity,
                      0
                    )}
                    color="secondary"
                  >
                    <ShoppingCartIcon />
                  </Badge>
                ) : (
                  <ShoppingCartOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Wishlist" arrow>
              <IconButton
                aria-label="show wishlist items"
                color="inherit"
                onClick={() => Router.push('/wish')}
              >
                {wish && wish.wishItems.length > 0 ? (
                  <Badge badgeContent={wish.wishItems.length} color="secondary">
                    <FavoriteIcon />
                  </Badge>
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Profile" arrow>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>

            {userInfo && userInfo.isAdmin && (
              <Tooltip title="Dashboard" arrow>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleAdminMenuOpen}
                  color="inherit"
                >
                  <DashboardIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
