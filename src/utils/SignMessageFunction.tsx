import Web3 from "web3";
import { uiConsole } from './Utils';

/**
 * 
 * @param {string} message - The message to be signed.
 * @param {any} provider - The Web3 provider instance.
 * @return {Promise<string>} The signed message.
 * @throws Will throw an error if the provider is not initialized or if the signing process fails.
 */

export const signMessage = async (message: string, provider: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      message,
      fromAddress,
      "test password!" // configure your own password here.
    );
    // uiConsole(signedMessage);

    if (!signedMessage) {
      throw new Error("Failed to sign message");
    }

    return signedMessage;
  };
// import { ethers, JsonRpcProvider} from 'ethers';
// import { CONTRACT_ADDRESS } from '../assets/constants/index.ts';
// import { MoneybankABI } from '../assets/abis/MoneybankABI';

// if(process.env.REACT_APP_WALLET_PRIVATE_KEY === undefined || process.env.REACT_APP_ARBITRUM_SEPOLIA_RPC_URL === null) throw new Error("REACT_APP_WALLET_PRIVATE_KEY or REACT_APP_ARBITRUM_SEPOLIA_RPC_URL is not defined");
// const provider = new JsonRpcProvider(process.env.REACT_APP_ARBITRUM_SEPOLIA_RPC_URL);
// const wallet = new ethers.Wallet(process.env.REACT_APP_WALLET_PRIVATE_KEY, provider);
// const contract = new ethers.Contract(CONTRACT_ADDRESS, MoneybankABI, wallet);

// Función genérica para firmar transacciones
// async function signTransaction(functionName, params) {
//   // Crear el mensaje a firmar
//   const message = JSON.stringify({
//     functionName: functionName,
//     params: params,
//     nonce: Date.now() // Para evitar repeticiones
//   });

//   // Firmar el mensaje
//   const signature = await wallet.signMessage(message);

//   return { message, signature };
// }
// recipient is the address that should be paid.
// amount, in wei, specifies how much ether should be sent.
// nonce can be any unique number to prevent replay attacks
// contractAddress is used to prevent cross-contract replay attacks
// function signPayment(recipient, amount, nonce, contractAddress, callback) {
//   var hash = "0x" + abi.soliditySHA3(
//       ["address", "uint256", "uint256", "address"],
//       [recipient, amount, nonce, contractAddress]
//   ).toString("hex");

//   web3.eth.personal.sign(hash, web3.eth.defaultAccount, callback);
// }