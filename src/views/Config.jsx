import React, { useState, useEffect } from 'react'
import {
    Grid, Typography, FormControlLabel, Switch, TableContainer, Paper,
    Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import AgregarPrecio from '../components/modules/AgregarPrecio'
import { useQuery } from '@tanstack/react-query';
import { PriceService } from '../utils/databaseService';

const DEFAULT_PRICE = {
    frecuencia: 'Full',
    actividad: 'MUSCULACION',
    desde: Date.now(),
    hasta: null,
};

const Config = () => {
    /* Constants */
    const [openPrice, setOpenPrice] = useState(false);
    const [activePrices, setActivePrices] = useState([]);
    const [filteredPrices, setFilteredPrices] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(DEFAULT_PRICE);
    const [includeInactives, setIncludeInactives] = useState(false);

    const filterItems = (data, showInactive) => {
        if (data) {
            if (showInactive) {
                setFilteredPrices(data);
            }
            else {
                const activos = data.filter(p => new Date(p.desde) <= Date.now() && (p.hasta === null || new Date(p.hasta) > Date.now()));
                setFilteredPrices(activos);
                setActivePrices(activos);
            }
        }
    };

    const getPriceList = async () => {
        const data = await PriceService.getAll();
        filterItems(data, includeInactives);
        return data;
    };

    const query = useQuery(['price'], getPriceList);

    const handlePrice = (id) => {
        if (!id) {
            setCurrentPrice(DEFAULT_PRICE);
        }
        else {
            const price = query.data.find(e => e.id === id);
            setCurrentPrice(price);
        }
        setOpenPrice(true);
    };

    const handleIncluirInactivos = () => {
        const newValue = !includeInactives;
        filterItems(query.data, newValue);
        setIncludeInactives(newValue);
    };

    const handleClosePrice = () => {
        setOpenPrice(false);
        query.refetch();
    };

    function PriceList({ items }) {
        return (
            <Grid item sm={12}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" >Actividad</TableCell>
                                <TableCell align="left" >Frecuencia</TableCell>
                                <TableCell align="left" >Desde</TableCell>
                                <TableCell align="left" >Hasta</TableCell>
                                <TableCell align="right">Price ($)</TableCell>
                                <TableCell align="right">Accion</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map(({ id, actividad, frecuencia, desde, hasta, precio }) => (
                                <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                    <TableCell align="left">{actividad}</TableCell>
                                    <TableCell align="left">{frecuencia}</TableCell>
                                    {/* <TableCell align="left">{moment(desde).format('DD-M-YYYY')}</TableCell>
                                    <TableCell align="left">{hasta && moment(hasta).format('DD-M-YYYY')}</TableCell> */}
                                    <TableCell align="right">${precio}</TableCell>
                                    <TableCell align="right">
                                        {hasta === null || hasta > Date.now() ? (
                                            <>
                                                <IconButton aria-label="edit" onClick={() => handlePrice(id)} >
                                                    <EditIcon color="secondary" />
                                                </ IconButton>
                                            </>
                                        ) : (null)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        );
    };

    useEffect(() => {
        if (query.data) {
            filterItems(query.data, includeInactives);
        };
    }, []);

    return (
        <>
            {openPrice ? <AgregarPrecio open={openPrice} currentPrice={currentPrice} activePrices={activePrices} handleClose={handleClosePrice} /> : null}
            <Typography variant="h4" padding={3} textAlign="center" >Price</Typography>
            <Paper sx={{ my: 2, padding: '10px' }} >

                <Button color="primary" variant="contained" onClick={() => { handlePrice(null) }}>Crear</Button>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                    <Grid item sm={12}>
                        <FormControlLabel control={<Switch checked={includeInactives} onChange={() => handleIncluirInactivos()} />} label="Mostrar Todos" />
                    </Grid>
                    {query.status === "success" && <PriceList items={filteredPrices} />}
                </Grid>
            </Paper>
        </>

    )
}

export default Config