// useFees.ts
import { Contract } from "ethers";
import { useState, useCallback } from "react";

/**
 * Custom hook to fetch transaction fees from a given Ethereum contract.
 *
 * @param {Contract} contract - The ethers.js contract instance from which to fetch fees.
 * @return {Object} An object containing:
 * - `fees`: The current fee rates for the seller and buyer.
 * - `fetchFees`: A function to manually trigger fetching the fee rates.
 */
const useFees = (contract: Contract | null) => {
  const [fees, setFees] = useState({ feeSeller: null, feeBuyer: null });

  /**
   * Function to fetch fee rates from the contract.
   */
  const fetchFees = useCallback(async () => {
    if (!contract) return;
    try {
      const feeSeller = await contract.feeSeller();
      const feeBuyer = await contract.feeBuyer();
      setFees({ feeSeller, feeBuyer });
    } catch (error) {
      console.error("Error al obtener las tarifas:", error);
    }
  }, [contract]);

  return { fees, fetchFees };
};

export default useFees;