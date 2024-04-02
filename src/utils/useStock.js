import { useContext, useState } from 'react'
import { ProductService } from './databaseService'
import { useMutation } from '@tanstack/react-query'
import { UserContext } from '../context/UserProvider';

export const useStock = () => {
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { user } = useContext(UserContext);

    const saveData = async (data) => {
        setAlert(null);
        const stock = [];
        data.forEach(async (item) => {
            /* Update Stock */
            const producto = await ProductService.getOne(item.id);
            const newProd = { ...producto, cantidad: Number(producto.cantidad) + Number(item.cantidad) };
            ProductService.update(producto.id, newProd, user);            
            stock.push(newProd);
        });
    };

    // create mutation
    const mutation = useMutation((data) => saveData(data), {
        onError: (error) => setError(error.message),
        onSuccess: () => setSuccess(true)
    });

    const onSave = (data) => {
        mutation.mutate(data);
    };

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
