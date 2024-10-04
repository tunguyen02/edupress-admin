import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const RegisterCourse = () => {
    const [registrations, setRegistrations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:8080/api/register-course/registrations');
            setRegistrations(res.data);
        } catch (error) {
            message.error('Error fetching registrations: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = (record) => {
        setSelectedRegistration(record);
        setStatus(record.status);
        setModalVisible(true);
    };

    const handleSubmitStatusChange = async () => {
        if (!status) {
            message.error("Please select a status.");
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            message.error('No token provided. Please log in again.');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.put(
                `http://localhost:8080/api/register-course/registrations/${selectedRegistration._id}`,
                { status },
                config
            );
            message.success('Registration updated successfully');
            fetchRegistrations();
            setModalVisible(false);
        } catch (error) {
            message.error('Error updating registration: ' + (error.response?.data?.message || error.message));
        }
    };


    const handleCancel = () => {
        setModalVisible(false);
        setSelectedRegistration(null);
        setStatus("");
    };

    const columns = [
        {
            title: 'User Name',
            dataIndex: ['userId', 'userName'],
            key: 'userName',
        },
        {
            title: 'Course Title',
            dataIndex: ['courseId', 'name'],
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" onClick={() => handleApprove(record)}>
                    Approve/Reject
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h2>Course Registration Requests</h2>

            <Table
                columns={columns}
                dataSource={registrations}
                rowKey="_id"
                loading={isLoading}
            />

            <Modal
                title="Update Registration Status"
                visible={modalVisible}
                onCancel={handleCancel}
                onOk={handleSubmitStatusChange}
            >
                <Select
                    value={status}
                    onChange={(value) => setStatus(value)}
                    style={{ width: '100%' }}
                >
                    <Option value="Confirmed">Confirm</Option>
                    <Option value="Cancelled">Reject</Option>
                </Select>
            </Modal>
        </div>
    );
};

export default RegisterCourse;
