import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useLoading } from './LoadingContext';

// Contador global para rastrear queries activas
let activeQueries = new Set();

// Callbacks registrados para actualizar el loading con contador de referencias
const loadingCallbacks = new Map();

const updateGlobalLoading = () => {
  const shouldBeLoading = activeQueries.size > 0;
  loadingCallbacks.forEach((count, callback) => {
    if (count > 0) {
      callback(shouldBeLoading);
    }
  });
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
    // Capturar el ID de la query para el cleanup
    const queryId = queryIdRef.current;

    // Incrementar contador de referencias para este callback
    const currentCount = loadingCallbacks.get(setIsLoading) || 0;
    loadingCallbacks.set(setIsLoading, currentCount + 1);

    // Agregar esta query al conjunto de queries activas si está cargando
    if (query.isLoading) {
      activeQueries.add(queryId);
      updateGlobalLoading();
    }

    // Cleanup: remover del conjunto y decrementar contador cuando el componente se desmonta
    return () => {
      activeQueries.delete(queryId);
      const count = loadingCallbacks.get(setIsLoading) || 0;
      if (count > 1) {
        loadingCallbacks.set(setIsLoading, count - 1);
      } else {
        loadingCallbacks.delete(setIsLoading);
      }
      updateGlobalLoading();
    };
  }, [query.isLoading, setIsLoading]);

  return query;
};