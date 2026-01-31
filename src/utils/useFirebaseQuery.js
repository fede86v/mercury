import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useLoading } from './LoadingContext';

// Contador global para rastrear queries activas
let activeQueries = new Set();

// Callbacks registrados para actualizar el loading
const loadingCallbacks = new Set();

const updateGlobalLoading = () => {
  const shouldBeLoading = activeQueries.size > 0;
  loadingCallbacks.forEach(callback => callback(shouldBeLoading));
};

export const useFirebaseQuery = (queryKey, queryFn, options = {}) => {
  const { setIsLoading } = useLoading();
  const queryIdRef = useRef(Symbol('query-id'));

  const query = useQuery(queryKey, queryFn, {
    ...options,
    onSettled: (data, error) => {
      // Remover esta query del conjunto de queries activas
      activeQueries.delete(queryIdRef.current);
      updateGlobalLoading();
      
      if (options.onSettled) {
        options.onSettled(data, error);
      }
    },
  });

  // Registrar callback y manejar el estado de loading
  useEffect(() => {
    // Registrar el callback si no está registrado
    if (!loadingCallbacks.has(setIsLoading)) {
      loadingCallbacks.add(setIsLoading);
    }

    // Agregar esta query al conjunto de queries activas si está cargando
    if (query.isLoading) {
      activeQueries.add(queryIdRef.current);
      updateGlobalLoading();
    }

    // Cleanup: remover del conjunto cuando el componente se desmonta o la query termina
    return () => {
      activeQueries.delete(queryIdRef.current);
      updateGlobalLoading();
    };
  }, [query.isLoading, setIsLoading]);

  return query;
};