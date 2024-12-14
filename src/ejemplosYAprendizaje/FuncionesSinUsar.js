  // Estados TEMPORALMENTE en deshuso
  // const [stableAddress, setStableAddress] = useState('');
  // const [approveValue, setApproveValue] = useState('');
  // const [refundNumber, setRefundNumber] = useState(0);
  // const [refundNumberNativeC, setRefundNumberNativeC] = useState(0);
  // const [orderId] = useState(0);
  // const [allowance, setAllowance] = useState(0);
  
  
  //FUNCIONES SIN UTILIZAR ACTUALMENTE
  /// ================== Añadir Stable Coin ==================
  //Añadir una nueva moneda al contrato
  // async function addStableAddress(stableAddress: string) {
  //   setIsLoading(true);
  // Codificacion de firmas para llamadas a funciones, A IMPLEMENTAR
  //   // const message = "Hola, Moneybank pagará el gas por ti";
  //   // const hash = hashMessage(message);
  //   // console.log("HASH", hash);
  //   // const signature = await signMessage(message, provider);
  //   // console.log("SIGNATURE", signature);
  //   if (!contract) {
  //     throw new Error("Contract not found");
  //   }
  //   try {
  //     // const addEscrowTokenTx = await contract.addStablesAddresses(address, hash, signature, stableAddress, { {
  //     const addStableAddressTx = await contract.addStablesAddresses( stableAddress, {
  //         gasLimit: 5000000,
  //       });
  //     await addStableAddressTx.wait();
  //     // const receipt = await waitForTransaction(addEscrowTokenTx);
  //     toast("Se ha añadido la crypto currency exitosamente");

  //     console.log('Transacción addStable confirmada:', addStableAddressTx.hash);
  //   } catch (error) {
  //     console.error(error);
  //     // window.alert(error);
  //     toast.error("No se ha podido añadir la crypto currency");
  //   }
  //  setIsLoading(false);
  // }


  /// ================== Escrow  Value  ==================
  //Obtener el valor de un determinado escrow
  // async function getEscrowValue(escrowId: number) {
  //   try {
  //     const escrowValue = await contract?.getValue(escrowId);
  //     console.log("escrowValue",escrowValue); // Imprime la versión obtenida del contrato
  //   } catch (error) {
  //     console.error("Error al obtener la el valor de la oferta:", error);
  //   }
  // }


  /// ================== Escrow  State  ==================
  //Obtener el estado de un determinado escrow
  // Fetch the state of Escrow
  // async function getEscrowState(escrowId: number) {
  //   try {
  //     const escrowState= await contract?.getState(escrowId);
  //     console.log(escrowState); 
  //   } catch (error) {
  //     console.error("Error al obtener la el estado de la oferta:", error);
  //   }
  // }


  /// ================== Get OrderID  ==================
  //Obtener el actual numero de id para el proximo escrow
  //   async function getOrderId() {
  //     try {
  //         const orderId = await contract?.orderId();
  //         console.log("orderId", orderId); 
  //         setOrderId(orderId);
  //         return orderId;
  //     } catch (error) {
  //         console.error("Error al obtener el numero de oferta:", error);
  //     }
  // }


  /// ================== Get Escrow ==================
  // // Llamada para obtener un escrow con el ID solicitado
  // Fetch the info of Escrow
  // async function getEscrow(escrowId: number) {
  //   try {
  //       const dataEscrow = await contract?.getEscrow(escrowId);
  //      // setDataEscrow(dataEscrow);
  //       return dataEscrow;
  //   } catch (error) {
  //       console.error("Error al obtener el escrow:", error);
  //   }
  // }

  /// ================== Get Last Escrow ==================
  // // Llamada para obtener el último escrow basado en el ID

  // const fetchLastEscrow = async () => {
  //   if (!contract) {
  //     console.error("Contract is not initialized");
  //     return;
  //   }
  //   try {
  //     const _orderId = await contract?.orderId();
  //     const result: any = await contract?.getLastEscrow(parseInt(_orderId.toString()) - 1);
  //     // if (result && result.length === 3) {
  //     if (result) {
  //       setLastEscrow(result);
  //       const seller = result.seller;
  //       const type = result.escrowNative;
  //       const value = result.value;
  //       const cost = result.cost;
  //       console.log("Seller:", seller);
  //       console.log("Value:", value);
  //       console.log("Cost:", cost);

  //     } else {
  //     // const dataLastEscrow=  getLastEscrow(parseInt(_orderId.toString())  -1);
  //       console.error("No se encontrado datos para la oferta:", orderId);
  //     }
  //   } catch (error) {
  //     console.error("Error al obtener datos de la oferta", error);
  //   }
  // };
  // fetchLastEscrow();


  /// ================== Allowance en USDT  ==================
  // Obtener el allowance de tokens USDT permitido por el usuario al contrato
  //CUIDADO; SE NECESITA INSTANCIAR USDT Y LLAMAR A tokenContract
  // const getAllowance = useCallback(async () => {
  //   try {
  //     const allowance = await tokenContract?.allowance(address, CONTRACT_ADDRESS);
  //     setAllowance(allowance);
  //   } catch (error) {
  //     console.error("Error al obtener el allowance de oferta:", error);
  //   }
  // }, [address, tokenContract]);


  /// ================== Approve del user a Moneybank  ==================
  // async function approve() {
  //   setIsLoading(true);
  // Codificacion de firmas para llamadas a funciones, A IMPLEMENTAR
  //   // const message = "Hola, Moneybank pagará el gas por ti";
  //   // const hash = hashMessage(message);
  //   // console.log("HASH", hash);
  //   // const signature = await signMessage(message, provider);
  //   // console.log("SIGNATURE", signature);
  //   if (!contract) {
  //     throw new Error("Contract not found");
  //   }

  //   // const amountFeeSeller = ((valueEthBig * (await getFeeSeller() * 10 ** 18)) /
  //   // // (100 * 10 ** 6)) / 1000; DECIMALES, 6 USDT
  //   // (100 * 10 ** 18)) / 1000;

  //   const amountApprove = convertToBigNumber(parseFloat(approveValue), 6);

  //   try {
  //     // const addEscrowTokenTx = await tokenContract?.approve (address, hash, signature, CONTRACT_ADDRESS, amountApprove, {
  //     const approveTx = await tokenContract?.approve (CONTRACT_ADDRESS, amountApprove, {
  //         gasLimit: 5000000,
  //       });
  //     await approveTx.wait();
  //     // const receipt = await waitForTransaction(addEscrowTokenTx);
  //     window.alert("Se ha aprobado con éxito")
  //     toast("Se ha aprobado con éxito");
  //     // await waitForTransaction(tx);
  //     console.log("Hash del approve", approveTx.hash);
  //     console.log('Transacción approve confirmada:', approveTx);

  //   } catch (error) {
  //     console.error(error);
  //     // window.alert(error);
  //     toast.error("No se ha podido aprobar");
  //   }
  //  setIsLoading(false);
  // } 
  // /// ================== Transfer  Token  ==================
  // const transfer = async (event: { preventDefault: () => void; }) => {
  //   event.preventDefault();
  //   setIsLoading(true);
  // Codificacion de firmas para llamadas a funciones, A IMPLEMENTAR
  //   // const message = "Hola, Moneybank pagará el gas por ti";
  //   // const hash = hashMessage(message);
  //   // console.log("HASH", hash);
  //   // const signature = await signMessage(message, provider);
  //   // console.log("SIGNATURE", signature);
  //   if (!contract) {
  //     throw new Error("Contract not found");
  //   }

  //   // const amountFeeSeller = ((valueEthBig * (await getFeeSeller() * 10 ** 18)) /
  //   // // (100 * 10 ** 6)) / 1000; DECIMALES, 6 USDT
  //   // (100 * 10 ** 18)) / 1000;

  //   const amountValue = ethers.parseUnits(valueTransfer.toString(), 6);
  //   try {
  //     // const addEscrowTokenTx = await tokenContract?.transfer(address, hash, signature, addressTransfer, amountValue, {
  //     const transferTx = await tokenContract?.transfer(addressTransfer, amountValue, {
  //         gasLimit: 5000000,
  //       });
  //     await transferTx.wait();
  //     // const receipt = await waitForTransaction(addEscrowTokenTx);
  //     window.alert("Se ha transferido con éxito")
  //     toast("Se ha transferido con éxito");
  //     // await waitForTransaction(tx);
  //     console.log("Hash del transfer", transferTx.hash);
  //     console.log('Transacción transfer confirmada:', transferTx);

  //   } catch (error) {
  //     console.error(error);
  //     // window.alert(error);
  //     toast.error("No se ha podido transferir");
  //   }
  //  setIsLoading(false);
  // } 