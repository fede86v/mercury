import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Backdrop } from '@mui/material';
import { useParams } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';
import { ProductService, TransactionService, PaymentService, TransactionDetailService, ClientService, EmployeeService } from '../utils';
import { UserContext } from '../context/UserProvider';
import { useForm, useTransaction } from '../utils';
import AlertDialog from '../components/common/AlertDialog';
import Venta from '../components/common/Venta';
import Pagos from '../components/common/Pagos';
import { useNavigate } from "react-router-dom";
import { useFirebaseQuery } from './../utils/useFirebaseQuery';

const DEFAULT_VENTA = {
    id: null,
    total: 0,
    subtotal: 0,
    descuento: 0,
    fechaVenta: new Date(),
    vendedor: { nombre: "", id: "" },
    cliente: { nombre: "Consumidor", apellido: "Final", numeroDocumento: "0", id: 0 },
    detalleVenta: []
};

const DetalleVenta = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { formState: venta, setFormState: setVenta, onInputDateChange } = useForm(DEFAULT_VENTA);
    const { formState: pagos, setFormState: setPagos } = useForm([]);
    const { error, alert, onSave, success, mutation, onSetAlert, onSetError } = useTransaction();
    const { user } = useContext(UserContext);
    const { total } = venta;
    const [openDialog, setOpenDialog] = useState(false);

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
            // No llamar setVenta aquí, el useEffect se encargará
            return final;
        }
        else {
            // Para nueva venta, retornar un objeto vacío - el useEffect se encargará del reset
            const empleado_caja = await EmployeeService.getQuery("numeroDocumento", "==", "0");
            const empleado_user = await EmployeeService.getQuery("email", "==", user.email);

            const v_caja = empleado_caja[0];
            const v_user = empleado_user[0];

            const venta_base = { ...DEFAULT_VENTA, vendedor: v_user ?? v_caja ?? { nombre: "", id: "" }, detalleVenta: [] };
            // No llamar setVenta aquí, el useEffect se encargará
            return venta_base;
        }
    };

    const getEmployeeList = async () => {
        const data = await EmployeeService.getQuery("empresaId", "==", user.empresaId);
        const filtered = data.filter(i => !i.fechaInactivo);
        const sortedData = filtered.sort((a, b) => {
            if (a.nombre < b.nombre) {
                return -1;
            }
            if (a.nombre > b.nombre) {
                return 1;
            }
            return 0;
        });
        return sortedData;
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

    const queryProductos = useFirebaseQuery(['products'], getProductList);
    const queryVenta = useFirebaseQuery(['venta', id], getVenta, { enabled: !!id }); // Solo ejecutar cuando hay id
    const queryVendedores = useFirebaseQuery(['vendedores'], getEmployeeList);

    // Resetear estado cuando cambia el id a undefined o cuando se monta sin id (nueva venta)
    useEffect(() => {
        if (!id) {
            // Nueva venta: resetear a valores por defecto inmediatamente con detalleVenta vacío
            const ventaReset = { 
                ...DEFAULT_VENTA, 
                detalleVenta: [], // Asegurar que esté vacío
                total: 0,
                subtotal: 0,
                descuento: 0,
                fechaVenta: new Date() // Asegurar fecha actual
            };
            setVenta(ventaReset);
            setPagos([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Sincronizar queryVenta.data con el estado local (solo cuando hay id)
    useEffect(() => {
        // Solo sincronizar si hay id Y hay datos (editar venta existente)
        // Si no hay id, no hacer nada para no sobrescribir el reset
        if (id && queryVenta.data) {
            const ventaData = {
                ...queryVenta.data,
                detalleVenta: queryVenta.data.detalleVenta ?? []
            };
            setVenta(ventaData);
            if (queryVenta.data.pagos) {
                setPagos(queryVenta.data.pagos);
            }
        }
    }, [queryVenta.data, id, setVenta, setPagos]);

    // Establecer vendedor por defecto cuando los vendedores estén cargados y es una nueva venta
    useEffect(() => {
        if (!id && queryVendedores.data && queryVendedores.data.length > 0) {
            const empleado_caja = queryVendedores.data.find(v => v.numeroDocumento === "0");
            const empleado_user = queryVendedores.data.find(v => v.email === user?.email);
            const vendedor = empleado_user ?? empleado_caja ?? { nombre: "", id: "" };
            setVenta(prev => ({ ...prev, vendedor }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, queryVendedores.data, user?.email]);

    useEffect(() => {
        return () => {
            setPagos([]);
            setVenta(DEFAULT_VENTA);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (success) {
            setPagos([]);
            setVenta(DEFAULT_VENTA);
            // Resetear success después de un pequeño delay para permitir la navegación
            setTimeout(() => {
                // El estado success se reseteará cuando el componente se desmonte
            }, 100);
            navigate("/Ventas");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, navigate]);

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

            <AlertDialog open={openDialog} handleClose={handleClose} alert={alert} error={error} />

            <Box  >
                <Venta venta={venta} setVenta={setVenta} productos={queryProductos.data ?? []} vendedores={queryVendedores.data ?? []} onInputDateChange={onInputDateChange} />
            </Box>
            <Box  >
                <Pagos idVenta={id} pagos={pagos} setPagos={setPagos} montoTotal={total} />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 1, p: { xs: 1, sm: 2 } }}>
                <Button color="primary" onClick={() => handleCancel()}>Cancelar</Button>
                {!id ? (<Button color="primary" variant="contained" onClick={() => handleSave()}
                    endIcon={< SaveIcon />} >Guardar</Button>) : null}
            </Box>
        </Box>
    );
}

export default DetalleVenta