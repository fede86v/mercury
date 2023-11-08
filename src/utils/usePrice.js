import { useContext, useState } from 'react'
import { PriceService } from './databaseService'
import { useMutation } from '@tanstack/react-query'
import { UserContext } from '../context/UserProvider';

export const usePrice = (activePrices) => {
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { user } = useContext(UserContext);

    const saveData = (data) => {
        if (data.id) {
            return PriceService.update(data.id, data, user);
        } else {
            return PriceService.create(data, user);
        }
    }

    // create mutation
    const mutation = useMutation((data) => saveData(data), {
        onError: (error) => setError(error.message),
        onSuccess: () => setSuccess(true)
    })

    const onSave = (data) => {
        // 1. Validate
        const validation = activePrices.filter(e => e.actividad === data.actividad && e.frecuencia === data.frecuencia && e.id !== data.id);

        // 2. if Success then save
        validation.length > 0
            ? setAlert(`Ya existe un precio establecido para ${data.actividad} ${data.frecuencia}`)
            : mutation.mutate(data);
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
