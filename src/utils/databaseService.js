import { db } from "../firebase";
import { collection, where, query, getDocs, getDoc, doc, setDoc, addDoc } from "firebase/firestore"

class DatabaseService {
    currentCollection;
    collectionName;

    constructor(collectionName) {
        this.currentCollection = collection(db, collectionName);
        this.collectionName = collectionName;
    }

    // This returns a list of documents
    getAll = async () => {
        const snapshot = await getDocs(query(this.currentCollection));
        return snapshot.empty
            ? []
            : snapshot.docs.map((doc) => {
                return {
                    ...doc.data(),
                    id: doc.id,
                };
            });
    };

    // This returns a list of documents
    getQuery = async (field, condition, value) => {
        const q = query(this.currentCollection, where(field, condition, value))
        const snapshot = await getDocs(q);

        return snapshot.empty
            ? []
            : snapshot.docs.map((doc) => {
                return {
                    ...doc.data(),
                    id: doc.id,
                };
            });
    };

    //This returns one document
    getSubcollection = async (id, subcollectionName) => {
        if (!id) return null;
        var col = collection(db, this.collectionName, id, subcollectionName);
        const snapshot = await getDocs(query(col));

        return snapshot.empty
            ? []
            : snapshot.docs.map((doc) => {
                return {
                    ...doc.data(),
                    id: doc.id,
                };
            });
    };

    //This returns one document
    getOne = async (id) => {
        if (!id) return null;
        const docRef = doc(db, this.collectionName, id);
        const snapshot = await getDoc(docRef);

        if (snapshot.empty) return null;

        return {
            ...snapshot.data(),
            id: snapshot.id,
        };
    };

    // resolve a relation, returns the referenced document
    getReference = async (documentReference) => {
        const docRef = doc(db, documentReference);
        const snapshot = await getDoc(docRef);
        const data = snapshot.data();

        if (data && documentReference.id) {
            data.uid = documentReference.id;
        }

        return data;
    };

    // save a new document in the database
    create = async (values, user, id, subcollection = null) => {
        if (id != null) {
            if (!subcollection) {
                const docRef = doc(db, this.collectionName, id);
                return await setDoc(docRef, {
                    ...values,
                    id: docRef.id,
                    empresaId: user.empresaId,
                    fechaCreacion: Date.now(),
                    fechaActualizacion: Date.now(),
                    usuarioActualizacion: user.email,
                }).then((docref) => {
                    return {
                        ...docref.data,
                        id: docref.id,
                    };
                });
            }
            else {
                const col = collection(db, this.collectionName, id, subcollection);
                return await addDoc(col, {
                    ...values,
                    empresaId: user.empresaId,
                    fechaCreacion: Date.now(),
                    fechaActualizacion: Date.now(),
                    usuarioActualizacion: user.email,
                }).then((docref) => {
                    return {
                        ...docref.data,
                        id: docref.id,
                    };
                });
            }
        }
        else {
            return await addDoc(this.currentCollection, {
                ...values,
                empresaId: user.empresaId,
                fechaCreacion: Date.now(),
                fechaActualizacion: Date.now(),
                usuarioActualizacion: user.email,
            }).then((docref) => {
                return {
                    ...docref.data,
                    id: docref.id,
                };
            });
        }
    };

    // update an existing document with new data
    update = async (id, values, user) => {
        const docRef = doc(db, this.collectionName, id)
        return await setDoc(docRef, {
            ...values,
            fechaActualizacion: Date.now(),
            usuarioActualizacion: user.email,
        },
            { merge: true });
    };

    // delete an existing document from the collection
    deleteSoft = async (id, user) => {
        const docRef = doc(db, this.collectionName, id)
        return await setDoc(docRef, {
            fechaDeshabilitado: Date.now(),
            usuarioActualizacion: user.email,
        },
            { merge: true });
    };
}

// Create services for each entity type
export const ClientService = new DatabaseService("clientes");
export const TransactionDetailService = new DatabaseService("detalleVentas");
export const CompanyService = new DatabaseService("empresas");
export const BrandService = new DatabaseService("marcas");
export const PaymentService = new DatabaseService("pagos");
export const PeopleService = new DatabaseService("personas");
export const ProductService = new DatabaseService("productos");
export const ProductTypeService = new DatabaseService("tipoProductos");
export const UserService = new DatabaseService("usuarios");
export const EmployeeService = new DatabaseService("vendedores");
export const TransactionService = new DatabaseService("ventas");