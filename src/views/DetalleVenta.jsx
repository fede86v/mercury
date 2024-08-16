import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Backdrop, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import { ProductService, TransactionService, PaymentService, TransactionDetailService, ClientService, EmployeeService } from '../utils';
import { UserContext } from '../context/UserProvider';
import { useForm, useTransaction } from '../utils';
import AlertDialog from '../components/common/AlertDialog';
import Venta from '../components/common/Venta';
import Pagos from '../components/common/Pagos';
import { useNavigate } from "react-router-dom";

const DEFAULT_VENTA = {
    id: null,
    total: 0,
    subtotal: 0,
    descuento: 0,
    fechaVenta: new Date(),
    vendedor: { nombre: "Caja", id: "0" },
    cliente: { nombre: "Consumidor", apellido: "Final", numeroDocumento: "0", id: 0 },
    detalleVenta: []
};

const DetalleVenta = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const { formState: venta, setFormState: setVenta, onInputDateChange } = useForm(DEFAULT_VENTA);
    const { formState: pagos, setFormState: setPagos } = useForm([]);
    const { error, alert, onSave, success, mutation, onSetAlert, onSetError } = useTransaction();
    const { user } = useContext(UserContext);
    const { total } = venta;
    const [ openDialog, setOpenDialog ] = useState(false);

    const handleClose = async () => {
        onSetAlert(null);
        onSetError(null);
        setOpenDialog(false);
    };

    const getProductList = async () => {
        const data = await ProductService.getQuery("empresaId", "==", user.empresaId);
        const filtered = data.filter(i => !i.fechaInactivo);
        const sortedData = filtered.sort((a, b) => {
            if (a.descripcion < b.descripcion) {
                return -1;
            }
            if (a.descripcion > b.descripcion) {
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
            let cliente = await ClientService.getOne(data.clienteId);
            if (!cliente) {
                const cls = await ClientService.getQuery("numeroDocumento", "==", "0");
                cliente = cls[0];
            }
            const detalle1 = await TransactionDetailService.getQuery("ventaId", "==", id);
            const detalle2 = await PaymentService.getQuery("ventaId", "==", id);
            const final = { ...data, detalleVenta: detalle1, pagos: detalle2, vendedor: { nombre: data.vendedor, id: data.vendedorId }, cliente: cliente };
            setVenta({ ...data, detalleVenta: detalle1, vendedor: { nombre: data.vendedor, id: data.vendedorId }, cliente: cliente });
            setPagos(detalle2);
            return final;
        }
        else {
            const data = await EmployeeService.getQuery("numeroDocumento", "==", "0");
            const v = data[0];
            setVenta({ ...DEFAULT_VENTA, vendedor: v });
            venta.detalleVenta.length = 0;
            setPagos([]);
            return DEFAULT_VENTA;
        }
    };

    const handleCancel = () => {
        venta.detalleVenta.length = 0;
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
        return () => {
            setPagos([]);
            venta.detalleVenta.length = 0;
            setVenta(DEFAULT_VENTA);
        }
    }, []);

    useEffect(() => {
        if (success) {
            setPagos([]);
            venta.detalleVenta.length = 0;
            setVenta(DEFAULT_VENTA);
            navigate("/Ventas");
        }
    }, [success]);

    useEffect(() => {
        if (alert) setOpenDialog(true);
    }, [alert]);

    return (
        <Box sx={{ width: '100%', p: 1 }}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={mutation.isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <AlertDialog  open={ openDialog } handleClose={ handleClose } alert={alert} error={error} />

            <Box  >
                <Venta venta={venta} setVenta={setVenta} productos={productos} onInputDateChange={onInputDateChange} />
            </Box>
            <Box  >
                <Pagos idVenta={id} pagos={pagos} setPagos={setPagos} montoTotal={total} />
            </Box>

            <Box display="flex" justifyContent="flex-end" sx={{ p: 2 }} >
                <Button color="primary" onClick={() => handleCancel()}>Cancelar</Button>
                {!id ? (<Button color="primary" variant="contained" onClick={() => handleSave()}
                    endIcon={< SaveIcon />} >Guardar</Button>) : null}
            </Box>
        </Box>
    );
}

export default DetalleVenta