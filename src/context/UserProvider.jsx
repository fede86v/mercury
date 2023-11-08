import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react'
import { auth } from '../firebase';
import { useFirestore } from '../utils/useFirestore';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(false);
    const [error, setError] = useState(null);
    const { usuario, error: firebaseError, getUsuarioFull, createUsuarioFull, updateUsuarioFull } = useFirestore();

    const loginUserByMail = (email, pass) => {
        signInWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
                // Signed in
                const us = userCredential.user;
                getUsuarioFull(us.email);
            })
            .catch((error) => {
                if (error.code === "auth/user-not-found") {
                    setError("Usuario inexistente");
                    return;
                }
                setError(error.code);
            });
    };

    const signInWithGoogle = () => {
        setError(null);
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const userg = result.user;
                const userInfo = result._tokenResponse;
                const user = {
                    uid: result.user.uid,
                    email: userg.email,
                    fechaCreacion: Date.now(),
                    fechaInactivo: null,
                    fotoURL: userg.photoURL,
                    activado: false,
                    persona: {
                        nombre: userInfo.firstName,
                        apellido: userInfo.lastName,
                        telefono: userg.phoneNumber,
                    }
                };
                getUsuarioFull(user.email).then((res) => {
                    if (res === undefined) {
                        createUsuarioFull(user);
                    }
                });
            }).catch((error) => {
                setError(error.code);
            });
    };

    const createUserWithEmail = (email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const u = {
                    uid: result.user.uid,
                    email,
                    fechaInactivo: null,
                    activado: false,
                    persona: {
                        nombre: "",
                        apellido: ""
                    }
                };
                createUsuarioFull(u);
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    setError("Esta cuenta ya se encuentra en uso.");
                    return;
                }
                setError(error.code);
            });
    };

    const updateUser = (user) => {
        updateUsuarioFull(user);
    };

    const signOutUser = () => signOut(auth);

    useEffect(() => {
        const unsuscribe = onAuthStateChanged(auth, (us) => {
            if (us !== null) {
                getUsuarioFull(us.email);
            }
            else {
                setUser(null);
            }
        })
        return unsuscribe
    }, []);

    useEffect(() => {
        setUser(usuario);
        setError(null);
    }, [usuario]);

    useEffect(() => {
        setError(firebaseError);
    }, [firebaseError]);

    return (
        <UserContext.Provider value={{ user, error, setUser, loginUserByMail, signInWithGoogle, signOutUser, createUserWithEmail, updateUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider