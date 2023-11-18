import React, { useEffect, useState } from 'react'
import { Grid, Box, TextField, Button, Autocomplete } from '@mui/material'
import PropTypes from 'prop-types'
import { useForm } from '../../utils'

const DEFAULT_ITEM_VENTA = {
    codigo: "",
    descripcion: "",
    precio: 0,
    cantidad: 1,
    importe: 0
};

const ItemVenta = ({ setDetalleVenta, productos, setAlert }) => {

    const { formState: itemVenta, onInputChange, setFormState } = useForm(DEFAULT_ITEM_VENTA);
    const { id, codigo, cantidad, precio, importe } = itemVenta;
    const [cod, setCod] = useState(codigo)

    useEffect(() => {
        if (codigo) {
            const producto = productos.find(i => i.codigo === codigo);
            if (producto && producto !== itemVenta) {
                setFormState(
                    {
                        id: producto.id,
                        codigo: producto.codigo,
                        descripcion: producto.descripcion,
                        precio: producto.precioVenta,
                        cantidad: 1,
                        importe: producto.precioVenta,
                    }
                );
            }
            else {
                setFormState(DEFAULT_ITEM_VENTA);
            }
        }
    }, [codigo]);

    useEffect(() => {
        const target = {
            name: "importe",
            value: precio * cantidad
        }
        setAlert(null);
        onInputChange({ target });
    }, [cantidad]);

    const handleNewItem = async () => {
        if (!id) {
            setAlert("Producto invalido");
            return;
        }
        if (cantidad <= 0) {
            setAlert("Cantidad debe ser mayor a 0;");
            return;
        }
        setFormState(DEFAULT_ITEM_VENTA);
        setAlert(null);
        setDetalleVenta(itemVenta);
    };

    return (
        <>
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
                                        ...itemVenta,
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
                            if (newValue) {
                                setFormState(
                                    {
                                        ...itemVenta,
                                        codigo: newValue.codigo
                                    }
                                );
                                setCod(newValue.codigo);
                            }
                            else {
                                setFormState(DEFAULT_ITEM_VENTA);
                            }
                        }}
                        getOptionLabel={(option) => option.descripcion}
                        value={itemVenta}
                        sx={{ width: '100%' }}
                        renderInput={(params) => <TextField {...params} label="Descripción" />}
                    />
                </Grid>

                {/* Cantidad */}
                <Grid item xs={12} sm={6} md={2}>
                    <TextField id="txt-cantidad" label="Cantidad"
                        value={cantidad} name="cantidad"
                        onChange={onInputChange}
                        sx={{ width: '100%' }} />
                </Grid>

                {/* Importe */}
                <Grid item xs={12} sm={6} md={2}>
                    <TextField id="txt-importe" label="Importe"
                        value={importe} name="importe"
                        InputProps={{ readOnly: true, }}
                        sx={{ width: '100%' }} />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button color="secondary" variant="contained" onClick={handleNewItem}>Agregar</Button>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

ItemVenta.propTypes = {
    producto: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    setProducto: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired
}


export default ItemVenta