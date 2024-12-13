import { Contract, ethers } from "ethers";
import { useState } from "react";
import { CONTRACT_ADDRESS } from "../assets/constants";
import { USDTAddress } from "../assets/constants";

export function useEscrow(contract: Contract | null, tokenContract: Contract | null) {
    const [isLoading, setIsLoading] = useState(false);

    const createEscrow = async (value: string, price: string) => {
        setIsLoading(true);

        try {
            if (!contract || !tokenContract) throw new Error("Contract not found");
            // Convierte los valores entrantes como strings para evitar problemas de precisión
            const valueParsed = parseFloat(value);
            const priceParsed = parseFloat(price);
            console.log("valueParsed", valueParsed);
            console.log("priceParsed", priceParsed);
            
            // Validar que tanto el valor como el precio sean mayores que cero
            if (valueParsed <= 0 || priceParsed <= 0) {
              throw new Error("Valor o precio inválido");
            }
            // Valores de ejemplo
            // const valueFixed = ethers.FixedNumber.from(0.0002);
            // const pricePerEth = ethers.FixedNumber.from(2000.5);
            
            // Crear FixedNumber para USDT (6 decimales)
            const usdtAmount = ethers.FixedNumber.fromValue(
              ethers.parseUnits(valueParsed.toString(), 6),
              6
            );
            
            // Crear FixedNumber para el precio de ETH (18 decimales)
            const ethPrice = ethers.FixedNumber.fromValue(
              ethers.parseUnits(priceParsed.toString(), 18),
              18
            );
            console.log("usdtAmount", usdtAmount);
            console.log("ethPrice", ethPrice);
            // Calcular cuánto ETH equivale a 1 USDT
            const ethAmount = usdtAmount.mulUnsafe(ethPrice);
            
            // Convertir los valores a BigNumber para usar en las transacciones
            const usdtAmountBN = ethers.parseUnits(value, 6);
            const ethAmountBN = ethers.parseEther(ethAmount.toString());
            console.log("usdtAmountBN", usdtAmountBN);
            console.log("ethAmountBN", ethAmountBN);

            //Realizar el approve previo para permitir el envio de tokens
            // const addApproveTokenTx = await tokenContract.approve(CONTRACT_ADDRESS, valueInUSDTWei + fee, {
            const addApproveTokenTx = await tokenContract?.approve(CONTRACT_ADDRESS, usdtAmountBN, {
                gasLimit: 5000000,
            });
            await addApproveTokenTx.wait();

            //Creación del escrow de usdt
            // const receipt = await waitForTransaction(addEscrowTokenTx);
            const addEscrowTokenTx = await contract.createEscrowToken(usdtAmountBN, ethAmountBN, USDTAddress, {
                gasLimit: 5000000,
            });
            await addEscrowTokenTx.wait();
        } catch (error) {
            console.error("Error en createEscrow:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const cancelEscrow = async (offerId: number) => {
        if (!offerId) throw new Error("Offer ID no definido");
        setIsLoading(true);
        try {
          if (!contract || !tokenContract) throw new Error("Contract not found");
          const cancelTx = await contract?.cancelEscrow(offerId, {
            gasLimit: 5000000,
          });
          await cancelTx.wait();
        } catch (error) {
          console.error("Error en createEscrow:", error);
        } finally {
          setIsLoading(false);
        }
      };

    return { isLoading, createEscrow, cancelEscrow };
}
