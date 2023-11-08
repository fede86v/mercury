import React, { useState } from 'react'
import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom';
import { CircularProgress, Backdrop } from '@mui/material';

import MyAppBar from './MyAppBar'
import MySideBar from './MySideBar'

import { useFirestore } from '../utils/useFirestore.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: 3
        },
    },
});

const drawerWidth = 240;

const Main = (props) => {
    const { window } = props;
    const [open, setOpen] = useState(false)

    const { loading } = useFirestore();

    const openCloseDrawer = () => {
        setOpen(!open)
    }
    const container = window !== undefined ? () => window().document.body : undefined;
    const title = "Go-4-IT";

    return (
        <QueryClientProvider client={queryClient}>
            <Box sx={{ display: 'flex' }}>
                <MyAppBar openCloseDrawer={openCloseDrawer} title={title} drawerWidth={drawerWidth} />
                <MySideBar container={container} open={open} openCloseDrawer={openCloseDrawer} drawerWidth={drawerWidth} title={title} />
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
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
        </QueryClientProvider>
    )
}

export default Main