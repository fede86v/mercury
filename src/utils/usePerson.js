import { useContext, useState } from 'react'
import { EmployeeService, ClientService } from './databaseService'
import { useMutation } from '@tanstack/react-query'
import { UserContext } from '../context/UserProvider';

export const usePerson = () => {
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [result, setResult] = useState(null);
    const { user } = useContext(UserContext);

    const saveData = async (data) => {
        setAlert(null);
        const persona = { ...data.persona }

        if (data.tipoPersona === "vendedor") {
            if (!persona.id) {
                const result = await EmployeeService.create(persona, user);
                setResult(result);
            }
            else {
                const result = await EmployeeService.update(persona.id, persona, user);
                setResult(result);
            }
        }
        if (data.tipoPersona === "cliente") {
            if (!persona.id) {
                const result = await ClientService.create(persona, user);
                setResult(result);
            }
            else {
                const result = await ClientService.update(persona.id, persona, user);
                setResult(result);
            }
        }
    }

    // create mutation
    const mutation = useMutation((data) => saveData(data), {
        onError: (error) => setError(error.message),
        onSuccess: () => setSuccess(true)
    })

    const onSave = (data, tipoPersona) => {
        if (data.nombre.trim() === "") {
            setAlert(`Debe ingresar un Nombre`);
            return;
        }
        if (data.apellido.trim() === "") {
            setAlert(`Debe ingresar un Apellido`);
            return;
        }
        if (data.tipoDocumento.trim() === "") {
            setAlert(`Debe ingresar un Tipo de Documento`);
            return;
        }

        const object = {
            persona: data,
            tipoPersona: tipoPersona
        }
        // 2. if Success then save
        mutation.mutate(object);
    }

    const onSetAlert = (data) => setAlert(data);
    const onSetError = (data) => setError(data);

    return {
        error,
        alert,
        success,
        result,
        onSave,
        onSetAlert,
        onSetError,
    }
}
