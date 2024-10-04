import Home from '../pages/Home'
import Course from '../pages/Course'
import AddCourse from '../pages/AddCourse'
import Users from '../pages/Users'
import RegisterCourse from '../pages/RegisterCourse'
import EditCourse from '../pages/EditCourse'

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
        path: '/admin/register-course',
        page: RegisterCourse,
    },
    {
        path: '/admin/users',
        page: Users,
    },
    {
        path: '/admin/course/edit/:courseId',
        page: EditCourse
    },
]