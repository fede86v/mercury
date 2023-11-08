import { useState } from 'react'
import dayjs from 'dayjs';

export const useForm = (initialForm = {}) => {
    const [formState, setFormState] = useState(initialForm);

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value,
        });
    }

    const onInputDateChange = ({ target }) => {
        const { name, value } = target;
        if (!dayjs(value).isValid) {
            setFormState({
                ...formState,
                [name]: value,
            });
        }
        else {
            setFormState({
                ...formState,
                [name]: dayjs(value).valueOf(),
            });
        }
    }

    const onResetForm = () => {
        setFormState(initialForm);
    }

    return {
        ...formState,
        formState,
        onInputChange,
        onInputDateChange,
        onResetForm,
        setFormState
    }
}