import React, { useState, useContext, useEffect } from 'react'
import { NavLink } from "react-router-dom";
import {
    Grid, Typography, TableContainer, Paper, Table, TableHead, 
    TableRow, TableCell, TableBody, IconButton, Button
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import dayjs from 'dayjs';
import { UserContext } from '../context/UserProvider';
import { ProductTypeService } from '../utils';
import { useQuery } from '@tanstack/react-query';
import AgregarTipoProducto from '../components/modules/AgregarTipoProducto';

const Config = () => {
    const [tipoProductos, setTipoProductos] = useState([]);
    const [tipoProducto, setTipoProducto] = useState(null);
    const [openTipo, setOpenTipo] = useState(false);
    const { user } = useContext(UserContext);

    const getProductTypeList = async () => {
        const data = await ProductTypeService.getQuery("empresaId", "==", user.empresaId);
        const sortedData = data.sort((a, b) => {
            if (a.nombre < b.nombre) {
              return -1;
            }
            if (a.nombre > b.nombre) {
              return 1;
            }
            return 0;
          });
        setTipoProductos(sortedData);
        return sortedData;
    };

    const queryProdTypes = useQuery(['productTypes'], getProductTypeList);

    const handleNewProduct = () => {
        setOpenTipo(true);
    };
    const handleCloseProducto = () => {
        setOpenTipo(false);
        queryProdTypes.refetch();
    };    
    
    useEffect(() => {
        queryProdTypes.refetch();
    }, []);

    return (
        <>
            {openTipo ? <AgregarTipoProducto open={openTipo} handleClose={handleCloseProducto} tipoProducto={tipoProducto} /> : null}
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                <Grid item sm={2}>
                    <Button color="primary" variant="contained" onClick={() => { handleNewProduct(); }}>Crear</Button>
                </Grid>
                <Grid item sm={10}>
                    <Typography variant="h4" padding={3} textAlign="center" >Productos</Typography>
                </Grid>
                <Grid item sm={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Nombre</TableCell>
                                    <TableCell align="left">Fecha Actualizacion</TableCell>
                                    <TableCell align="right">Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tipoProductos.map((tp) => (
                                    <TableRow
                                        key={tp.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{tp.nombre}</TableCell>
                                        <TableCell align="left">{dayjs(tp.fechaActualizacion).format('DD-M-YYYY')}</TableCell>
                                        <TableCell align="right">
                                            <>
                                                <IconButton aria-label="edit" onClick={()=>{
                                                    setTipoProducto(tp);
                                                    setOpenTipo(true);
                                                }}  >
                                                    <ModeEditIcon color="secondary" />
                                                </ IconButton>
                                            </>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>

    )
}

export default Config