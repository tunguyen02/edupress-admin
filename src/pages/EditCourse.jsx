import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Modal, Table, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCourse = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [addLessonModalVisible, setAddLessonModalVisible] = useState(false);
    const [lessonData, setLessonData] = useState({
        id: '',
        order: '',
        title: '',
        description: '',
        videos: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        getCourseDetails();
    }, [courseId]);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/lesson?courseId=${courseId}`);
                setLessons(response.data);
            } catch (error) {
                console.error('Error fetching lessons:', error);
            }
        };
        fetchLessons();
    }, [courseId]);

    const getCourseDetails = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/course/detail/${courseId}`);
            setCourse(res.data);
            setLessons(res.data.lessons || []);
        } catch (error) {
            message.error('Error fetching course details: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateCourse = async (values) => {
        const token = localStorage.getItem('accessToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            await axios.put(`http://localhost:8080/api/course/update/${courseId}`, values, config);
            message.success('Course updated successfully!');
            navigate('/admin/course');
        } catch (error) {
            message.error('Error updating course: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleModalOk = async () => {
        if (!lessonData.order || !lessonData.title || !lessonData.description) {
            message.error('Please fill in all required fields for the lesson');
            return;
        }

        const newLesson = {
            order: lessonData.order,
            title: lessonData.title,
            description: lessonData.description,
            videos: lessonData.videos,
            courseId: courseId,
        };

        const token = localStorage.getItem('accessToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            if (lessonData.id) {
                await axios.put(`http://localhost:8080/api/lesson/${lessonData.id}`, newLesson, config);
                message.success('Lesson updated successfully');
            } else {
                // Thêm lesson mới
                await axios.post('http://localhost:8080/api/lesson/add-lesson', newLesson, config);
                message.success('Lesson added successfully');
            }

            setAddLessonModalVisible(false);
            setLessonData({
                id: '',
                order: '',
                title: '',
                description: '',
                videos: []
            });
            getCourseDetails();
        } catch (error) {
            message.error('Failed to save lesson: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleModalCancel = () => {
        setAddLessonModalVisible(false);
        setLessonData({
            id: '',
            order: '',
            title: '',
            description: '',
            videos: []
        });
    };

    const handleAddVideo = () => {
        setLessonData({
            ...lessonData,
            videos: [...lessonData.videos, { title: '', url: '', duration: '' }]
        });
    };

    const handleVideoChange = (index, field, value) => {
        const updatedVideos = [...lessonData.videos];
        updatedVideos[index][field] = value;
        setLessonData({
            ...lessonData,
            videos: updatedVideos
        });
    };

    const handleRemoveVideo = (index) => {
        const updatedVideos = lessonData.videos.filter((_, i) => i !== index);
        setLessonData({
            ...lessonData,
            videos: updatedVideos
        });
    };

    const handleEditLesson = (record) => {
        setLessonData({
            id: record._id,
            order: record.order,
            title: record.title,
            description: record.description,
            videos: record.videos || [],
        });
        setAddLessonModalVisible(true);
    };

    const handleDeleteLesson = async (id) => {
        const token = localStorage.getItem('accessToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            await axios.delete(`http://localhost:8080/api/lesson/${id}`, config);
            message.success('Lesson deleted successfully');
            getCourseDetails();
        } catch (error) {
            message.error('Failed to delete lesson: ' + (error.response?.data?.message || error.message));
        }
    };

    const columns = [
        {
            title: 'Order',
            dataIndex: 'order',
            key: 'order',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    <Button type="primary" onClick={() => handleEditLesson(record)}>Edit</Button>
                    <Button type="danger" onClick={() => handleDeleteLesson(record._id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            {course && (
                <Form initialValues={course} onFinish={handleUpdateCourse} layout="vertical">
                    <Form.Item label="Course Title" name="name" rules={[{ required: true, message: 'Please input course title' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Level" name="level" rules={[{ required: true, message: 'Please input course level' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input course price' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Discount Price" name="discountPrice">
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            Save Course
                        </Button>
                    </Form.Item>
                </Form>
            )}

            <Button type="dashed" icon={<PlusOutlined />} onClick={() => setAddLessonModalVisible(true)} style={{ marginBottom: 20 }}>
                Add Lesson
            </Button>

            {/* Lessons Table */}
            <Table columns={columns} dataSource={lessons} rowKey="_id" />

            <Modal
                title="Add Lesson"
                visible={addLessonModalVisible}
                onCancel={handleModalCancel}
                onOk={handleModalOk}
                okText="Save Lesson"
                cancelText="Cancel"
            >
                <Form layout="vertical">
                    <Form.Item label="Order" required>
                        <Input
                            value={lessonData.order}
                            onChange={(e) => setLessonData({ ...lessonData, order: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label="Title" required>
                        <Input
                            value={lessonData.title}
                            onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label="Description" required>
                        <Input
                            value={lessonData.description}
                            onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label="Videos">
                        {lessonData.videos.map((video, index) => (
                            <div key={index} style={{ marginBottom: 16 }}>
                                <Form.Item label={`Video ${index + 1} Title`}>
                                    <Input
                                        value={video.title}
                                        onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="URL">
                                    <Input
                                        value={video.url}
                                        onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Duration">
                                    <Input
                                        value={video.duration}
                                        onChange={(e) => handleVideoChange(index, 'duration', e.target.value)}
                                    />
                                </Form.Item>
                                <Button
                                    type="danger"
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => handleRemoveVideo(index)}
                                >
                                    Remove Video
                                </Button>
                            </div>
                        ))}
                        <Button type="dashed" onClick={handleAddVideo} style={{ width: '100%' }}>
                            Add Video
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditCourse;
