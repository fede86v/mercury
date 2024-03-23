import React, { useState, useContext, useEffect } from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
} from "@mui/material";
import {
    People,
    MiscellaneousServicesSharp,
    Home, Store, LocalGroceryStore, LocalMall
} from '@mui/icons-material';
import { NavLink } from "react-router-dom";
import { UserContext } from '../context/UserProvider';

const MyListItem = ({ id, nombre, icon, link, action, itemStyle }) => {
    return link === '' ?
        (
            <ListItemButton sx={itemStyle} key={id} onClick={action} >
                <ListItemIcon sx={{ minWidth: '30px' }}>{icon}</ListItemIcon>
                <ListItemText primary={nombre} />
            </ListItemButton>
        )
        : (
            <ListItemButton sx={itemStyle} key={id} component={NavLink} to={link} >
                <ListItemIcon sx={{ minWidth: '30px' }}>{icon}</ListItemIcon>
                <ListItemText primary={nombre} />
            </ListItemButton>
        )
};

const MyNavBar = ({ title }) => {
    useEffect(() => {
        const tmpEnlaces = [];
        if (!user) {
            setEnlaces(tmpEnlaces);
        }
        else {
            tmpEnlaces.push({
                id: 1,
                nombre: 'Productos',
                children: [
                    { id: 12, nombre: 'Productos', icon: <Store />, link: '/Productos' },
                ],
            });

            tmpEnlaces.push({
                id: 2,
                nombre: 'Ventas',
                children: [
                    { id: 22, nombre: 'Ventas', icon: <LocalGroceryStore />, link: '/Ventas' },
                    { id: 22, nombre: 'Reportes', icon: <LocalGroceryStore />, link: '/Reportes' },
                ],
            });

            tmpEnlaces.push({
                id: 3,
                nombre: 'Clientes',
                children: [
                    { id: 32, nombre: 'Clientes', icon: <People />, link: '/Clientes' },
                ],
            });

            tmpEnlaces.push({
                id: 4,
                nombre: 'Vendedores',
                children: [
                    { id: 42, nombre: 'Vendedores', icon: <LocalMall />, link: '/Vendedores' },
                ],
            });

        }
        setEnlaces(tmpEnlaces);

    }, []);

    const { user } = useContext(UserContext);
    const [enlaces, setEnlaces] = useState([]);

    const item = {
        py: '2px',
        px: 3
    };

    const itemCategory = {
        boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
        py: 1.5,
        px: 3,
    };

    return (
        <div sx={{ m2: 2 }}>
            <List disablePadding>
                <ListItem key="titleId" sx={{ ...item, ...itemCategory, fontSize: 22 }}>
                    {title}
                </ListItem>
                <ListItemButton sx={{
                    ...item, ...itemCategory
                }} component={NavLink} to="/" >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                        <Home />
                    </ListItemIcon>
                    <ListItemText>Home</ListItemText>
                </ListItemButton>

                <Divider sx={{ mt: 2 }} />
                {
                    enlaces.map(({ id, nombre, children }, i) =>
                    (<Box key={id} >
                        <ListItem sx={{ py: 2, px: 3 }}>
                            <ListItemText>{nombre}</ListItemText>
                        </ListItem>
                        {children.map(({ id: childId, nombre, icon, link, action }, index) =>
                            (<MyListItem key={index} id={childId} nombre={nombre} icon={icon} link={link} action={action} itemStyle={item} />)
                        )}
                        <Divider sx={{ mt: 2 }} />
                    </Box>)
                    )
                }
                <ListItem key="li_Configuracion">
                    <ListItemButton component={NavLink} to='/Config' >
                        <ListItemIcon sx={{ minWidth: '30px' }}>
                            <MiscellaneousServicesSharp />
                        </ListItemIcon>
                        <ListItemText primary="Configuracion" />
                    </ ListItemButton>
                </ListItem>
            </List>
        </div>
    )
}

export default MyNavBar