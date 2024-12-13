// useFees.ts
import { Contract } from "ethers";
import { useState, useCallback } from "react";

const useFees = (contract: Contract | null) => {
  const [fees, setFees] = useState({ feeSeller: null, feeBuyer: null });

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