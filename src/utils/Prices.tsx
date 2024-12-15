import axios, { AxiosResponse } from 'axios';

const url = 'https://api.coingecko.com/api/v3/coins/markets';   // URL de la API de CoinGecko
const params = {
    vs_currency: 'usd',
    order: 'market_cap_desc',   // Orden de monedas segun market cap
    per_page: 50,               // Pide las primeras x monedas
    page: 1,
    sparkline: false
};

// Definición de tipos para los datos de las monedas obtenidos de CoinGecko
interface CoinData {
    symbol: string;
    current_price: number;
    name: string;
}

// Definición de tipos para los parámetros de entrada de la función
interface RequestedCoinsParams {
    requestedCoins: string[];
}
// Definición de tipos para los datos de las monedas obtenidos de CoinGecko
interface CoinData {
    symbol: string;
    current_price: number;
    name: string;
}
/**
 * Function to retrieve a list of coins and their prices from CoinGecko API.
 *
 * @return {Promise<Array<{ name: string; symbol: string; price: number }>>} 
 *      A promise that resolves to an array of objects with the name, symbol, and price of each coin.
 */
export async function coinGeckoGetPricesList(): Promise<Array<{ name: string; symbol: string; price: number }>> {
    try {
        const { data }: AxiosResponse<CoinData[]> = await axios.get(url, { params });

        const result = data.map((coin: CoinData) => ({
            name: coin.name,
            symbol: coin.symbol,
            price: coin.current_price
        }));
        
        return result
    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
}



/**
 * Fetches the prices of specific cryptocurrencies from CoinGecko API.
 *
 * @param {RequestedCoinsParams} params - An object containing the list of cryptocurrency symbols to fetch.
 * @return {Promise<{ [key: string]: { precio: number; nombre: string } }>} A promise that resolves to an object with the requested cryptocurrency prices.
 */
export async function coinGeckoGetPricesKV({ requestedCoins }: RequestedCoinsParams): Promise<{ [key: string]: { precio: number; nombre: string } }> {
    try {
        // Asumiendo que 'url' y 'params' están definidos en otro lugar de tu código
        const { data }: AxiosResponse<CoinData[]> = await axios.get(url, { params });

        const result = data.reduce((acc: { [x: string]: { precio: number; nombre: string; }; }, coin: CoinData) => { // Aquí especificamos el tipo de 'coin'
            if (requestedCoins.includes(coin.symbol)) {
                acc[coin.symbol] = { precio: coin.current_price, nombre: coin.name };
            }
            return acc;
        }, {});

        return result;
    } catch (error) {
        console.error('Error: ', error);
        return{};
    }
}
// coinGeckoGetPricesList().then(coins => {
//     console.log(coins)
// });

// coinGeckoGetPricesKV(["btc","usdc", "eth", "sol", "icp"]).then(coins => {
//     console.log(coins)
// })