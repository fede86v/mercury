import React from 'react'
import { Box, Drawer } from '@mui/material'
import MyNavBar from './MyNavBar'

const MySideBar = ({ drawerWidth, container, open, openCloseDrawer, title }) => {
    return (
        <Box
            component="nav"
            sx={{
                width: { sm: drawerWidth },
                flexShrink: { sm: 0 }
            }}>

            <Drawer
                container={container}
                variant="temporary"
                open={open}
                onClose={openCloseDrawer}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                <MyNavBar title={title} />
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                <MyNavBar title={title} />
            </Drawer>
        </ Box>
    )
}

export default MySideBar