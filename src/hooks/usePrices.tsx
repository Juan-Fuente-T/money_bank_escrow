import { useQuery } from '@tanstack/react-query';
import { coinGeckoGetPricesKV } from '../utils/Prices';

const fetchPrices = async () => {
  // Simula datos de prueba o realiza una llamada real a la API
//   const prices = await coinGeckoGetPricesKV({ requestedCoins: ['eth', 'usdt'] });

  // Datos de prueba para desarrollo
  const _prices = {
    eth: { precio: 2626.5, nombre: "Ethereum" },
    usdt: { precio: 1.01, nombre: "Tether" }
  };

  return _prices;
};

export const usePrices = () => {
    return useQuery({
      queryKey: ['cryptoPrices'], // Clave única para la consulta
      queryFn: fetchPrices, // Función de consulta
      staleTime: 60 * 1000, // Los datos se consideran frescos durante 1 minuto
      refetchInterval: 60 * 1000, // Revalida automáticamente cada minuto
      refetchOnWindowFocus: false, // No revalida al cambiar de ventana
    });
  };