import React, { useState } from 'react'
import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom';
import { CircularProgress, Backdrop } from '@mui/material';
import MyAppBar from './MyAppBar'
import MySideBar from './MySideBar'
import { useFirestore } from '../utils/useFirestore.js';

const drawerWidth = 180;

const Main = (props) => {
    const { window } = props;
    const [open, setOpen] = useState(false)

    const { loading } = useFirestore();

    const openCloseDrawer = () => {
        setOpen(!open)
    }
    const container = window !== undefined ? () => window().document.body : undefined;
    const title = "Mercury";

    return (

        <Box sx={{ display: 'flex' }} >
            <MyAppBar openCloseDrawer={openCloseDrawer} title={title} drawerWidth={drawerWidth} />
            <MySideBar container={container} open={open} openCloseDrawer={openCloseDrawer} drawerWidth={drawerWidth} title={title} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 1, sm: 2, md: 3 },
                    width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
                    maxWidth: '100%',
                    overflowX: 'hidden',
                    boxSizing: 'border-box',
                }}
            >
                <Toolbar />
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress />
                </Backdrop>
                <Outlet />
            </Box>
        </Box>
    )
}

export default Main