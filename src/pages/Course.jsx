import { Table, message, Empty, Button } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Course = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        getCourses();
    }, [page, pageSize]);

    const getCourses = async () => {
        const api = `http://localhost:8080/api/course/get-courses?page=${page}&limit=${pageSize}`;
        setIsLoading(true);

        try {
            console.log("Fetching courses...");
            const res = await axios.get(api);

            if (res.data?.courses && typeof res.data.totalCourses === 'number') {
                const items = res.data.courses.map((item, index) => ({
                    index: (page - 1) * pageSize + (index + 1),
                    ...item,
                }));
                setCourses(items);
                setTotal(res.data.totalCourses);
            } else {
                message.error('Data format is incorrect.');
                setCourses([]);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            message.error('Error fetching courses: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        const token = localStorage.getItem('accessToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            await axios.delete(`http://localhost:8080/api/course/delete/${courseId}`, config);
            message.success('Course deleted successfully!');
            setCourses((prevCourses) => prevCourses.filter(course => course._id !== courseId));
        } catch (error) {
            message.error('Error deleting course: ' + (error.response?.data?.message || error.message));
        }
    };

    const navigate = useNavigate();

    const handleEdit = (courseId) => {
        navigate(`/admin/course/edit/${courseId}`);
    };

    return courses.length > 0 ? (
        <>
            <Table
                dataSource={courses}
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
                        title: 'Image',
                        dataIndex: 'image',
                        key: 'image',
                        render: (image) =>
                            image ? (
                                <img
                                    src={image}
                                    alt="Course"
                                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                                />
                            ) : (
                                <span>No Image</span>
                            ),
                    },
                    {
                        title: 'Course Title',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: 'Level',
                        dataIndex: 'level',
                        key: 'level',
                    },
                    {
                        title: 'Price',
                        dataIndex: 'price',
                        key: 'price',
                    },
                    {
                        title: 'Discount',
                        dataIndex: 'discountPrice',
                        key: 'discountPrice',
                    },
                    {
                        title: 'Actions',
                        key: 'actions',
                        render: (_, record) => (
                            <>
                                <Button
                                    icon={<EditOutlined style={{ color: 'black' }} />}
                                    onClick={() => handleEdit(record._id)}
                                    style={{ marginRight: 8 }}
                                />
                                <Button
                                    icon={<DeleteOutlined style={{ color: 'black' }} />}
                                    onClick={() => handleDelete(record._id)}
                                    danger
                                />
                            </>
                        ),
                    },
                ]}
            />
        </>
    ) : (
        <Empty />
    );
};

export default Course;
