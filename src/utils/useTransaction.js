import { useContext, useState } from 'react'
import { TransactionService, TransactionDetailService, PaymentService, ProductService } from './databaseService'
import { useMutation } from '@tanstack/react-query'
import { UserContext } from '../context/UserProvider';

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
                    metodoPago: item.metodoPago,
                    monto: item.monto,
                    comprobante: item.comprobante
                };
                const detalle = await PaymentService.create(itemPago, user);
                newPagos.push(detalle);
            });

            return { ...newVenta, newDetalle, newPagos }
        }
        else {
            return TransactionService.update(data.id, data, user);
        }
    }

    // create mutation
    const mutation = useMutation((data) => saveData(data), {
        onError: (error) => setError(error.message),
        onSuccess: () => setSuccess(true)
    })

    const onSave = (data) => {
        // 1. Validate
        let validation = data.total > 0;
        if (validation) setAlert(`No ha ingresado productos.`);

        validation = data.vendedor === null
        if (validation) setAlert(`Vendedor es requerido.`);

        // 2. if Success then save
        if (!validation) mutation.mutate(data);
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
