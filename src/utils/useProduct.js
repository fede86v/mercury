import { useContext, useState } from 'react'
import { ProductService } from './databaseService'
import { useMutation } from '@tanstack/react-query'
import { UserContext } from '../context/UserProvider';

export const useProduct = () => {
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { user } = useContext(UserContext);

    const saveData = (data) => {
        setAlert(null);
        if (!data.id) {
            return ProductService.create(data, user);
        }
        else {
            return ProductService.update(data.id, data, user);
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
        mutation,
        onSave,
        onSetAlert,
        onSetError,
    }
}
