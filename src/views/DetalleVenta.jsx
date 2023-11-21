import React, { useState, useEffect, useContext } from 'react'
import { Box, Button } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../utils';
import { UserContext } from '../context/UserProvider';
import { useForm, useTransaction } from '../utils';
import Alerts from '../components/common/Alerts';
import Venta from '../components/common/Venta';
import Pagos from '../components/common/Pagos';

const DEFAULT_VENTA = {
    total: null,
    subtotal: null,
    descuento: 0,
    vendedor: { nombre: "caja", id: "0" },
    cliente: { nombre: "consumidor Final", id: "0" },
    detalleVenta: []
};

const DetalleVenta = () => {
    const [productos, setProductos] = useState([]);
    const { formState: venta, setFormState: setVenta } = useForm(DEFAULT_VENTA);
    const { formState: pagos, setFormState: setPagos } = useForm([]);
    const { error, alert, onSave, success } = useTransaction();
    const { user } = useContext(UserContext);
    const { total } = venta;

    const getProductList = async () => {
        const data = await ProductService.getQuery("empresaId", "==", user.empresaId);
        const filtered = data.filter(i => i.fechaInactivo);
        const sortedData = filtered.sort((a, b) => {
            if (a.nombre < b.nombre) {
                return -1;
            }
            if (a.nombre > b.nombre) {
                return 1;
            }
            return 0;
        });
        setProductos(sortedData)
        return sortedData;
    };

    const handleCancel = () => {
        setVenta(DEFAULT_VENTA);
    };

    const handleSave = () => {
        const ventaFinal = { ...venta, pagos: pagos };
        onSave(ventaFinal);
    };

    const queryProductos = useQuery(['products'], getProductList);

    useEffect(() => {
        queryProductos.refetch();
    }, []);

    useEffect(() => {
        if (success) {

        }
    }, [success]);

    return (
        <>
            <Box sx={{ width: '100%', p: 1 }}>

                <Alerts alert={alert} error={error} />

                <Box  >
                    <Venta venta={venta} setVenta={setVenta} productos={productos} />
                </Box>
                <Box  >
                    <Pagos pagos={pagos} setPagos={setPagos} montoTotal={total} />
                </Box>

                <Box display="flex" justifyContent="flex-end" sx={{ p: 2 }} >
                    <Button color="primary" onClick={() => handleCancel()}>Cancelar</Button>
                    <Button color="primary" variant="contained" onClick={handleSave}
                        endIcon={< SendIcon />} >Guardar</Button>

                </Box>

            </Box>

        </>
    );
}

export default DetalleVenta