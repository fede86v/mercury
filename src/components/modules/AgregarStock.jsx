import React, { useEffect, useState } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box, TextField, Autocomplete, Grid, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Table, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import PropTypes from 'prop-types'
import { useForm, useStock } from '../../utils';
import Alerts from '../common/Alerts';

const DEFAULT_ITEM = {
    item: null,
    codigo: "",
    descripcion: "",
    precio: 0,
    cantidad: 1
};

const AgregarStock = ({ productos, handleClose, open }) => {
    const { error, onSave, success } = useStock();
    const { formState: item, onInputChange, setFormState } = useForm(DEFAULT_ITEM);
    const { id, codigo, cantidad } = item;
    const [alert, setAlert] = useState(null);
    const [cod, setCod] = useState(codigo);
    const [prod, setProd] = useState(null);
    const [stock, setStock] = useState([]);

    useEffect(() => {
        if (codigo) {
            const producto = productos.find(i => i.codigo.toLowerCase() === codigo.toLowerCase());

            if (producto && producto !== item) {
                const item =
                {
                    id: producto.id,
                    codigo: producto.codigo,
                    descripcion: producto.descripcion,
                    precio: producto.precioVenta,
                    cantidad: 1,
                };

                setFormState(item);
                setCod(codigo);
                setAlert(null);
                setProd(producto);
            }
            else {
                setFormState(DEFAULT_ITEM);
                setCod("");
                setProd(null);
            }
        }
    }, [codigo]);

    useEffect(() => {
        if (prod) {
            setFormState(
                {
                    ...item,
                    codigo: prod.codigo
                }
            );
            setCod(prod.codigo);
        }
        else {
            setFormState(DEFAULT_ITEM);
            setCod("");
        }
    }, [prod]);

    useEffect(() => {
        if (success) {
            handleClose();
        }
    }, [success]);

    const handleNewItem = async () => {
        if (!id) {
            setAlert("Producto invalido");
            return;
        }
        if (cantidad <= 0) {
            setAlert("Cantidad debe ser mayor a 0");
            return;
        }

        let existingItem = stock.find(i => i.id === id);

        if (existingItem) {
            const newStock = stock.map(obj =>
                obj.id === id ? { ...obj, cantidad: Number.parseInt(existingItem.cantidad) + Number.parseInt(item.cantidad) } : obj
            );
            setStock(newStock);
        }
        else {
            stock.push(item);
        }

        setFormState(DEFAULT_ITEM);
        setCod("");
        setAlert(null);
        setProd(null);
    };

    const handleSave = () => {
        onSave(stock);
    };

    const handleDeleteProduct = (item) => {
        const newStock = stock.filter(obj => obj.id !== item.id);
        setStock(newStock);
    };

    return (
        <Dialog open={open} >
            <DialogTitle>Stock</DialogTitle>
            <DialogContent>
                <DialogContentText>
                </DialogContentText>
                <Alerts alert={alert} error={error} />
                <Box sx={{ width: '100%', p: 1 }}>
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 1, md: 1 }} sx={{ mb: 2 }} >
                        {/* Codigo */}
                        <Grid item xs={12} sm={4} md={2}>
                            <TextField id="txt-codigo" label="Código"
                                value={cod}
                                onChange={(v) => setCod(v.target.value)}
                                onKeyUp={(event) => {
                                    if (event.keyCode === 13) {
                                        setFormState(
                                            {
                                                ...item,
                                                codigo: cod
                                            }
                                        );
                                    }
                                }}
                                sx={{ width: '100%' }} />
                        </Grid>

                        {/* Descripción */}
                        <Grid item xs={12} sm={8} md={6}>
                            <Autocomplete
                                id="autocomplete-descripcion"
                                options={productos}
                                onChange={(event, newValue) => {
                                    setProd(newValue);
                                }}
                                getOptionLabel={(option) => option.descripcion}
                                value={prod}
                                sx={{ width: '100%' }}
                                renderInput={(params) => <TextField {...params} label="Descripción" />}
                            />
                        </Grid>

                        {/* Cantidad */}
                        <Grid item xs={12} sm={4} md={2}>
                            <TextField id="txt-cantidad" label="Cantidad"
                                value={cantidad} name="cantidad" type="number"
                                onChange={onInputChange}
                                sx={{ width: '100%' }} />
                        </Grid>

                        <Grid item xs={12} sm={8} md={2}>
                            <Box display="flex" justifyContent="flex-end" alignContent="center" >
                                <Button color="secondary" variant="contained" onClick={handleNewItem} sx={{ my: 1 }} >Agregar</Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item sm={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 500 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Descripcion</TableCell>
                                        <TableCell align="left">Cantidad</TableCell>
                                        <TableCell align="right">Acción</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stock.map((producto) => (
                                        <TableRow
                                            key={producto.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">{producto.descripcion}</TableCell>
                                            <TableCell align="left">{producto.cantidad}</TableCell>
                                            <TableCell align="right">
                                                <>
                                                    <IconButton aria-label="delete" onClick={() => handleDeleteProduct(producto)} >
                                                        <DeleteIcon color="error" />
                                                    </ IconButton>
                                                </>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                </Box>

            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => handleClose()}>Cancelar</Button>
                <Button color="primary" variant="contained" onClick={handleSave}
                    endIcon={< SaveIcon />} >Guardar</Button>
            </DialogActions>
        </Dialog>
    )
};

AgregarStock.propTypes = {
    productos: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AgregarStock