import { useState } from 'react';

//Solucion para manejar tareas asincronas en componentes, intentaba corregir problemas con el estado de isLoading 
export function useAsyncTask() {
  const [isLoading, setIsLoading] = useState(false);

  const runTask = async (task: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await task();
    } catch (error) {
      console.error("Error en la tarea:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, runTask };
}