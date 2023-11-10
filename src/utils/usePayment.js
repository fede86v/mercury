import { useContext, useState } from 'react'
import { TransactionService } from './databaseService'
import { useMutation } from '@tanstack/react-query'
import { UserContext } from '../context/UserProvider';

export const usePayment = () => {
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { user } = useContext(UserContext);

    const saveData = (data) => {
        console.log(data);
        setAlert(null);
        return TransactionService.create(data, user);
    }

    // create mutation
    const mutation = useMutation((data) => saveData(data), {
        onError: (error) => setError(error.message),
        onSuccess: () => setSuccess(true)
    })

    const onSave = (data) => {
        // 1. Validate
        let validation = data.monto !== (data.cuota - data.descuento)
        if (validation) setAlert(`Monto invalido`);

        validation = data.monto < 0
        if (validation) setAlert(`Monto invalido`);

        validation = data.descuento > 100
        if (validation) setAlert(`Descuento invalido`);

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
