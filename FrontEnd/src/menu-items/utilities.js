// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    // {
    //   id: 'util-recent-orders',
    //   title: 'Current Stocks',
    //   type: 'item',
    //   url: '/home/current-stocks',
    //   icon: icons.FontSizeOutlined,
    // },
    {
      id: 'util-recent-orders',
      title: 'Recent Orders',
      type: 'item',
      url: '/home/recent-orders',
      icon: icons.FontSizeOutlined,
    },
    {
      id: 'util-profile',
      title: 'Profile',
      type: 'item',
      url: '/home/profile',
      icon: icons.BgColorsOutlined,
    },
    {
      id: 'util-sales-report',
      title: 'Sales-report',
      type: 'item',
      url: '/home/sales-report',
      icon: icons.BarcodeOutlined,
    },
    {
      id: 'util-stocks',
      title: 'Products',
      type: 'item',
      url: '/home/products',
      icon: icons.AntDesignOutlined,
      breadcrumbs: false,
    },
    {
      id: 'util-stocks-sold',
      title: 'Products Sold',
      type: 'item',
      url: '/home/products-sold',
      icon: icons.AntDesignOutlined,
      breadcrumbs: false,
    },
    {
      id: 'util-stocks-purchased',
      title: 'Products Purchased',
      type: 'item',
      url: '/home/products-purchased',
      icon: icons.AntDesignOutlined,
      breadcrumbs: false,
    },
    {
      id: 'util-bills',
      title: 'Bills',
      type: 'item',
      url: '/home/bills',
      icon: icons.BarcodeOutlined,
      breadcrumbs: false,
    },
    {
      id: 'util-reciepts',
      title: 'Receipts',
      type: 'item',
      url: '/home/receipts',
      icon: icons.BarcodeOutlined,
      breadcrumbs: false,
    },
  ],
};

export default utilities;
