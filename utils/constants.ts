import { BiCategoryAlt, BiStore } from "react-icons/bi";
import { FaBoxes, FaUser, FaWindowRestore } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { IoReorderFourSharp } from "react-icons/io5";
import { MdOutlineManageHistory } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";


const communLinks = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: RxDashboard,
    },
];

const adminLinks = [
    {
        title: 'Manage Categories',
        path: '/admin/manage-categories',
        icon: BiCategoryAlt,
    },
    {
        title: 'Manage Products',
        path: '/admin/manage-products',
        icon: FaBoxes,
    },
    {
        title: 'Manage Requests',
        path: '/admin/manage-requests',
        icon: MdOutlineManageHistory,
    },
    {
        title: 'Manage Users',
        path: '/admin/users',
        icon: FaUser,
    },
    {
        title: 'Manage Stores',
        path: '/admin/manage-stores',
        icon: FaWindowRestore,
    },
    {
        title: 'Orders',
        path: '/admin/orders',
        icon: IoReorderFourSharp,
    },
    {
        title: 'Transactions',
        path: '/admin/transactions',
        icon: GrTransaction,
    }

];

const sellerLinks = [
    {
        title: 'Products Catalog',
        path: '/seller/products',
        icon: BiStore,
    },
    {
        title: 'Stores',
        path: '/seller/stores',
        icon: FaWindowRestore,
    },
    {
        title: 'Orders',
        path: '/seller/orders',
        icon: IoReorderFourSharp,
    },
    {
        title: 'Transactions',
        path: '/seller/transactions',
        icon: GrTransaction,
    }
];

const supplierLinks = [
    {
        title: 'Products',
        path: '/supplier/products',
        icon: FaBoxes,
    },
    {
        title: 'Orders',
        path: '/supplier/orders',
        icon: IoReorderFourSharp,
    },
    {
        title: 'Transactions',
        path: '/supplier/transactions',
        icon: GrTransaction,
    }
];

export { adminLinks, sellerLinks, supplierLinks, communLinks };

