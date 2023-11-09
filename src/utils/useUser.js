import { useState } from 'react'
import { UserService, PeopleService } from './databaseService'
import { useMutation } from '@tanstack/react-query'

export const useUser = () => {
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("");
    const [usuario, setUsuario] = useState(null);
    const [success, setSuccess] = useState(false);

    const saveUser = (data) => {
        const usuarioFlat = {
            uid: data.uid,
            empresa: data.empresa,
            email: data.email,
            activado: data.activado,
            fotoURL: data.fotoURL === undefined ? null : data.fotoURL,
            fechaInactivo: null,
            };
            if (data.activado)
            {
                return UserService.create(usuarioFlat,usuarioFlat, data.email);
            }
            return UserService.update(usuarioFlat.email, usuarioFlat, usuarioFlat);
    };

    const savePerson = (data) => {
        const personFlat = {
            uid: data.uid,
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            codigoArea: data.codigoArea ?? null,
            telefono: data.telefono ?? null,
            fechaNacimiento: data.fechaNacimiento,
            genero: data.genero,
            tipoDocumento: data.tipoDocumento,
            numeroDocumento: data.numeroDocumento
            };
            if (data.activado)
            {
                return PeopleService.create(personFlat, personFlat);
            }
            return PeopleService.update(personFlat.uid, personFlat, personFlat);           
    };

    const getUser = async (email) => {
        const user = await UserService.getOne(email);
        if (user)
        {
            const person = await PeopleService.getOne(user.id);
            const fullUser = {...user, ...person}
            setUsuario(fullUser);
            return fullUser;
        }
        return null;
    }
    // create mutation
    const personMutation = useMutation((data) => savePerson(data), {
        onError: (error) => setError(error.message),
        onSuccess: () => setSuccess(true)
    });
    const userMutation = useMutation((data) => saveUser(data), {
        onError: (error) => setError(error.message),
        onSuccess: (data) => personMutation.mutate(data)
    });

    const onSave = (data) => {
        userMutation.mutate(data);
    };
    const onGet = (email) => {
        return getUser(email);
    };

    const onSetAlert = (data) => setAlert(data);
    const onSetError = (data) => setError(data);

    return {
        error,
        alert,
        success,
        usuario,
        onGet,
        onSave,
        onSetAlert,
        onSetError,
    }
}
