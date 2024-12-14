import { useQuery } from '@tanstack/react-query';
import { coinGeckoGetPricesKV } from '../utils/Prices';

/**
 * Function to fetch cryptocurrency prices from CoinGecko API.
 *
 * @return {Promise<Object>} A promise that resolves to an object with the current cryptocurrency prices.
 */
const fetchPrices = async () => {
  // Realiza una llamada real a la API
  // console.log(`Fetching prices at ${new Date().toLocaleTimeString()}`);
  // const _prices = await coinGeckoGetPricesKV({ requestedCoins: ['eth', 'usdt'] });

  // Datos de prueba para desarrollo
  const _prices = {
    eth: { precio: 3426.5, nombre: "Ethereum" },
    usdt: { precio: 1.01, nombre: "Tether" }
  };

  return _prices;
};
/**
 * Hook to fetch cryptocurrency prices.
 *
 * @return {Object} An object containing:
 * - `data`: The current cryptocurrency prices from CoinGecko.
 * - `isLoading`: A boolean indicating if the data is still being fetched.
 * - `error`: Any error that occurred during the fetch operation.
 */
export const usePrices = () => {
  return useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchPrices,
    staleTime: 60 * 1000, // Los datos se consideran frescos durante 1 minuto
    refetchInterval: 60 * 1000, // Intervalo automático cada 60 segundos
    refetchIntervalInBackground: true, // Asegura que se ejecute incluso si la app está en background
    refetchOnMount: true, // Revalida al montar el componente
    refetchOnWindowFocus: false, // No revalida al cambiar de ventana
  });
  // export const usePrices = () => {
  //     return useQuery({
  //       queryKey: ['cryptoPrices'], // Clave única para la consulta
  //       queryFn: fetchPrices, // Función de consulta
  //       staleTime: 60 * 1000, // Los datos se consideran frescos durante 1 minuto
  //       refetchInterval: 60 * 1000, // Revalida automáticamente cada minuto
  //       refetchOnWindowFocus: false, // No revalida al cambiar de ventana
  //     });
  // };
};