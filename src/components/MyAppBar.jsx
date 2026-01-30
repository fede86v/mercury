import React, { useContext, useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography, Button, Tooltip, Avatar, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { NavLink } from "react-router-dom";
import { UserContext } from '../context/UserProvider';
import { useNavigate } from "react-router-dom";

function MyAppBar({ title, openCloseDrawer, drawerWidth, drawerOpen }) {

    const { user, signOutUser } = useContext(UserContext);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const navigate = useNavigate();

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed"
                sx={{
                    width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { xs: 0, sm: `${drawerWidth}px` },
                }}>
                <Toolbar sx={{ minHeight: { xs: 48, sm: 64 }, px: { xs: 1, sm: 2 } }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => openCloseDrawer()}
                        sx={{ mr: 1, display: { xs: 'block', sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl: { xs: 0, sm: 3 }, fontSize: { xs: '1rem', sm: '1.25rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user ? user.empresa : title}
                    </Typography>
                    {
                        (user !== null && user !== false)
                            ? (<Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Abrir configuraciones">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        {
                                            user.fotoURL !== ""
                                                ? (<Avatar alt="profile-pic" src={user.fotoURL} />)
                                                : (<AccountCircleIcon />)
                                        }
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem key="perfil" onClick={() => {
                                        handleCloseUserMenu();
                                        navigate("/Perfil");

                                    }}>
                                        <Typography textAlign="center">Perfil</Typography>
                                    </MenuItem>
                                    <MenuItem key="logout" onClick={() => {
                                        handleCloseUserMenu();
                                        signOutUser();
                                    }}>
                                        <Typography textAlign="center">Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>)
                            : (<Button color="inherit" component={NavLink} to="/Login">Login</Button>)
                    }

                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default MyAppBar;