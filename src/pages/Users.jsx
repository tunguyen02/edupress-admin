import { Table, message, Empty } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        getUsers();
    }, [page, pageSize]);

    const getUsers = async () => {
        const api = `http://localhost:8080/api/user?page=${page}&pageSize=${pageSize}`;
        setIsLoading(true);

        try {
            console.log("Fetching users...");
            const res = await axios.get(api);

            if (Array.isArray(res.data)) {
                const items = res.data.map((item, index) => ({
                    index: (page - 1) * pageSize + (index + 1),
                    ...item,
                }));
                setUsers(items);
                setTotal(res.data.length);
            } else {
                message.error('Data format is incorrect.');
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            message.error('Error fetching users: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    return users.length > 0 ? (
        <Table
            dataSource={users}
            rowKey='_id'
            loading={isLoading}
            pagination={{
                current: page,
                pageSize: pageSize,
                total: total,
                onChange: (page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                },
            }}
            columns={[
                {
                    title: 'Index',
                    dataIndex: 'index',
                    key: 'index',
                },
                {
                    title: 'Username',
                    dataIndex: 'userName',
                    key: 'userName',
                },
                {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email',
                },
                {
                    title: 'Role',
                    dataIndex: 'role',
                    key: 'role',
                },
            ]}
        />
    ) : (
        <Empty />
    );
};

export default Users;
