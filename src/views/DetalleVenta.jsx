import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Backdrop } from '@mui/material';
import { useParams } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import { ProductService, TransactionService, PaymentService, TransactionDetailService, ClientService } from '../utils';
import { UserContext } from '../context/UserProvider';
import { useForm, useTransaction } from '../utils';
import Alerts from '../components/common/Alerts';
import Venta from '../components/common/Venta';
import Pagos from '../components/common/Pagos';
import { useNavigate } from "react-router-dom";

const DEFAULT_VENTA = {
    total: null,
    subtotal: null,
    descuento: 0,
    vendedor: { nombre: "caja", id: "0" },
    cliente: { nombre: "consumidor Final", id: "0" },
    detalleVenta: []
};

const DetalleVenta = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const { formState: venta, setFormState: setVenta } = useForm(DEFAULT_VENTA);
    const { formState: pagos, setFormState: setPagos } = useForm([]);
    const { error, alert, onSave, success, mutation } = useTransaction();
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

    const getVenta = async () => {
        if (id) {
            const data = await TransactionService.getOne(id);
            const cliente = await ClientService.getOne(data.clienteId);
            const detalle1 = await TransactionDetailService.getQuery("ventaId", "==", id);
            const detalle2 = await PaymentService.getQuery("ventaId", "==", id);
            const final = { ...data, detalleVenta: detalle1, pagos: detalle2, vendedor: { nombre: data.vendedor, key: data.vendedorId }, cliente: cliente };
            setVenta({ ...data, detalleVenta: detalle1, vendedor: { nombre: data.vendedor, key: data.vendedorId }, cliente: cliente });
            setPagos(detalle2);
            console.log(final);
            return final;
        }

        return null;
    };

    const handleCancel = () => {
        setVenta(DEFAULT_VENTA);
        navigate("/Ventas");
    };

    const handleSave = () => {
        const ventaFinal = { ...venta, pagos: pagos };
        onSave(ventaFinal);
    };

    const queryProductos = useQuery(['products'], getProductList);
    const queryVenta = useQuery(["ventas"], getVenta, id);

    useEffect(() => {
        queryProductos.refetch();
        queryVenta.refetch();
    }, []);

    useEffect(() => {
        if (success) {
            setVenta(DEFAULT_VENTA);
            setPagos([]);
            navigate("/Ventas");
        }
    }, [success]);

    return (
        <Box sx={{ width: '100%', p: 1 }}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={mutation.isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

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
    );
}

export default DetalleVenta