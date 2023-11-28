import React, { useEffect, useState } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PropTypes from 'prop-types'
import { useForm, useTransaction } from '../../utils';
import Alerts from '../common/Alerts';

const DEFAULT_ITEM = {
    codigo: "",
    descripcion: "",
    precio: 0,
    cantidad: 1
};

const AgregarStock = ({productos, handleClose}) => {
    const [activeStep, setActiveStep] = useState(0);
    const { error, alert, onSave, success } = useTransaction();
    const { formState: item, onInputChange, setFormState } = useForm(DEFAULT_ITEM);
    const { id, codigo, cantidad, precio } = item;
    const [cod, setCod] = useState(codigo);
    const [prod, setProd] = useState(null);

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
            setAlert(null);
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

    const handleNewItem = async () => {
        if (!id) {
            setAlert("Producto invalido");
            return;
        }
        if (cantidad <= 0) {
            setAlert("Cantidad debe ser mayor a 0");
            return;
        }
        setFormState(DEFAULT_ITEM);
        setCod("");
        setAlert(null);
        setProd(null);
        setDetalleVenta(item);
    };

    const handleSave = ()=> {
    };

    useEffect(() => {
        if (success) {
            handleClose();
        }
    }, [success]);

    return (
        <Dialog open={props.open} >
            <DialogTitle>Venta</DialogTitle>
            <DialogContent>
                <DialogContentText>
                </DialogContentText>
                <Alerts alert={alert} error={error} />
                <Box sx={{ width: '100%', p: 1 }}>
                <Alerts alert={alert} error={error} />
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 1, md: 1 }} >
                    {/* Codigo */}
                    <Grid item xs={12} sm={6} md={2}>
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
                    <Grid item xs={12} sm={6} md={4}>
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
                    <Grid item xs={12} sm={6} md={1}>
                        <TextField id="txt-cantidad" label="Cantidad"
                            value={cantidad} name="cantidad" type="number"
                            onChange={onInputChange}
                            sx={{ width: '100%' }} />
                    </Grid>

                    {/* Importe */}
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField id="txt-importe" label="Importe" type="number"
                            value={importe} name="importe"
                            InputProps={{ readOnly: true, }}
                            sx={{ width: '100%' }} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={1}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button color="secondary" variant="contained" onClick={handleNewItem}>Agregar</Button>
                        </Box>
                    </Grid>
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