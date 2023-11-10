import React, { useState, useContext, useEffect } from 'react'
import {
    Grid, Typography, TableContainer, Paper, Table, TableHead, 
    TableRow, TableCell, TableBody, IconButton, Button, Accordion, AccordionSummary,AccordionDetails 
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { UserContext } from '../context/UserProvider';
import { ProductTypeService, BrandService } from '../utils';
import { useQuery } from '@tanstack/react-query';
import AgregarTipoProducto from '../components/modules/AgregarTipoProducto';
import AgregarMarca from '../components/modules/AgregarMarca';

const Config = () => {
    const [tipoProductos, setTipoProductos] = useState([]);
    const [tipoProducto, setTipoProducto] = useState(null);
    const [marcas, setMarcas] = useState([]);
    const [marca, setMarca] = useState(null);
    const [openTipo, setOpenTipo] = useState(false);
    const [openMarca, setOpenMarca] = useState(false);
    const [expanded, setExpanded] = React.useState("categorias");
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
    const getMarcas = async () => {
        const data = await BrandService.getQuery("empresaId", "==", user.empresaId);
        const sortedData = data.sort((a, b) => {
            if (a.nombre < b.nombre) {
              return -1;
            }
            if (a.nombre > b.nombre) {
              return 1;
            }
            return 0;
          });
        setMarcas(sortedData);
        return sortedData;
    };

    const queryProdTypes = useQuery(['productTypes'], getProductTypeList);
    const queryMarcas = useQuery(['marcas'], getMarcas);

    const handleNew = (itemName) => {
        if (itemName === "Categoria") {
            setTipoProducto(null);
            setOpenTipo(true);
        }
        if (itemName === "Marca") {
            setMarca(null);
            setOpenMarca(true);
        }
    };
    const handleClose = (itemName) => {
        if (itemName === "Categoria") {
            setOpenTipo(false);
            queryProdTypes.refetch();
        }
        if (itemName === "Marca") {
            setOpenMarca(false);
            queryMarcas.refetch();
        }
    };    
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
      };

    useEffect(() => {
        queryProdTypes.refetch();
        queryMarcas.refetch();
    }, []);

    return (
        <>
            {openTipo ? <AgregarTipoProducto open={openTipo} handleClose={()=>handleClose("Categoria")} tipoProducto={tipoProducto} /> : null}
            {openMarca ? <AgregarMarca open={openMarca} handleClose={()=>handleClose("Marca")} marca={marca} /> : null}
            <Accordion expanded={expanded === 'categorias'} onChange={handleChange('categorias')} >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                <Typography variant="h4" sx={{padding:1}} textAlign="center" >Categorias</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                        <Grid item sm={12}>
                            <Button color="primary" variant="contained" onClick={() => { handleNew("Categoria"); }}>Crear Nuevo</Button>
                        </Grid>
                        <Grid item sm={12}>
                            <TableContainer component={Paper} sx={{maxHeight: 450 }} >
                                <Table sx={{ minWidth: 650}} aria-label="simple table" stickyHeader >
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
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'marcas'} onChange={handleChange('marcas')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                <Typography variant="h4" sx={{padding:1}} textAlign="center" >Marcas</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }} spacing={2} >
                        <Grid item sm={12}>
                            <Button color="primary" variant="contained" onClick={() => { handleNew("Marca"); }}>Crear Nuevo</Button>
                        </Grid>
                        <Grid item sm={12}>
                        <TableContainer component={Paper} sx={{maxHeight: 450 }} >
                            <Table sx={{ minWidth: 650}} aria-label="simple table" stickyHeader >
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Nombre</TableCell>
                                        <TableCell align="left">Fecha Actualizacion</TableCell>
                                        <TableCell align="right">Acción</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {marcas.map((m) => (
                                        <TableRow
                                            key={m.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">{m.nombre}</TableCell>
                                            <TableCell align="left">{dayjs(m.fechaActualizacion).format('DD-M-YYYY')}</TableCell>
                                            <TableCell align="right">
                                                <>
                                                    <IconButton aria-label="edit" onClick={()=>{
                                                        setMarca(m);
                                                        setOpenMarca(true);
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
                </AccordionDetails>
            </Accordion>
        </>

    )
}

export default Config