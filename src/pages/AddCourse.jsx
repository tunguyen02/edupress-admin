
import { Form, Input, InputNumber, Button, message, Upload, Select, Row, Col, Image } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

const AddCourse = () => {
    const [form] = Form.useForm();
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const handleFinish = async (values) => {
        try {
            const token = localStorage.getItem('accessToken');
            console.log("Access Token:", token);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            const courseData = {
                ...values,
                image: imagePreview,
            };

            await axios.post('http://localhost:8080/api/course/create', courseData, config);
            message.success('Course created successfully!');
            navigate('/admin/course');
        } catch (error) {
            message.error('Failed to create course: ' + (error.response?.data?.message || error.message));
        }
    };



    const handleImageUpload = (file) => {
        form.setFieldsValue({ image: file });
        setImagePreview(URL.createObjectURL(file));
        return false;
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2>Add Course</h2>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    label="Course Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input the course name!' }]}
                >
                    <Input />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Level"
                            name="level"
                            rules={[{ required: true, message: 'Please select the level!' }]}
                        >
                            <Select placeholder="Select level">
                                <Select.Option value="beginner">Beginner</Select.Option>
                                <Select.Option value="intermediate">Intermediate</Select.Option>
                                <Select.Option value="advanced">Advanced</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Category"
                            name="category"
                            rules={[{ required: true, message: 'Please select the category!' }]}
                        >
                            <Select placeholder="Select category">
                                <Select.Option value="web-development">Web Development</Select.Option>
                                <Select.Option value="data-science">Data Science</Select.Option>
                                <Select.Option value="design">Design</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input the price!' }]}
                        >
                            <InputNumber min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Discount"
                            name="discountPrice"
                        >
                            <InputNumber min={0} max={100} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label="URL Slug"
                    name="urlSlug"
                    rules={[{ required: true, message: 'Please input the URL slug!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Image"
                    name="image"
                    rules={[{ required: true, message: 'Please upload an image!' }]}
                >
                    <Upload
                        beforeUpload={handleImageUpload}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                </Form.Item>
                {imagePreview && (
                    <Form.Item label="Preview">
                        <Image
                            width={200}
                            src={imagePreview}
                            alt="Image Preview"
                        />
                    </Form.Item>
                )}
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input the description!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Course
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddCourse;
