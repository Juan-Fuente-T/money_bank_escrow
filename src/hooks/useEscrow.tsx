import { Contract, ethers } from "ethers";
import { useState } from "react";
import { CONTRACT_ADDRESS } from "../assets/constants";
import { USDTAddress } from "../assets/constants";
import { toast } from "react-toastify";

/**
 * Manages the creation, cancellation, and acceptance of escrows using the contract and token contract provided.
 *
 * @param {Contract | null} contract - The main contract instance.
 * @param {Contract | null} tokenContract - The token contract instance.
 * @return {object} Functions to create, cancel, and accept escrows.
 */
export function useEscrow(contract: Contract | null, tokenContract: Contract | null) {

    /**
   * Creates an escrow using USDT tokens.
   *
   * @param {string} value - The amount of USDT tokens for the escrow.
   * @param {string} price - The price in USDT for the escrow (per ETH or native token).
   * @param {boolean} isEthOffer - Indicates if the escrow is in ETH or USDT.
   * @throws Will throw an error if any parameter is invalid or if transaction fails.
   */
  const createEscrow = async (value: string, price: string, isEthOffer: boolean) => {
    // setIsLoading(true);
    // Codificacion de firmas para llamadas a funciones, A IMPLEMENTAR
    // const message = "Hola, Moneybank pagará el gas por ti";
    // //const hash = hashMessage(message);
    // console.log("HASH", hash);
    // //const signature = await signMessage(message, provider);
    // console.log("SIGNATURE", signature);


    if (!isEthOffer) {


      try {
        if (!contract || !tokenContract) throw new Error("Contract not found");
        // Convierte los valores entrantes como strings para evitar problemas de precisión
        const valueParsed = parseFloat(value.trim());
        const priceParsed = parseFloat(price.trim());
        // console.log("valueParsed", valueParsed);
        // console.log("priceParsed", priceParsed);

        // Validar que tanto el valor como el precio sean mayores que cero
        if (valueParsed <= 0 || priceParsed <= 0) {
          throw new Error("Valor o precio inválido");
        }
        // Valores de ejemplo
        // const valueFixed = ethers.FixedNumber.from(0.0002);
        // const pricePerEth = ethers.FixedNumber.from(2000.5);

        // Convertir el valor en USDT a wei (6 decimales)
        const usdtAmountBN = ethers.parseUnits(valueParsed.toString(), 6);

        // Convertir el precio de ETH (precio por USDT) a una cantidad en wei (18 decimales)
        const pricePerEthBN = ethers.parseUnits(priceParsed.toString(), 18);

        // Calcular el equivalente en ETH en wei
        const ethAmountBN = pricePerEthBN * (BigInt(valueParsed));

        console.log("usdtAmountBN:", usdtAmountBN.toString()); // Ejemplo: 100000000
        console.log("pricePerEthBN:", pricePerEthBN.toString()); // Ejemplo: 294761418356924
        console.log("ethAmountBN:", ethAmountBN); // Resultado esperado en ether

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
        toast.success("Se ha creado la oferta USDT exitosamente");
      } catch (error) {
        toast.error("No se ha podido crear la oferta USDT");
        console.error("Error creando la oferta USDT:", error);
      }
    } else {
      try {
        //Realizar cálculos necesarios para convertir los valores a unidades adecuadas para la transacción
        const ethAmount = parseFloat(value.trim());
        const usdtPricePerEth = parseFloat(price.trim());

        if (ethAmount <= 0 || usdtPricePerEth <= 0) {
          throw new Error("Cantidad de ETH o precio en USDT inválido");
        }
        // Crear FixedNumber para ETH (18 decimales)
        const ethAmountFixed = ethers.FixedNumber.fromValue(
          ethers.parseEther(value),
          18
        );
        // Crear FixedNumber para el precio USDT/ETH (6 decimales para USDT)
        const usdtPriceFixed = ethers.FixedNumber.fromValue(
          ethers.parseUnits(price, 6),
          6
        );
        // Calcular el total en USDT
        const totalUsdtFixed = ethAmountFixed.mulUnsafe(usdtPriceFixed);

        // Redondear a 6 decimales para USDT
        const totalUsdtRounded = parseFloat(totalUsdtFixed.toString()).toFixed(6);
        // Convertir a BigNumber para usar en las transacciones
        const ethAmountBN = ethers.parseEther(value);
        const totalUsdtBN = ethers.parseUnits(totalUsdtRounded.toString(), 6);
        // Realiza la transacción para crear el escrow con Ether nativo
        const addEscrowNativeTx = await contract?.createEscrowNativeCoin(ethAmountBN, totalUsdtBN, USDTAddress, {
          gasLimit: 5000000, value: ethAmountBN
        });
        await addEscrowNativeTx.wait();
        toast("Se ha creado la oferta ETH exitosamente");
      } catch (error) {
        console.error("Error creando la oferta de native coin:", error);;
        toast.error("No se ha podido crear la oferta ETH");
      }
    };
  }

  /**
   * Cancels an escrow offer.
   *
   * @param {number} offerId - The ID of the offer to cancel.
   * @return {Promise<void>}
   * @throws Will throw an error if the offer ID is not defined or if the transaction fails.
   */
  const cancelEscrow = async (offerId: number) => {
    if (!offerId) throw new Error("Offer ID no definido");
    try {
      if (!contract || !tokenContract) throw new Error("Contract not found");
      const cancelTx = await contract?.cancelEscrow(offerId, {
        gasLimit: 5000000,
      });
      await cancelTx.wait();
      toast.success("Se ha cancelado la oferta USDT exitosamente");
    } catch (error) {
      toast.error("No se ha podido cancelar la oferta USDT");
      console.error("Error cancelando la oferta USDT:", error);
    }
  };

  /**
   * Accepts an escrow offer.
   *
   * @param {number} offerId - The ID of the offer to accept.
   * @param {number} cost - The cost of the escrow.
   * @param {boolean} isEthOffer - Indicates if the escrow is in ETH or USDT.
   * @throws Will throw an error if any parameter is not defined or if the transaction fails.
   */
  async function acceptEscrow(offerId: number, cost: number, isEthOffer: boolean) {
    // Codificacion de firmas para llamadas a funciones, A IMPLEMENTAR
    // const message = "Hola, Moneybank pagará el gas por ti";
    // //const hash = hashMessage(message);
    // console.log("HASH", hash);
    // //const signature = await signMessage(message, provider);
    // console.log("SIGNATURE", signature);

    // Verifica si el contrato está inicializado
    if (!offerId || !cost) {
      throw new Error("Offer ID or cost no defined");
    }
    if (!isEthOffer) {
      try {
        // Realiza la transacción para aceptar el escrow con tokens USDT
        // const receipt = await waitForTransaction(addEscrowTokenTx);
        const acceptEscrowTokenTx = await contract?.acceptEscrowToken(parseInt(offerId.toString()), {
          gasLimit: 5000000,
          value: cost
        });
        await acceptEscrowTokenTx.wait();
        toast.success("Se ha aceptado la oferta USDT exitosamente");
      } catch (error) {
        toast.error("No se ha podido aceptar la oferta USDT");
        console.error("No se ha podido aceptar la oferta USDT:", error);
      }
    } else {
      try {
        // Aprobar el gasto de tokens ("Error cancelando la oferta de native coin:", error); por parte del contrato antes de realizar la transacción
        // const addApproveTokenTx = await tokenContract.approve(CONTRACT_ADDRESS, valueInUSDTWei + fee, {
        const addApproveTokenTx = await tokenContract?.approve(CONTRACT_ADDRESS, cost, {
          gasLimit: 5000000,
        });
        await addApproveTokenTx.wait();
        //Aceptar el escrow con Ether nativo 
        // const addEscrowTokenTx = await contract.acceptEscrowNativeCoin(address, hash, signature, parseInt(_orderId.toString()) {
        const acceptEscrowNativeTx = await contract?.acceptEscrowNativeCoin(offerId, {
          gasLimit: 5000000
        });
        await acceptEscrowNativeTx.wait();
        toast("Se ha aceptado la oferta ETH exitosamente");
      } catch (error) {
        toast.error("No se ha podido aceptar la oferta ETH");
        console.error("Error aceptando la oferta de native coin:", error);
      }
    }
  }
  return { createEscrow, cancelEscrow, acceptEscrow };
}
