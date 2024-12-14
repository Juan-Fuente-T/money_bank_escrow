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
