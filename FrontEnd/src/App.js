// project import
// import Routes from 'routes';
import { Routes, Route, Navigate } from 'react-router-dom';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import Protected from 'components/Protected';

import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const RecentOrders = Loadable(
  lazy(() => import('pages/components-overview/RecentOrders'))
);
const Profile = Loadable(
  lazy(() => import('pages/components-overview/Profile'))
);
const SalesReport = Loadable(
  lazy(() => import('pages/components-overview/SalesReport'))
);
const Products = Loadable(
  lazy(() => import('pages/components-overview/stocks'))
);
const CreateStock = Loadable(
  lazy(() => import('pages/components-overview/CreateStock'))
);
const SoldStock = Loadable(
  lazy(() => import('pages/components-overview/SoldStocks'))
);
const PurchasedStock = Loadable(
  lazy(() => import('pages/components-overview/PurchasedStocks'))
);
const Bills = Loadable(lazy(() => import('pages/components-overview/Bill')));
const Receipts = Loadable(
  lazy(() => import('pages/components-overview/Receipts'))
);

const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(
  lazy(() => import('pages/authentication/Register'))
);

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      {/* <Routes /> */}
      <Routes>
        <Route path="/" element={<MinimalLayout />}>
          <Route exact path="login" element={<AuthLogin />} />
          <Route exact path="register" element={<AuthRegister />} />
        </Route>
        <Route element={<Protected />}>
          <Route exact path="/home" element={<MainLayout />}>
            <Route exact path="dashboard" element={<DashboardDefault />} />
            <Route exact path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
