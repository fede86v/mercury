import { useContext, useState } from 'react'
import { ProductTypeService, BrandService } from './databaseService'
import { useMutation } from '@tanstack/react-query'
import { UserContext } from '../context/UserProvider';

export const useConfig = () => {
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { user } = useContext(UserContext);

    const saveTipoProducto = (data) => {
        setAlert(null);
        if (!data.id) {
            const tipoProducto = { nombre: data.nombre };
            return ProductTypeService.create(tipoProducto, user);
        }
        else {
            return ProductTypeService.update(data.id, data, user);
        }
    };
    const saveMarca = (data) => {
        setAlert(null);
        if (!data.id) {
            const marca = { nombre: data.nombre };
            return BrandService.create(marca, user);
        }
        else {
            return ProductTypeService.update(data.id, data, user);
        }
    }

    // create mutation
    const tipoProductoMutation = useMutation((data) => saveTipoProducto(data), {
        onError: (error) => setError(error.message),
        onSuccess: () => setSuccess(true)
    });
    const brandMutation = useMutation((data) => saveMarca(data), {
        onError: (error) => setError(error.message),
        onSuccess: () => setSuccess(true)
    })
    const onSaveTipoProducto = (data) => {
        // 1. Validate
        if (!data.nombre) {
            setAlert(`Tipo de producto es requerido`);
            return;
        }
        tipoProductoMutation.mutate(data);
    };
    const onSaveMarca = (data) => {
        // 1. Validate
        if (!data.nombre) {
            setAlert(`Marca es requerido`);
            return;
        }
        brandMutation.mutate(data);
    };

    const onSetAlert = (data) => setAlert(data);
    const onSetError = (data) => setError(data);

    return {
        error,
        alert,
        success,
        onSaveTipoProducto,
        onSaveMarca,
        onSetAlert,
        onSetError,
    }
}
