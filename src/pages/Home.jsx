import axios from 'axios';
import { useEffect, useState } from 'react';
import { Layout, Card, Col, Row } from 'antd';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const { Content } = Layout;

const pieData = [
    { name: 'Course A', value: 400 },
    { name: 'Course B', value: 300 },
    { name: 'Course C', value: 300 },
    { name: 'Course D', value: 200 },
];

const barData = [
    { name: 'Jan', uv: 4000, pv: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398 },
    { name: 'Mar', uv: 2000, pv: 9800 },
    { name: 'Apr', uv: 2780, pv: 3908 },
    { name: 'May', uv: 1890, pv: 4800 },
    { name: 'Jun', uv: 2390, pv: 3800 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Home = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalCourses, setTotalCourses] = useState(0);
    const [newRegistrations, setNewRegistrations] = useState(0);

    useEffect(() => {
        getTotalUsers();
        getTotalCourses();
        getNewRegistrations();
    }, []);

    const getTotalUsers = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/user/total-users');
            setTotalUsers(res.data.totalUsers);
        } catch (error) {
            console.error('Error fetching total users:', error);
        }
    };

    const getTotalCourses = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/course/total-courses');
            setTotalCourses(res.data.totalCourses);
        } catch (error) {
            console.error('Error fetching total courses:', error);
        }
    };

    const getNewRegistrations = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/register-course/new-registrations');
            setNewRegistrations(res.data.newRegistrations);
        } catch (error) {
            console.error('Error fetching new registrations:', error);
        }
    };

    return (
        <Layout style={{ padding: '24px' }}>
            <Content>
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Card title="Total Users" bordered={false}>
                            <h2>{totalUsers}</h2>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Total Courses" bordered={false}>
                            <h2>{totalCourses}</h2>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="New Registrations" bordered={false}>
                            <h2>{newRegistrations}</h2>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col span={12}>
                        <Card title="Course Enrollments (Pie Chart)" bordered={false}>
                            <PieChart width={400} height={300}>
                                <Pie
                                    data={pieData}
                                    cx={200}
                                    cy={150}
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Monthly Revenue (Bar Chart)" bordered={false}>
                            <BarChart
                                width={500}
                                height={300}
                                data={barData}
                                margin={{
                                    top: 5, right: 30, left: 20, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="uv" fill="#8884d8" />
                                <Bar dataKey="pv" fill="#82ca9d" />
                            </BarChart>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default Home;
