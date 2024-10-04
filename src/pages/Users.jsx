import { Table, message, Empty, Button, Modal, Form, Input, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        getUsers();
    }, [page, pageSize]);

    const getUsers = async () => {
        const api = `http://localhost:8080/api/user/getUser?page=${page}&pageSize=${pageSize}`;
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

    const handleDelete = async (userId) => {
        const token = localStorage.getItem('accessToken');

        try {
            await axios.delete(`http://localhost:8080/api/user/delete/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            message.success('User deleted successfully!');
            getUsers();
        } catch (error) {
            message.error('Error deleting user: ' + (error.response?.data?.message || error.message));
        }
    };


    const handleCreateAdmin = async (values) => {
        try {
            const token = localStorage.getItem('accessToken');

            await axios.post('http://localhost:8080/api/user/createAdmin', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            message.success('Admin created successfully!');
            form.resetFields();
            setIsModalVisible(false);
            getUsers();
        } catch (error) {
            message.error('Failed to create admin: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Create Admin
            </Button>
            <Modal
                title="Create Admin"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateAdmin}>
                    <Form.Item
                        label="Username"
                        name="userName"
                        rules={[{ required: true, message: 'Please input the username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input the email!' }, { type: 'email', message: 'Invalid email format!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input the password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create Admin
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {users.length > 0 ? (
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
                        {
                            title: 'Action',
                            key: 'action',
                            render: (_, record) => (
                                <Popconfirm
                                    title="Are you sure you want to delete this user?"
                                    onConfirm={() => handleDelete(record._id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <DeleteOutlined style={{ color: 'black', cursor: 'pointer' }} />
                                </Popconfirm>
                            ),
                        },
                    ]}
                />
            ) : (
                <Empty />
            )}
        </>
    );
};

export default Users;
