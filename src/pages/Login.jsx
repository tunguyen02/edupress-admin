import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg'
import { Card, Form, Typography, Input, Button } from 'antd'
import axios from 'axios';
import { toast } from 'react-toastify';

const { Title, Paragraph } = Typography;

const Login = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleLogin = async ({ email, password }) => {
        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:8080/api/user/login', { email, password });
            setIsLoading(false);

            if (response.status === 200) {
                const { accessToken, refreshToken, role } = response.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                if (role === 'Admin') {
                    // navigate('/admin');
                    toast.success("Login successful");
                } else {
                    toast.error("You are not authorized to access this page");
                }
            }
        } catch (error) {
            setIsLoading(false);
            toast.error("Email or password is incorrect");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='container'>
            <div className="row">
                <div className="col logo">
                    <img src={logo} className='logo-img' />
                    <h2 className='logo-text'>EduPress Admin</h2>
                </div>
                <div className="col content-center">
                    <Card style={{ width: '60%' }}>
                        <div className="text-center">
                            <Title>Login</Title>
                            <Paragraph>Sign in to continue</Paragraph>
                        </div>
                        <Form
                            layout='vertical'
                            form={form}
                            onFinish={handleLogin}
                            disabled={isLoading}
                            size='large'
                        >
                            <Form.Item
                                name="email"
                                label='Email'
                                rules={[
                                    { required: true, message: 'Please input your email' },
                                    { type: 'email', message: 'Please enter a valid email' }
                                ]}
                            >
                                <Input placeholder='Enter your email' />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label='Password'
                                rules={[
                                    { required: true, message: 'Please input your password' }
                                ]}
                            >
                                <Input.Password placeholder='Enter your password' />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                    block
                                >
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </div >
    )
}

export default Login;