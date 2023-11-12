import { useContext, useState } from 'react'
import { TransactionService } from './databaseService'
import { useMutation } from '@tanstack/react-query'
import { UserContext } from '../context/UserProvider';

export const useTransaction = () => {
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { user } = useContext(UserContext);

    const saveData = (data) => {
        setAlert(null);
        if (!data.id) {
            const product = { ...data, empresaId: user.empresaId }
            return TransactionService.create(product, user);
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
        let validation = data.precioVenta < data.precioCompra;
        if (validation) setAlert(`Precio de Venta debe ser mayor al de compra`);

        validation = data.precioVenta < 0
        if (validation) setAlert(`Precio de Venta invalido`);

        validation = data.precioCompra < 0
        if (validation) setAlert(`Precio de Compra invalido`);

        // 2. if Success then save
        if (!validation) mutation.mutate(data);
    }

    const onSetAlert = (data) => setAlert(data);
    const onSetError = (data) => setError(data);

    return {
        error,
        alert,
        success,
        onSave,
        onSetAlert,
        onSetError,
    }
}
