import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { SoldStocks } from 'pages/components-overview/SoldStocks';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const RecentOrders = Loadable(lazy(() => import('pages/components-overview/RecentOrders')));
const Profile = Loadable(lazy(() => import('pages/components-overview/Profile')));
const SalesReport = Loadable(lazy(() => import('pages/components-overview/SalesReport')));
const Products = Loadable(lazy(() => import('pages/components-overview/stocks')));
const CreateStock = Loadable(lazy(() => import('pages/components-overview/CreateStock')));
const SoldStock = Loadable(lazy(() => import('pages/components-overview/SoldStocks')));
const PurchasedStock = Loadable(lazy(() => import('pages/components-overview/PurchasedStocks')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'profile',
            element: <Profile />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        },
        {
            path: 'sales-report',
            element: <SalesReport />
        },
        {
            path: 'recent-orders',
            element: <RecentOrders />
        },
        {
            path: 'products',
            element: <Products />
        },
        {
            path: 'dashboard/createstock',
            element: <CreateStock />
        },
        {
            path: 'products-sold',
            element: <SoldStock />
        },
        {
            path: 'products-purchased',
            element: <PurchasedStock />
        }
    ]
};

export default MainRoutes;
