import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout, Affix } from 'antd'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SiderComponent from '../components/SiderComponent'
import HeaderComponent from '../components/HeaderComponent'
import { routes } from './index'

const Main = () => {

    const { Content, Footer, Header, Sider } = Layout;

    return (
        <BrowserRouter>
            <ToastContainer />
            <Layout>
                <Affix offsetTop={0}>
                    <SiderComponent />
                </Affix>
                <Layout
                    style={{
                        backgroundColor: 'white !important',
                    }}>
                    <Affix offsetTop={0}>
                        <HeaderComponent />
                    </Affix>
                    <Content className='pt-3 container-fluid'>
                        <Routes>
                            {
                                routes.map((route) => {
                                    const Page = route.page;
                                    return (
                                        <Route key={route.path} path={route.path} element={<Page />} />
                                    );
                                })
                            }
                        </Routes>
                    </Content>
                    <Footer className='bg-white' />
                </Layout>
            </Layout>

        </BrowserRouter>
    )
}

export default Main