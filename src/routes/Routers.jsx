import React from 'react'
import Auth from './Auth'
import Main from './Main'

const Routers = () => {

    const token = localStorage.getItem('accessToken');
    return (token ? <Main /> : <Auth />)
}

export default Routers