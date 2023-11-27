import React, { useEffect, useState } from 'react'
import { Grid, Box, TextField, Button, Autocomplete, InputAdornment } from '@mui/material'
import PropTypes from 'prop-types'
import { useForm } from '../../utils'

const DEFAULT_ITEM_VENTA = {
    codigo: "",
    descripcion: "",
    precio: 0,
    cantidad: 1,
    descuento: 0,
    importe: 0
};

const ItemVenta = ({ setDetalleVenta, productos, setAlert }) => {

    const { formState: itemVenta, onInputChange, setFormState } = useForm(DEFAULT_ITEM_VENTA);
    const { id, codigo, cantidad, precio, importe } = itemVenta;
    const [cod, setCod] = useState(codigo);
    const [prod, setProd] = useState(null);
    const [desc, setDesc] = useState(0);

    useEffect(() => {
        if (codigo) {
            const producto = productos.find(i => i.codigo.toLowerCase() === codigo.toLowerCase());

            if (producto && producto !== itemVenta) {
                const item =
                {
                    id: producto.id,
                    codigo: producto.codigo,
                    descripcion: producto.descripcion,
                    precio: producto.precioVenta,
                    cantidad: 1,
                    descuento: 0,
                    importe: producto.precioVenta,
                };

                setFormState(item);
                setCod(codigo);
                setAlert(null);
                setProd(producto);
            }
            else {
                setFormState(DEFAULT_ITEM_VENTA);
                setCod("");
                setProd(null);
            }
            setAlert(null);
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

    useEffect(() => {
        if (prod) {
            setFormState(
                {
                    ...itemVenta,
                    codigo: prod.codigo
                }
            );
            setCod(prod.codigo);
        }
        else {
            setFormState(DEFAULT_ITEM_VENTA);
            setCod("");
        }
    }, [prod]);

    const handleDesc = (item) => {
        if (!item) return;

        const importe = Number(precio) * Number(cantidad);
        const montoDesc = importe * item.target.value / 100;

        console.log(item.target.value);

        setFormState(
            {
                ...itemVenta,
                descuento: montoDesc,
                importe: importe - montoDesc
            }
        );
        setDesc(item.target.value);
    };

    const handleNewItem = async () => {
        if (!id) {
            setAlert("Producto invalido");
            return;
        }
        if (cantidad <= 0) {
            setAlert("Cantidad debe ser mayor a 0");
            return;
        }
        setFormState(DEFAULT_ITEM_VENTA);
        setCod("");
        setAlert(null);
        setProd(null);
        setDesc(0);
        setDetalleVenta(itemVenta);
    };

    return (
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

            {/* Descuento */}
            <Grid item xs={12} sm={6} md={2}>
                <TextField id="txt-descuento" label="Descuento" type="number"
                    value={desc}
                    onChange={handleDesc}
                    min={0} max={100}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                    }}
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
    )
}

ItemVenta.propTypes = {
    setDetalleVenta: PropTypes.func.isRequired,
    productos: PropTypes.array.isRequired,
    setAlert: PropTypes.func.isRequired
}


export default ItemVenta