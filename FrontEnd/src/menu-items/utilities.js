// assets
import {
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined
} from '@ant-design/icons';

// icons
const icons = {
    FontSizeOutlined,
    BgColorsOutlined,
    BarcodeOutlined,
    AntDesignOutlined,
    LoadingOutlined,
    AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Utilities',
    type: 'group',
    children: [
        {
            id: 'util-recent-orders',
            title: 'Recent Orders',
            type: 'item',
            url: '/recent-orders',
            icon: icons.FontSizeOutlined
        },
        {
            id: 'util-profile',
            title: 'Profile',
            type: 'item',
            url: '/profile',
            icon: icons.BgColorsOutlined
        },
        {
            id: 'util-sales-report',
            title: 'Sales-report',
            type: 'item',
            url: '/sales-report',
            icon: icons.BarcodeOutlined
        }
        // {
        //     id: 'ant-icons',
        //     title: 'Ant Icons',
        //     type: 'item',
        //     url: '/icons/ant',
        //     icon: icons.AntDesignOutlined,
        //     breadcrumbs: false
        // }
    ]
};

export default utilities;
