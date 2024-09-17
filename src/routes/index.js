import Home from '../pages/Home'
import Categories from '../pages/Categories'
import AddCategory from '../pages/AddCategory'
import Course from '../pages/Course'
import ManageStore from '../pages/ManageStore'
import Orders from '../pages/Orders'
import Report from '../pages/Report'
import AddCourse from '../pages/AddCourse'
import Users from '../pages/Users'

export const routes = [
    {
        path: '/admin/dashboard',
        page: Home,
    },
    {
        path: '/admin/course',
        page: Course,
    },
    {
        path: '/admin/course/add-course',
        page: AddCourse,
    },
    {
        path: '/admin/categories',
        page: Categories,
    },
    {
        path: '/admin/categories/add-category',
        page: AddCategory,
    },
    {
        path: '/admin/report',
        page: Report,
    },
    {
        path: '/admin/manage-store',
        page: ManageStore,
    },
    {
        path: '/admin/orders',
        page: Orders,
    },
    {
        path: '/admin/users',
        page: Users,
    }
]