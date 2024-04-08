import { useContext, useState } from 'react'
import { TransactionService, TransactionDetailService, PaymentService, ProductService } from './databaseService'
import { useMutation } from '@tanstack/react-query'
import { UserContext } from '../context/UserProvider';
import dayjs from 'dayjs';

export const useTransaction = () => {
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { user } = useContext(UserContext);

    const saveData = async (data) => {
        setAlert(null);

        if (!data.id) {
            /* Crear venta */
            const venta = {
                total: data.total,
                subtotal: data.subtotal,
                fechaVenta: dayjs(data.fechaVenta).valueOf(),
                descuento: data.descuento,
                vendedorId: data.vendedor.id,
                vendedor: data.vendedor.nombre,
                clienteId: data.cliente.id
            };
            
            const newVenta = await TransactionService.create(venta, user);

            const { detalleVenta, pagos } = data;

            let newDetalle = [];
            detalleVenta.forEach(async (item) => {
                /* Update Stock */
                const producto = await ProductService.getOne(item.id);
                await ProductService.update(producto.id, { ...producto, cantidad: producto.cantidad - 1 }, user);

                const itemVenta = {
                    ventaId: newVenta.id,
                    productoId: item.id,
                    descripcion: item.descripcion,
                    codigo: item.codigo,
                    precio: item.precio,
                    cantidad: item.cantidad,
                    descuento: item.descuento,
                    importe: item.importe
                };
                const detalle = await TransactionDetailService.create(itemVenta, user);
                newDetalle.push(detalle);
            });

            let newPagos = [];
            pagos.forEach(async (item) => {
                const itemPago = {
                    ventaId: newVenta.id,
                    fechaPago: dayjs(data.fechaVenta).valueOf(),
                    metodoPago: item.metodoPago,
                    monto: item.monto,
                    comprobante: item.comprobante
                };
                const detalle = await PaymentService.create(itemPago, user);
                newPagos.push(detalle);
            });

            return { ...newVenta, newDetalle, newPagos }
        }
    }

    // create mutation
    const mutation = useMutation((data) => saveData(data), {
        onError: (error) => setAlert(error.message),
        onSuccess: () => setSuccess(true)
    })

    const onSave = (data) => {
        setAlert(null);
        setError(null);

        // 1. Validate
        let validation = data.total <= 0;
        if (validation) {
            setAlert(`No ha ingresado productos.`);
            return;
        }

        validation = (data.pagos.length === 0);
        if (validation) {
            setAlert(`No ha ingresado el pago para esta compra.`);
            return;
        }

        validation = data.vendedor === null
        if (validation) {
            setAlert(`Vendedor es requerido.`);
            return;
        }
        // 2. if Success then save
        mutation.mutate(data);
    }

    const onSetAlert = (data) => setAlert(data);
    const onSetError = (data) => setError(data);

    return {
        error,
        alert,
        success,
        mutation,
        onSave,
        onSetAlert,
        onSetError,
    }
}
