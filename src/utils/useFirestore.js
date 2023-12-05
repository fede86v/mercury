import { useState } from 'react'
import { db } from "../firebase"
import { collection, where, query, getDocs, getDoc, doc, setDoc, runTransaction, addDoc } from "firebase/firestore"

export const useFirestore = () => {
  const [usuario, setUsuario] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  /* Usuarios */
  const getUsuario = async (email) => {
    try {
      setLoading(true);
      const docRef = doc(db, "usuarios", email);
      const querySnapshot = await getDoc(docRef);
      let dataDB = querySnapshot.data();

      if (setUsuario) {
        setUsuario(dataDB);
      }
      return dataDB;
    }
    catch (error) {
      setError(error.code);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  };
  const getUsuarioFull = async (email) => {
    try {
      setLoading(true);
      const docRef = doc(db, "usuarios", email);
      const querySnapshot = await getDoc(docRef);
      let dataDB = querySnapshot.data();

      const personaDB = await getPersona(dataDB.uid);
      dataDB = { ...dataDB, ...personaDB };

      setUsuario(dataDB);
      return dataDB;
    }
    catch (error) {
      setError(error.code);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  };
  const existeUsuario = async (email) => {
    try {
      setLoading(true);
      const docRef = doc(db, "usuarios", email);
      const querySnapshot = await getDoc(docRef);
      if (querySnapshot.empty) {
        return false;
      }
      return querySnapshot.data();
    }
    catch (error) {
      console.log(error);
      setError(error.code);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  };
  const createUsuario = async (us) => {
    setLoading(true);
    const usuarioFlat = {
      uid: us.uid === undefined ? null : us.uid,
      email: us.email,
      empresaId: us.empresaId,
      empresa: us.empresa,
      fotoURL: us.fotoURL === undefined ? null : us.fotoURL,
      fechaCreacion: Date.now(),
      fechaActualizacion: Date.now(),
      fechaInactivo: null,
      activado: false
    };

    const usuarioRef = doc(db, "usuarios", us.email);
    let hasError = false;
    await setDoc(usuarioRef, usuarioFlat)
      .then(() => {
        setLoading(false);
      })
      .catch(error => {
        hasError = true;
        console.log("createUsuario" + error);
        setError(error.code);
        setLoading(false);
      });

    return hasError ? null : usuarioFlat;
  };
  const createUsuarioFull = async (us) => {
    setLoading(true);
    const usuarioFlat = {
      uid: us.uid,
      email: us.email,
      empresaId: us.empresaId,
      empresa: us.empresa,
      fotoURL: us.fotoURL === undefined ? null : us.fotoURL,
      fechaCreacion: Date.now(),
      fechaActualizacion: Date.now(),
      fechaInactivo: null,
      activado: false
    };
    const personaFlat = {
      uid: us.uid,
      nombre: us.nombre,
      apellido: us.apellido,
      email: us.email,
      fechaCreacion: Date.now(),
      fechaActualizacion: Date.now(),
    };
    const usuarioRef = doc(db, "usuarios", us.email);
    const personaRef = doc(db, "personas", us.uid);
    let hasError = false;
    try {
      await runTransaction(db, async (transaction) => {
        transaction.set(usuarioRef, usuarioFlat);
        transaction.set(personaRef, personaFlat);
      });

      setLoading(false);
      setUsuario(us);
    }
    catch (error) {

      console.log("createUsuarioFull" + error);
      hasError = true;
      setError(error.code);
      setLoading(false);
    }
    return hasError ? null : us;
  };
  const updateUsuario = async (us) => {
    const usuarioFlat = {
      fechaActualizacion: Date.now(),
      fotoURL: us.fotoURL === undefined ? null : us.fotoURL,
      activado: us.activado,
    };

    setLoading(true);

    const usuarioRef = doc(db, "usuarios", us.email);
    await setDoc(usuarioRef, usuarioFlat, { merge: true })
      .then(() => {
        setLoading(false);
      })
      .catch(error => {
        setError(error.code);
        setLoading(false);
      });
    return { ...us, "fechaActualizacion": usuarioFlat.fechaActualizacion };
  };
  const updateUsuarioFull = async (us) => {
    setLoading(true);
    const usuarioFlat = {
      email: us.email,
      fechaActualizacion: Date.now(),
      fechaCreacion: Date.now(),
      fotoURL: us.fotoURL === undefined ? null : us.fotoURL,
      empresaId: us.empresaId,
      empresa: us.empresa,
      activado: us.activado
    };
    const personaFlat = {
      uid: us.uid,
      email: us.email,
      nombre: us.nombre,
      apellido: us.apellido,
      fechaNacimiento: us.fechaNacimiento,
      fechaActualizacion: Date.now(),
      fechaCreacion: Date.now(),
      genero: us.genero,
      tipoDocumento: us.tipoDocumento,
      numeroDocumento: us.numeroDocumento
    };

    const usuarioRef = doc(db, "usuarios", us.email);
    const personaRef = doc(db, "personas", us.uid);
    let hasError = false;
    await runTransaction(db, async (transaction) => {
      transaction.set(usuarioRef, usuarioFlat, { merge: true });
      transaction.set(personaRef, personaFlat, { merge: true });
    }).then(() => {
      setUsuario(us);
      setLoading(false);
    }).catch((error) => {
      console.log("updateUsuarioFull" + error);
      hasError = true;
      setError(error.code);
      setLoading(false);
    });

    return hasError ? null : us;
  };
  const updateUsuarioRoles = async (email, esEntrenador = null, esAdmin = null, esSocio = null) => {
    setLoading(true);
    //agregar validacion de permisos de administrador. 

    const existeUsuario = await existeUsuario(email);

    if (!existeUsuario) return null;

    let usuarioRef = doc(db, "usuarios", email);

    if (esEntrenador != null) {
      existeUsuario.esEntrenador = esEntrenador;
    }
    if (esAdmin != null) {
      existeUsuario.esAdmin = esAdmin;
    }
    if (esSocio != null) {
      existeUsuario.esSocio = esSocio;
    }
    existeUsuario.fechaActualizacio = Date.now();

    await setDoc(usuarioRef, existeUsuario, { merge: true })
      .then(() => {
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error)
        setError(error.code);
        setLoading(false);
      });
    return existeUsuario;
  };
  const validateCodigoAcceso = async (pin) => {
    try {
      setLoading(true);
      const userRef = collection(db, "usuarios");
      const q = query(userRef, where("codigoAcceso", "==", pin));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    }
    catch (error) {
      setError(error.code);
      setLoading(false);
      return null;
    }
  };

  /* Asistencia */
  const createAsistencia = async (email) => {
    setLoading(true);
    const date = new Date(Date.now());

    const splitted0 = date.toLocaleString().split(' ')[0].split(',').splice(0, 2);
    const fechaAsistencia = splitted0[0].toString().replace(/\//g, "-")
    const splitted = date.toLocaleString().split(' ')[1].split(':').splice(0, 2);
    const horaAsistencia = splitted.join(':');

    const asistenciaRef = doc(db, "usuarios", email, "asistencia", fechaAsistencia);
    console.log(asistenciaRef);
    let asistenciaFlat = {};

    // 1 - Validar si el usuario ya marco entrada 
    const asistencia = await getAsistencia(email, fechaAsistencia);

    if (asistencia === null) {

      // 2 - Si no marco entrada registrar como hora de ingreso
      asistenciaFlat = {
        entrada: horaAsistencia,
        salida: null
      };
    }
    else {
      // 3 - Si ya marco entrada registrar como hora de salida
      asistenciaFlat = {
        ...asistencia,
        salida: horaAsistencia
      };
    }

    await setDoc(asistenciaRef, asistenciaFlat, { merge: true })
      .then(() => {
        setLoading(false);
      })
      .catch(function (error) {
        setError(error.code);
        setLoading(false);
        return null;
      });
    return asistenciaFlat;
  };
  const updateAsistencia = async (email, asistencia) => {
    setLoading(true);

    const asistenciaRef = doc(db, "usuarios", email, "asistencia", asistencia.fechaAsistencia);

    await setDoc(asistenciaRef, asistencia, { merge: true })
      .then(() => {
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error)
        setError(error.code);
        setLoading(false);
      });
    return asistencia;

  };
  const getAsistencia = async (email, fechaAsistencia) => {
    try {
      setLoading(true);
      const asistenciaRef = doc(db, "usuarios", email, "asistencia", fechaAsistencia);
      const querySnapshot = await getDoc(asistenciaRef);

      if (!querySnapshot.exists()) {
        return null;
      }
      else {
        const dataDB = querySnapshot.data();
        setLoading(false);
        return dataDB;
      }
    }
    catch (error) {
      setError(error.code);
      setLoading(false);
      return null;
    }
  };

  /* Persona */
  const getPersona = async (uid) => {
    try {
      setLoading(true);
      const docRef = doc(db, "personas", uid);
      const querySnapshot = await getDoc(docRef);
      const dataDB = querySnapshot.data();
      setLoading(false);
      return dataDB;
    }
    catch (error) {
      setError(error.code);
      setLoading(false);
    }
  };
  const createPersona = async (persona) => {
    const personaFlat = {
      nombre: persona.nombre,
      apellido: persona.apellido,
      email: persona.email,
      codigoArea: persona.codigoArea,
      telefono: persona.telefono,
      fechaActualizacion: Date.now(),
      fechaCreacion: Date.now(),
      fechaNacimiento: persona.fechaNacimiento,
      genero: persona.genero,
      tipoDocumento: persona.tipoDocumento,
      numeroDocumento: persona.numeroDocumento,
    };

    setLoading(true);
    const personaRef = collection(db, "personas");

    await addDoc(personaRef, personaFlat)
      .then(personaDoc => {
        persona = { ...personaFlat, uid: personaDoc.id };
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setError(error.code);
        setLoading(false);
      });

    return persona;
  };
  const updatePersona = async (persona) => {
    const personaFlat = {
      nombre: persona.nombre,
      apellido: persona.apellido,
      email: persona.email,
      codigoArea: persona.codigoArea,
      telefono: persona.telefono,
      fechaActualizacion: Date.now(),
      fechaNacimiento: persona.fechaNacimiento,
      genero: persona.genero,
      tipoDocumento: persona.tipoDocumento,
      numeroDocumento: persona.numeroDocumento,
    };

    setLoading(true);
    const personaRef = doc(db, "personas", persona.uid);
    await setDoc(personaRef, personaFlat, { merge: true })
      .then(() => {
        setLoading(false);
      })
      .catch(error => {
        setError(error.code);
        setLoading(false);
      });
    return { ...persona, "fechaActualizacion": personaFlat.fechaActualizacion };
  };
  const validatePersona = async (email, tipoDocumento, numeroDocumento) => {
    try {
      setLoading(true);
      const peronaRef = collection(db, "personas");
      console.log("email " + email);
      if (email) {
        const q = query(peronaRef,
          where("email", "==", email));
        const querySnapshot = await getDocs(q);

        console.log(querySnapshot.empty ? null : { ...querySnapshot.docs[0].data(), uid: querySnapshot.docs[0].id });

        return querySnapshot.empty ? null : { ...querySnapshot.docs[0].data(), uid: querySnapshot.docs[0].id };
      }
      else {
        const q = query(peronaRef,
          where("tipoDocumento", "==", tipoDocumento),
          where("numeroDocumento", "==", numeroDocumento));
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty ? null : { ...querySnapshot.docs[0].data(), uid: querySnapshot.docs[0].id };
      }
    }
    catch (error) {
      console.log(error);
      setError(error.code);
      setLoading(false);
      return null;
    }
  };
  /* socios */
  const getSocio = async (uid) => {
    setLoading(true);
    const docRef = doc(db, "socios", uid);
    await getDoc(docRef)
      .then((querySnapshot) => {
        const dataDB = querySnapshot.data();
        setLoading(false);
        return dataDB;
      })
      .catch(error => {
        setError(error.code);
        setLoading(false);
      });
  };
  const getSocios = async () => {
    try {
      setLoading(true);
      const docRef = collection(db, "socios");
      const q = query(docRef);
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("Coleccion vacia");
        return [];
      }
      else {
        let socios = [];

        querySnapshot.forEach((doc) => {
          const socio = doc.data();

          socios.push({ ...socio, id: socio.uid });
        });

        setLoading(false);
        return socios;
      }
    }
    catch (error) {
      console.log(error);
      setError(error.code);
      setLoading(false);
      return null;
    }
  };
  const createSocio = async (soc) => {
    const socioFlat = {
      uid: soc.uid,
      email: soc.email,
      nombre: soc.nombre,
      apellido: soc.apellido,
      actividades: soc.actividades,
      frecuencia: soc.frecuencia,
      codigoArea: soc.codigoArea,
      telefono: soc.telefono,
      fechaVencimiento: soc.fechaVencimiento,
      genero: soc.genero,
      clasesRestantes: soc.clasesRestantes,
      totalClases: soc.totalClases,
      fechaActualizacion: Date.now(),
      fechaCreacion: Date.now(),
    };

    setLoading(true);
    const socioRef = doc(db, "socios", socioFlat.uid);
    setDoc(socioRef, socioFlat)
      .then(() => {
        setLoading(false);
        return socioFlat;
      })
      .catch(error => {
        setError(error.code);
        setLoading(false);
      });
  };
  const updateSocio = async (soc) => {
    const socioFlat = {
      uid: soc.uid,
      email: soc.email,
      nombre: soc.nombre,
      apellido: soc.apellido,
      actividades: soc.actividades,
      frecuencia: soc.frecuencia,
      codigoArea: soc.codigoArea,
      telefono: soc.telefono,
      fechaVencimiento: soc.fechaVencimiento,
      genero: soc.genero,
      clasesRestantes: soc.clasesRestantes,
      totalClases: soc.totalClases,
      fechaActualizacion: Date.now(),
    };
    setLoading(true);
    const socioRef = doc(db, "socios", socioFlat.uid);
    await setDoc(socioRef, socioFlat, { merge: true })
      .then(() => {
        setLoading(false);
      })
      .catch(error => {
        setError(error.code);
        setLoading(false);
      });
    return { ...soc, "fechaActualizacion": socioFlat.fechaActualizacion };
  };
  const validateSocio = async (email) => {
    try {
      setLoading(true);
      const peronaRef = collection(db, "socios");
      const q = query(peronaRef,
        where("email", "==", email));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty ? null : querySnapshot.docs[0].data();
    }
    catch (error) {
      console.log(error);
      setError(error.code);
      setLoading(false);
      return null;
    }
  };


  return {
    usuario,
    error,
    loading,
    getUsuario,
    getUsuarioFull,
    getPersona,
    getSocio,
    getSocios,
    getAsistencia,

    updateUsuario,
    updateUsuarioFull,
    updatePersona,
    updateSocio,
    updateAsistencia,

    createUsuario,
    createUsuarioFull,
    createPersona,
    createSocio,
    createAsistencia,

    validateCodigoAcceso,
    validatePersona,
    validateSocio,

    existeUsuario
  };
}