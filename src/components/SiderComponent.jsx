import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Home2, ProfileCircle } from 'iconsax-react';
import { MdOutlineInventory } from 'react-icons/md';
import { FaTags } from 'react-icons/fa';
import logo from '../assets/logo.svg';

const { Sider } = Layout;
const { Text } = Typography;

const SiderComponent = () => {
    const items = [
        {
            key: 'dashboard',
            label: <Link to={'/admin/dashboard'}>Dashboard</Link>,
            icon: <Home2 size={20} />,
        },
        {
            key: 'course',
            label: 'Course',
            icon: <MdOutlineInventory size={20} />,
            children: [
                {
                    key: 'course-all',
                    label: <Link to={'/admin/course'}>All</Link>,
                },
                {
                    key: 'add-course',
                    label: <Link to={`/admin/course/add-course`}>Add course</Link>,
                },
            ],
        },
        {
            key: 'register-course',
            label: <Link to={'/admin/register-course'}>Register Course</Link>,
            icon: <FaTags size={20} className='text-muted' />,
        },
        {
            key: 'users',
            label: <Link to={'/admin/users'}>Users</Link>,
            icon: <ProfileCircle size={20} />,
        },
    ];

    return (
        <Sider width={280} style={{ height: '100vh' }}>
            <div className='p-2 d-flex sider-logo'>
                <img src={logo} alt='Logo' width={48} />
                <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'tomato',
                        margin: 0,
                    }}>
                    EduPress
                </Text>
            </div>
            <Menu mode='inline' items={items} theme='light' />
        </Sider>
    );
};

export default SiderComponent;
