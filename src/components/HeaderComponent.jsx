import React from 'react';
import { Avatar, Button, Dropdown, Input, Space } from 'antd';
import { Notification, SearchNormal1 } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar.jpg';

const HeaderComponent = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.removeItem('accessToken');
        navigate('/');
    };

    const items = [
        {
            key: 'logout',
            label: 'Logout',
            onClick: handleLogout,
        },
    ];

    return (
        <div className='p-2 row bg-white m-0'>
            <div className='col'>
                <Input
                    placeholder='Search'
                    style={{ borderRadius: 100, width: '70%' }}
                    size='large'
                    prefix={<SearchNormal1 className='text-muted' size={20} />}
                />
            </div>
            <div className='col text-right'>
                <Space>
                    <Button
                        type='text'
                        icon={<Notification size={22} color={'grey'} />}
                    />
                    <Dropdown menu={{ items }}>
                        <Avatar src={avatar} size={40} />
                    </Dropdown>
                </Space>
            </div>
        </div>
    );
};

export default HeaderComponent;
