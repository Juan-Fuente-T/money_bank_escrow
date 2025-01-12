import { Contract, ethers } from "ethers";
import { useState } from "react";
import { toast } from "react-toastify";
import { CONTRACT_ADDRESS } from "../assets/constants";

/**
 * Funds a user with fake USDT tokens.
 *
 * @param {Contract} tokenContract - The token contract instance.
 * @return {object} Functions to fund a user.
 */
export function useFundUser(contract: Contract | null, signer: any) {

    const fundUser = async (amount: string, userAddress: string) => {
        console.log("DATOS FUND", CONTRACT_ADDRESS, contract, amount, userAddress);
        try {
            if (!contract || !signer || !CONTRACT_ADDRESS || !userAddress || !amount) throw new Error("Contract not found");
            const valueParsed = parseFloat(amount.trim());
            if (valueParsed <= 0) {
                throw new Error("Invalid value");
            }
            // const usdtAmountBN = ethers.parseUnits(valueParsed.toString(), 6);
            const usdtAmountBN = ethers.parseUnits("100", 6);
            console.log("USDT AMOUNT", usdtAmountBN);
            const nonce = Date.now();
            const message = ethers.solidityPackedKeccak256(
                ['address', 'uint256', 'uint256'],
                [userAddress, usdtAmountBN, nonce]
              );
              const messageBytes = ethers.getBytes(message);
              const signature = signer?.signMessage(messageBytes);
            const fundUserTx = await contract?.fundUser(
                userAddress,
                usdtAmountBN,
                nonce,
                signature,
                {
                gasLimit: 5000000
              });
            await fundUserTx.wait();
            console.log("Se han enviado los USDT correctamente");
            toast.success("Has recibido los USDT correctamente");
        } catch (err) {
            if (err instanceof Error) {
                console.error(err);
                toast.error("No se han transferido los USDT debido a " + err.message);
            } else {
                console.error(err);
                toast.error("No se han podido transferir los USDT");
            }
        }
    };

    return { fundUser };
}
