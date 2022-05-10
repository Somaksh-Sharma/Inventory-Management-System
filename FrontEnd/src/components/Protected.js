import React from 'react';
import { Navigate, Outlet } from '../../node_modules/react-router/index';
import Cookies from 'js-cookie';

const Protected = () => {
  const userDetails = Cookies.get('user');

  let isAuth = userDetails ? true : false;

  if (userDetails === undefined) isAuth = false;
  else isAuth = true;
  // isAuth = true;

  return isAuth ? <Outlet /> : <Navigate to={'/login'} />;
};

export default Protected;
