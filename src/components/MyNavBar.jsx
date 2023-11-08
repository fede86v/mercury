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
    MedicalInformation,
    AddCircle,
    MiscellaneousServicesSharp,
    Home,
    EventAvailable
} from '@mui/icons-material';
import { NavLink } from "react-router-dom";
import AgregarSocio from './modules/AgregarCliente'
import { UserContext } from '../context/UserProvider';
import AgregarEntrenador from './modules/AgregarEntrenador';

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
            if (user.esAdmin || user.esEntrenador) {
                tmpEnlaces.push({
                    id: 1,
                    nombre: 'Socios',
                    children: [
                        { id: 11, nombre: 'Nuevo', icon: <AddCircle />, link: '', action: handleNewSocio },
                        { id: 12, nombre: 'Socios', icon: <People />, link: '/Socios' },
                    ],
                });
            }

            if (user.esAdmin) {
                tmpEnlaces.push({
                    id: 2,
                    nombre: 'Entrenadores',
                    children: [
                        { id: 21, nombre: 'Nuevo', icon: <AddCircle />, link: '', action: handleNewEntrenador },
                        { id: 22, nombre: 'Entrenadores', icon: <MedicalInformation />, link: '/Entrenadores' },
                    ],
                });

                tmpEnlaces.push({
                    id: 3,
                    nombre: 'Productos',
                    children: [
                        { id: 21, nombre: 'Nuevo', icon: <AddCircle />, link: '', action: handleNewProducto },
                        { id: 22, nombre: 'Stock', icon: <MedicalInformation />, link: '/Stock' },
                    ],
                });
            }
            if (user.esSocio) {
                // no hace nada por ahora
            }
        }

        setEnlaces(tmpEnlaces);

    }, []);

    const { user } = useContext(UserContext);
    const [openSocio, setOpenSocio] = useState(false);
    const [openEntrenador, setOpenEntrenador] = useState(false);
    const [enlaces, setEnlaces] = useState([]);

    //Socio
    const handleNewSocio = () => {
        setOpenSocio(true);
    };
    const handleCloseSocio = () => {
        setOpenSocio(false);
    };

    //Entrenador
    const handleNewEntrenador = () => {
        setOpenEntrenador(true);
    };
    const handleCloseEntrenador = () => {
        setOpenEntrenador(false);
    };

    const handleNewProducto = () => {
    };

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
        <div>
            <AgregarSocio open={openSocio} handleClose={handleCloseSocio} />
            <AgregarEntrenador open={openEntrenador} handleClose={handleCloseEntrenador} />
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

                <ListItemButton sx={{
                    ...item, ...itemCategory
                }} component={NavLink} to="/Asistencia" >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                        <EventAvailable />
                    </ListItemIcon>
                    <ListItemText>Asistencia</ListItemText>
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