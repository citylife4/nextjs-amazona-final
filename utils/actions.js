import Cookies from 'js-cookie';
import { USER_SIGNOUT } from './constants';

export const signout = (dispatch) => {
  dispatch({ type: USER_SIGNOUT });
  Cookies.remove('userInfo');
  Cookies.remove('cartItems');
  Cookies.remove('wishItems');
  Cookies.remove('shippingAddress');
  Cookies.remove('paymentMethod');
  document.location.href = '/signin';
};
