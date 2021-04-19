import React, { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';

export const Store = createContext();
const initialState = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : [],

    shippingAddress: Cookies.get('shippingAddress')
      ? JSON.parse(Cookies.get('shippingAddress'))
      : {},
    paymentMethod: Cookies.get('paymentMethod')
      ? Cookies.get('paymentMethod')
      : '',
  },
  wish: {
    wishItems: Cookies.get('wishItems')
      ? JSON.parse(Cookies.get('wishItems'))
      : [],
  },

  products: [],
  users: [],
  discount: 0,
  validAddressList: { loading: true },
  uploady: {},
  cities: [],
  subcategories: [],
  subcategoriesinit: [],
  categories: [],
  departments: [],
  brands: [],
  setting: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    case 'UPLOADY_FINISH_UPLOAD':
      return {
        ...state,
        uploady: {
          imageType: action.payload.imageType,
          imageUrl: action.payload.imageUrl,
        },
      };
    case 'CART_ADD_ITEM': {
      const item = action.payload;
      const existItem = state.cart.cartItems.find((x) => x.name === item.name);
      const cartItems = existItem
        ? state.cart.cartItems.map((x) =>
            x.name === existItem.name ? item : x
          )
        : [...state.cart.cartItems, item];
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }

    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (x) => x.name !== action.payload.name
      );
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }

    case 'CART_CLEAR':
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      };
    case 'CART_SAVE_SHIPPING':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'CART_SAVE_PAYMENT':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };

    case 'WISH_ADD_ITEM': {
      const item = action.payload;
      const existItem = state.wish.wishItems.find((x) => x.name === item.name);
      const wishItems = existItem
        ? state.wish.wishItems.map((x) =>
            x.name === existItem.name ? item : x
          )
        : [...state.wish.wishItems, item];
      Cookies.set('wishItems', JSON.stringify(wishItems));
      return {
        ...state,
        wish: {
          ...state.wish,
          wishItems,
        },
      };
    }

    case 'WISH_CLEAR':
      return {
        ...state,
        wish: {
          wishItems: [],
        },
      };

    case 'WISH_REMOVE_ITEM': {
      const wishItems = state.wish.wishItems.filter(
        (x) => x.name !== action.payload.name
      );
      Cookies.set('wishItems', JSON.stringify(wishItems));
      return {
        ...state,
        wish: {
          ...state.wish,
          wishItems,
        },
      };
    }

    case 'INIT_LIST_REQUEST':
      return { ...state, loadingInit: true };
    case 'INIT_LIST_SUCCESS':
      return {
        ...state,
        loadingInit: false,
        cities: action.payload.cities,
        categories: action.payload.categories,
        subcategoriesinit: action.payload.subcategory,
        brands: action.payload.brands,
        setting: action.payload.setting,
        departments: action.payload.departments,
      };
    case 'INIT_LIST_FAIL':
      return { ...state, loadingInit: false, errorInit: action.payload };

    case 'DEPARTMENT_SUB_CATEGORIES_LIST_REQUEST':
      return { ...state, loadingSubcategories: true };
    case 'DEPARTMENT_SUB_CATEGORIES_LIST_SUCCESS':
      return {
        ...state,
        loadingSubcategories: false,
        subcategories: action.payload,
      };
    case 'DEPARTMENT_SUB_CATEGORIES_LIST_FAIL':
      return {
        ...state,
        loadingSubcategories: false,
        errorSubcategories: action.payload,
      };

    case 'PRODUCT_LIST_REQUEST':
      return { ...state, loading: true };
    case 'PRODUCT_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        products: action.payload,
        cities: action.payload,
        pages: action.payload,
      };
    case 'PRODUCT_LIST_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'PRODUCT_DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'PRODUCT_DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'PRODUCT_DELETE_FAIL':
      return { ...state, loadingDelete: false, errorDelete: action.payload };
    case 'PRODUCT_DELETE_RESET':
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
        errorDelete: '',
      };

    case 'PRODUCT_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'PRODUCT_DETAILS_SUCCESS':
      return { ...state, loading: false, product: action.payload };
    case 'PRODUCT_DETAILS_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'PRODUCT_UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'PRODUCT_UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, successUpdate: true };
    case 'PRODUCT_UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'PRODUCT_UPDATE_RESET':
    case 'ORDER_APPLY_COUPON_REQUEST':
      return { ...state, loadingCoupon: true };
    case 'ORDER_APPLY_COUPON_SUCCESS':
      return {
        ...state,
        loadingCoupon: false,
        discount: action.payload.discount,
      };
    case 'ORDER_APPLY_COUPON_FAIL':
      return { ...state, loadingCoupon: false, errorCoupon: action.payload };
    case 'ORDER_APPLY_COUPON_RESET':
      return {};

    case 'USER_LIST_REQUEST':
      return { ...state, loading: true };
    case 'USER_LIST_SUCCESS':
      return { ...state, loading: false, users: action.payload };
    case 'USER_LIST_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'USER_DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'USER_DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'USER_DELETE_FAIL':
      return { ...state, loadingDelete: false, errorDelete: action.payload };
    case 'USER_DELETE_RESET':
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
        errorDelete: '',
      };

    case 'USER_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'USER_DETAILS_SUCCESS':
      return { ...state, loading: false, user: action.payload };
    case 'USER_DETAILS_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'USER_ADDRESS_VALID_LIST_REQUEST':
      return { ...state, validAddressList: { loading: true } };
    case 'USER_ADDRESS_VALID_LIST_SUCCESS':
      return {
        ...state,
        validAddressList: {
          loading: false,
          addresses: action.payload.addresses,
          countries: action.payload.countries,
        },
      };
    case 'USER_ADDRESS_VALID_LIST_FAIL':
      return {
        ...state,
        validAddressList: {
          error: action.payload,
        },
      };

    case 'USER_UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'USER_UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, successUpdate: true };
    case 'USER_UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'USER_UPDATE_RESET':
      return {
        ...state,
        loadingUpdate: false,
        successUpdate: false,
        errorUpdate: '',
      };

    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    default:
      return state;

    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
      };
  }
}
export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
