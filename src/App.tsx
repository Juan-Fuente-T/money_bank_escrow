import { USDTABI } from "./assets/abis/UsdtABI";
import { CONTRACT_ADDRESS } from "./assets/constants";
import { USDTAddress } from "./assets/constants";
import { MoneybankABI } from "./assets/abis/MoneybankABI";
import { useEffect, useState, useCallback, useRef } from "react";
import { Contract, ethers } from 'ethers';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import  LoadingSpinner  from "./utils/LoadingSpinner";

import ModalResumen from './components/ModalResumen';
import FormularioOferta from './components/FormularioOferta'
import OfferCard from "./components/OfferCard";
import { toast } from 'react-toastify';
import { useAccount, useBalance } from 'wagmi'
import { usePrices } from './hooks/usePrices';

// Importaciones TEMPORALMENTE en deshuso
// import truncateEthAddress from 'truncate-eth-address';
// import {uiConsole} from './utils/Utils';
// import { setBalance } from "viem/actions";

// Estilos 
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';
import useFees from "./hooks/useFees";
import { useEscrow } from "./hooks/useEscrow";

// Extensión de la interfaz Window para incluir ethereum como una propiedad opcional
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  // Estados TEMPORALMENTE en deshuso
  // const [stableAddress, setStableAddress] = useState('');
  // const [approveValue, setApproveValue] = useState('');
  // const [refundNumber, setRefundNumber] = useState(0);
  // const [refundNumberNativeC, setRefundNumberNativeC] = useState(0);
  // const [orderId] = useState(0);
  // const [allowance, setAllowance] = useState(0);
  
  // Estados para manejar el montado del componente, carga, modales, balances, direcciones, proveedores, contratos, etc.
  const [isMounted, setIsMounted] = useState(false);// State variable to know if the component has been mounted yet or not
  // const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datosModal, setDatosModal] = useState({
    crypto: "usdt",
    value: '',
    price: '',
    maximo: '',
    minimo: '',
    conditions: ""
  });
  const [balanceOf, setBalanceOf] = useState(0); //ERC20 token balance
  const [ethBalance, setEthBalance] = useState('');//ETH balance
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [contract, setContract] = useState<Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<Contract | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [nativeOffers, setNativeOffers] = useState<any[]>([]);
  const [usdtOffers, setUsdtOffers] = useState<any[]>([]);
  const [feeBuyer, setFeeBuyer] = useState<number>(0);
  const [feeSeller, setFeeSeller] = useState<number>(0);
  let prices: { [key: string]: { precio: number; nombre: string; } } = {};

  const { address: _address } = useAccount();
  const { data, isError } = useBalance({address: _address});
  const { fees, fetchFees } = useFees(contract);
 
  useEffect(() => {
    if (_address) {
      setAddress(_address);
      setLoggedIn(true);
      fetchFees();
      if(fees.feeBuyer !== null && fees.feeSeller !== null) {
        setFeeBuyer(fees?.feeBuyer);
        setFeeSeller(fees?.feeSeller);
      }
      if (!isError && data?.value !== undefined) {
        setEthBalance(ethers.formatEther(data?.value)); // Convierte bigint a string
      }
    } else {
      setLoggedIn(false);
    }
  }, [_address, data, isError, fetchFees, fees.feeBuyer, fees.feeSeller]);

  const { data: _prices } = usePrices();

  if (_prices !== undefined) {
    const transformedPrices = {
      eth: {
        precio: Number(_prices?.eth.precio),
        nombre: _prices?.eth.nombre,
      },
      usdt: {
        precio: Number(_prices?.usdt.precio),
        nombre: _prices?.usdt.nombre,
      }
    };

    prices = transformedPrices;
  }

  const usdtPrecio = prices['usdt']?.precio;
  const ethPrecio = prices['eth']?.precio;
  const valorEthEnUsd = ethPrecio * usdtPrecio;
  const valorUsdEnEth = usdtPrecio / ethPrecio;
  const { isLoading, createEscrow, cancelEscrow } = useEscrow(contract, tokenContract);
  async function handleCreateEscrow(value: string, price: string, orderId: number) {
    console.log("value: ", value, "price: ", price, "orderId: ", orderId);
    await createEscrow(value, price);
    toast("Se ha creado la oferta USDT exitosamente");
    fetchOffers();
    handleCloseForm();
  }
  /**
   * Función asíncrona para cancelar una oferta en la UI
   * @param value - El valor de la oferta en USDT
   * @param id - El ID de la oferta a cancelar
   */
  async function handleCancelEscrow(offerId: number) {
    await cancelEscrow (offerId);
    toast("Se ha creado la oferta USDT exitosamente");
    fetchOffers();
    handleCloseForm();
  }
  // Función asíncrona para conectar la billetera del usuario con la aplicación
  // const connectWallet = async () => {
  //   if (window.ethereum) {
  //     try {
  //       // Solicitar al usuario que conecte su billetera
  //       const provider = new ethers.BrowserProvider(window.ethereum);
  //       console.log("provider ", provider);

  //       // Obtiene el signer del proveedor para firmar transacciones
  //       const signer = await provider.getSigner();
  //       console.log("signer", signer);

  //       // Obtiene la dirección del usuario conectado
  //       const userAddress = await signer.getAddress();
  //       setAddress(userAddress);
  //       setProvider(provider);
  //       setSigner(signer);
  //       // Actualiza el estado de conexión basado en la dirección del usuario
  //       userAddress ? setLoggedIn(true) : setLoggedIn(false);
  //       // Verifica si tanto el proveedor como el signer están inicializados correctamente
  //       if (provider && signer) {
  //         // Inicializa el contrato de Moneybank utilizando la dirección y ABI proporcionadas
  //         const moneybankContract = new Contract(CONTRACT_ADDRESS, MoneybankABI, signer);
  //         if (!moneybankContract) {
  //           console.error("Moneybank contract initialization failed");
  //         } else {
  //           console.log("Moneybank Contract initialized:", moneybankContract);
  //         }
  //         console.log("Contract:", moneybankContract);
  //         setContract(moneybankContract);
  //         // console.log("Contract:", moneybankContract);
  //         console.log("userAddress", userAddress);
  //         // Inicializa el contrato USDT utilizando la dirección y ABI proporcionadas
  //         const usdtContract = new Contract(USDTAddress, USDTABI, signer);
  //         if (!usdtContract) {
  //           console.error("USDT contract initialization failed");
  //         } else {
  //           console.log("USDT Contract initialized:", usdtContract);
  //         }
  //         setTokenContract(usdtContract);
  //         console.log("TOKENContract:", usdtContract);
  //       } else {
  //         console.error("Provider or Signer not initialized");
  //       }
  //     } catch (err) {
  //       console.error("User rejected the connection:", err);
  //     }
  //   } else {
  //     console.error("No Ethereum provider found. Install MetaMask or another wallet.");
  //   }
  // };

  // Función asíncrona para crear un escrow con tokens USDT
  // async function createEscrow(value: string, price: string) {
  //   setIsLoading(true);
  //   // Codificacion de firmas para llamadas a funciones, A IMPLEMENTAR
  //   // const message = "Hola, Moneybank pagará el gas por ti";
  //   // const hash = hashMessage(message);
  //   // console.log("HASH", hash);
  //   // const signature = await signMessage(message, provider);
  //   // console.log("SIGNATURE", signature);

  //   // Verifica si el contrato está inicializado
  //   if (!contract) {
  //     throw new Error("Contract not found");
  //   }

  //   try {
  //     // Convierte los valores entrantes como strings para evitar problemas de precisión
  //     const valueParsed = parseFloat(value);
  //     const priceParsed = parseFloat(price);

  //     // Validar que tanto el valor como el precio sean mayores que cero
  //     if (valueParsed <= 0 || priceParsed <= 0) {
  //       throw new Error("Valor o precio inválido");
  //     }
  //     // Valores de ejemplo
  //     // const valueFixed = ethers.FixedNumber.from(0.0002);
  //     // const pricePerEth = ethers.FixedNumber.from(2000.5);

  //     // Crear FixedNumber para USDT (6 decimales)
  //     const usdtAmount = ethers.FixedNumber.fromValue(
  //       ethers.parseUnits(valueParsed.toString(), 6),
  //       6
  //     );

  //     // Crear FixedNumber para el precio de ETH (18 decimales)
  //     const ethPrice = ethers.FixedNumber.fromValue(
  //       ethers.parseUnits(priceParsed.toString(), 18),
  //       18
  //     );
  //     // Calcular cuánto ETH equivale a 1 USDT
  //     const ethAmount = usdtAmount.mulUnsafe(ethPrice);

  //     // Convertir los valores a BigNumber para usar en las transacciones
  //     const usdtAmountBN = ethers.parseUnits(value, 6);
  //     const ethAmountBN = ethers.parseEther(ethAmount.toString());

  //     //Realizar el approve previo para permitir el envio de tokens
  //     // const addApproveTokenTx = await tokenContract.approve(CONTRACT_ADDRESS, valueInUSDTWei + fee, {
  //     const addApproveTokenTx = await tokenContract?.approve(CONTRACT_ADDRESS, usdtAmountBN, {
  //       gasLimit: 5000000,
  //     });
  //     await addApproveTokenTx.wait();

  //     //Creación del escrow de usdt
  //     // const receipt = await waitForTransaction(addEscrowTokenTx);
  //     const addEscrowTokenTx = await contract.createEscrowToken(usdtAmountBN, ethAmountBN, USDTAddress, {
  //       gasLimit: 5000000,
  //     });
  //     await addEscrowTokenTx.wait();
  //     toast("Se ha creado la oferta USDT exitosamente");
  //     fetchOffers();
  //     handleCloseForm();
  //   } catch (error) {
  //     console.error("Error en createEscrow:", error);
  //     toast.error("No se ha podido crear la oferta USDT");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // Función asíncrona para crear un escrow con Ether nativo
  async function createEscrowNativeCoin(value: string, price: string) {
    // setIsLoading(true);
    // Codificacion de firmas para llamadas a funciones, A IMPLEMENTAR
    // const message = "Hola, Moneybank pagará el gas por ti";
    // const hash = hashMessage(message);
    // console.log("HASH", hash);
    // const signature = await signMessage(message, provider);
    // console.log("SIGNATURE", signature);

    // Verifica si el contrato está inicializado
    if (!contract) {
      throw new Error("Contract not found");
    }
    try {
      //Realizar cálculos necesarios para convertir los valores a unidades adecuadas para la transacción
      const ethAmount = parseFloat(value);
      const usdtPricePerEth = parseFloat(price);

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
      const addEscrowNativeTx = await contract.createEscrowNativeCoin(
        ethAmountBN, 
        totalUsdtBN, 
        USDTAddress, 
        {
          gasLimit: 5000000,
          value: ethAmountBN 
        }
      );
      await addEscrowNativeTx.wait();

      toast("Se ha creado la oferta ETH exitosamente");
      fetchOffers();
      handleCloseForm();
    } catch (error) {
      console.error(error);
      toast.error("No se ha podido crear la oferta ETH");
    } finally {
      // setIsLoading(false);
    }
  }

  // Función asíncrona para aceptar un escrow con tokens USDT
  async function acceptEscrowToken(_orderId: number, cost: number) {
    // setIsLoading(true);
    // Codificacion de firmas para llamadas a funciones, A IMPLEMENTAR
    // const message = "Hola, Moneybank pagará el gas por ti";
    // //const hash = hashMessage(message);
    // console.log("HASH", hash);
    // //const signature = await signMessage(message, provider);
    // console.log("SIGNATURE", signature);

    // Verifica si el contrato está inicializado
    if (!contract) {
      throw new Error("Contract not found");
    }
    try {
      // Realiza la transacción para aceptar el escrow con tokens USDT
      // const receipt = await waitForTransaction(addEscrowTokenTx);
      const acceptEscrowTokenTx = await contract.acceptEscrowToken(parseInt(_orderId.toString()), {
        gasLimit: 5000000,
        value: cost
      });
      await acceptEscrowTokenTx.wait();
      toast("Se ha aceptado la oferta USDT. Se han trasferido los fondos");
      fetchOffers();
    } catch (error) {
      console.error(error);
      toast.error("No se ha podido aceptar la oferta USDT");
    } finally {
      // setIsLoading(false);
      //NECESARIO CERRAR MODAL CONFIRMACION??
    }
  }
  // Función asíncrona para aceptar un escrow con Ether nativo
  async function acceptEscrowNativeCoin(_orderId: number, cost: number) {
    // setIsLoading(true);
    //Código para generar un mensaje, hash y firma para autenticación, IMPLEMENTAR
    // const message = "Hola, Moneybank pagará el gas por ti";
    // const hash = hashMessage(message);
    // console.log("HASH", hash);
    // const signature = await signMessage(message, provider);
    // console.log("SIGNATURE", signature);

    // Verifica si el contrato está inicializado
    if (!contract) {
      throw new Error("Contract not found");
    }
    try {
      // Aprobar el gasto de tokens USDT por parte del contrato antes de realizar la transacción
      // const addApproveTokenTx = await tokenContract.approve(CONTRACT_ADDRESS, valueInUSDTWei + fee, {
      const addApproveTokenTx = await tokenContract?.approve(CONTRACT_ADDRESS, cost, {
        gasLimit: 5000000,
      });
      await addApproveTokenTx.wait();

      //Aceptar el escrow con Ether nativo utilizando hash y firma
      // const addEscrowTokenTx = await contract.acceptEscrowNativeCoin(address, hash, signature, parseInt(_orderId.toString()) {
      const acceptEscrowNativeTx = await contract.acceptEscrowNativeCoin(_orderId, {
        gasLimit: 5000000
      });
      await acceptEscrowNativeTx.wait();
      // const receipt = await waitForTransaction(addEscrowTokenTx);
      // window.alert("Se ha aceptado la oferta ETH. Se han trasferido los fondos")
      toast("Se ha aceptado la oferta ETH. Se han trasferido los fondos");
      fetchOffers();
    } catch (error) {
      console.error(error);
      toast.error("No se ha podido aceptar la oferta ETH");
    } finally {
      // setIsLoading(false);

    }
  }
  /// ================== Cancelar oferta  ==================
  // Función asíncrona para aceptar un escrow con Ether nativo
  // async function cancelEscrow(orderId: number, value: number) {
  //   setIsLoading(true);
  //   // Codificacion de firmas para llamadas a funciones, A IMPLEMENTAR
  //   // Codificacion de firmas para llamadas a funciones, A IMPLEMENTAR
  //   // const message = "Hola, Moneybank pagará el gas por ti";
  //   // const hash = hashMessage(message);
  //   // console.log("HASH", hash);
  //   // const signature = await signMessage(message, provider);
  //   // console.log("SIGNATURE", signature);

  //   // Verifica si el contrato está inicializado
  //   if (!contract) {
  //     throw new Error("Contract not found");
  //   }

  //   try {
  //     // Realizar transacción para cancelar un escrow existente
  //     const cancelTx = await contract?.cancelEscrow(orderId, {
  //       gasLimit: 5000000,
  //     });
  //     await cancelTx.wait();
  //     toast("Se ha cancelado la oferta con éxito");
  //     fetchOffers();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("No se ha podido cancelar la oferta");
  //   }
  //   setIsLoading(false);
  // }


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

  // Función para obtener las fees del vendedor y comprador
  // const fetchFees = useCallback(async (): Promise<void> => {
  //   try {
  //     let _feeSeller = await getFeeSeller();
  //     setFeeSeller(_feeSeller || 0);

  //     let _feeBuyer = await getFeeBuyer();
  //     setFeeBuyer(_feeBuyer || 0);
  //   } catch (error) {
  //     console.error("Error al obtener las fees:", error);
  //   }
  // }, [getFeeBuyer, getFeeSeller]);

  // Función para obtener las ofertas disponibles
  const fetchOffers = useCallback(async () => {
    if (!contract) return;

    // setIsLoading(true);
    try {
      const orderId = await contract.orderId();
      const fetchedNativeOffers: any[] = [];
      const fetchedUsdtOffers: any[] = [];

      for (let i = 0; i < orderId; i++) {
        const escrow = await contract.getEscrow(i);
        if (escrow?.[2].toString() !== '0') {
          // Crear un objeto que incluya el id
          const offer = {
            id: i, // Asociar el id del índice al escrow
            ...escrow,
          };
          if (escrow.status !== 'Completed') {
            //Se guarda cada oferta válida en su correspondiente array
            if (escrow.escrowNative) {
              fetchedNativeOffers.push(offer);
            } else {
              fetchedUsdtOffers.push(offer);
            }
          }
        }
      }
      // Se actualiza el estado con los balances y las ofertas
      const balance = await tokenContract?.balanceOf(address);
      setBalanceOf(balance);
      setNativeOffers(fetchedNativeOffers);
      setUsdtOffers(fetchedUsdtOffers);

    } catch (error) {
      console.error("Error al obtener ofertas:", error);
    } finally {
      // setIsLoading(false);
    }
  }, [contract, address, tokenContract]);
  // const refreshInterval = 60000; // 1 minuto en milisegundos
  // const refreshInterval = 5000; // 1 minuto en milisegundos

  // Función para obtener los precios de las criptomonedas 
  // const fetchPrices = useCallback(async () => { //DESACTIVADA LA LLAMADA A LA API DURANTE EL DESARROLLO
  //   const currentTime = Date.now();
  //   const timeSinceLastCall = currentTime - lastCallTime;

  //   // Limita las llamadas a la api a una vez cada 60 segundos
  //   // Realiza la llamada si ha pasado suficiente tiempo
  //   if (lastCallTime === 0 || timeSinceLastCall >= refreshInterval) {
  //   try {
  //     // let prices = await coinGeckoGetPricesKV({ requestedCoins: ['eth', 'usdt'] });
  //     //DESACTIVADA LA LLAMADA A LA API DURANTE EL DESARROLLO
  //     let prices = {
  //       eth: { precio: 2626.5, nombre: "Ethereum" },
  //       usdt: { precio: 1.01, nombre: "Tether" }
  //     };
  //     console.log("PRICES", prices);
  //     setPrices(prices);
  //     setLastCallTime(currentTime); // Se actualiza el tiempo de la última llamada
  //     console.log("PRICES", prices);
  //     console.log(prices['eth'].precio); // Precio de ETH
  //     console.log(prices['usdt'].precio); // Precio de USDT
  //   } catch (error) {
  //     console.error("Error fetching prices:", error);
  //   }
  //   } else {
  //     console.log("Esperando...", currentTime - lastCallTime, "milisegundos desde la última llamada.");
  //   }
  //   }, [lastCallTime]); 

  // // Llama a fetchPrices inmediatamente al montar el componente
  // useEffect(() => {
  //   fetchPrices(); // Llama a fetchPrices cuando se monta el componente

  //   // Establece un intervalo para llamar a fetchPrices cada cierto tiempo
  //   const intervalId = setInterval(fetchPrices, refreshInterval);

  //   // Limpia el intervalo cuando el componente se desmonta
  //   return () => clearInterval(intervalId);
  // }, [fetchPrices]);



  const fetchFeesDoneRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!fetchFeesDoneRef.current) {
        await fetchFees();
        fetchFeesDoneRef.current = true;
      }

      fetchOffers();
      // getAllowance();
    };
    fetchData();
  // }, [fetchOffers, getAllowance, fetchFees]);
  }, [fetchOffers, fetchFees]);

  // Función para manejar cambios en los inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    if (type === "radio" && name === "crypto") {
      // Se reinician los datos introducidos si se cambia de cripto
      setDatosModal(prevState => ({
        ...prevState,
        crypto: value as "usdt" | "eth",
        value: '',
        price: '',
        maximo: '',
        minimo: '',
        conditions: ""
      }));
    } else {
      setDatosModal(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  // Función para manejar el envío del formularioOferta
  const handleSubmitModal = (e: any) => {
    e.preventDefault();
    openFormularioOferta(datosModal);// Abre el modal con los datos actuales del formularioOferta
  };

  // Función para cerrar el formularioOferta
  const handleCloseForm = () => {
    // Se reinician los datos introducidos al cerrar el formulario
    setDatosModal({
      crypto: 'udst',
      value: '',
      price: '',
      maximo: '',
      minimo: '',
      conditions: '',
      // otros campos según sea necesario
    });
    setIsFormVisible(false)
  };

  // Función para abrir el offerCard
  const openForm = () => {
    setIsFormVisible(true);
  };

  // Función para confirmar la acción del modal de confirmacion basándose en la criptomoneda seleccionada
  const handleConfirmModal = async () => {
    if (datosModal) {
      if (datosModal.crypto === 'eth') {
        await createEscrowNativeCoin(datosModal.value, datosModal.price);
      } else if (datosModal.crypto === 'usdt') {
        // await createEscrow(datosModal.value, datosModal.price);
        await handleCreateEscrow(datosModal.value, datosModal.price, 0);
      }
      setIsModalOpen(false);
    }
  };
  // Función para abrir el modal y establecer los datos del formulario como su contenido
  const openFormularioOferta = (data: any) => {
    setDatosModal(data);
    setIsModalOpen(true);
  };
  // Función para cerrar el modalResumen
  const closeModal = () => {
    setIsModalOpen(false);
    // setDatosModal(null);
  };

  useEffect(() => {
    setIsMounted(true);
    // setBalanceOf(balanceOf?.data);
  }, []);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (typeof window.ethereum !== 'undefined' && address) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const newContract = new ethers.Contract(CONTRACT_ADDRESS, MoneybankABI, signer);
          setContract(newContract);
          const tokenContract = new ethers.Contract(USDTAddress, USDTABI, signer);
          setTokenContract(tokenContract);
          address ? setLoggedIn(true) : setLoggedIn(false);
        }
      } catch {
        console.error("Error initializing contract");
      }
    };

    if (address) {
      initializeContract();
    }
  }, [address]);

  if (!isMounted) return null;

  const unloggedInView = (
    <div>
      <div className="logout-title-logo-container">
        <p>Intercambio de USDT-ETH entre particulares garantizado mediante escrows</p>
        <ConnectButton />
      </div>
      <div>
        <div className="mainContainer">
          <h1>Money Bank Escrow</h1>
          <img className="logo" src="/MoneyBank_logo.png" alt="Logo de Moneybank, intercambio p2p de criptomonedas" />
          <p>El intercambio de USDT - ETH entre particulares</p>
          <p>Depósitos asegurados que se liberan tras el intercambio</p>
          <div className="textContainer">
            <p>RÁPIDO</p>
            <p>EFICIENTE</p>
            <p>SEGURO</p>
          </div>
        </div>
      </div>
      {/* <button className="bg-[#ca0372] p-2 text-xl font-bold text-center w-1/5 m-auto mt-4 mb-4 border-2 border-stone-800 rounded-md hover:bg-[#ca0372] bg-opacity-50 transition-all disabled:opacity-80 text-xl font-semibold" onClick={login}>
        Login
      </button> */}
    </div>
  );

  const loggedInView = (
    <>
      {/* <button className="bg-[#ca0372] p-2 text-xl font-bold text-center w-1/5 m-auto mt-4 mb-4 border-2 border-stone-800 rounded-md hover:bg-[#ca0372] hover:opacity-50  transition-all disabled:opacity-80 text-xl font-semibold " onClick={logout}>
          Log Out
        </button> */}
      {/* </div> */}
      {/* </div> */}
    </>
  );

  return (
    <div className="main">{loggedIn ? loggedInView : unloggedInView}
      {loggedIn && (
        // <link rel="icon" href="/favicon.ico" />
        // <div className={styles.main}>
        <div className="text-container">
          <div>
            <div className="containerTitle">
              <div className="title-logo-container">
                <img className="logo" src="/MoneyBank_logo.png" alt="Logo de Moneybank, intercambio p2p de criptomonedas" />
                <div className="title-container">
                  <h1 className="title">Money Bank Escrow</h1>
                  <p className="description">Intercambio de USDT-ETH entre particulares</p>
                </div>
                <ConnectButton />
              </div>
              {isLoading && LoadingSpinner("Cargando datos...")}
              {/* {address && <p className="show-balance">Dirección del usuario: {truncateEthAddress(address)}</p>} */}
              <div className="balances-container">
                {ethBalance && <p className="show-balance">Balance de USDT: {balanceOf.toString()}</p>}
                {ethBalance && <p className="show-balance">Balance de ETH: {ethBalance}</p>}
              </div>
            </div>
            <div className='app-price-container'>
              <div className='app-prices'>
                {prices && <p>1 ETH in DOLLARS:  {' '} {ethPrecio} </p>}
                {prices && <p>1 USDT in DOLLARS:  {' '}{usdtPrecio} </p>}
              </div>
              <div className='app-prices'>
                {prices && <p>1 ETH in USDT: {' '}{valorEthEnUsd}</p>}
                {prices && <p>1 USDT in ETH: {' '}{valorUsdEnEth}</p>}
              </div>
            </div>
            <div className="styles.containerData">
              <div>
                <div className="app-offers-container">
                  <div className="app-offers-eth">
                    <h2>Ofertas en ETH</h2>
                    <div className="app-offers-map">
                      {nativeOffers.length > 0 ? (
                        nativeOffers.map((offer) => (
                          <OfferCard
                            key={offer.id}
                            offer={offer}
                            acceptEscrowToken={acceptEscrowToken}
                            acceptEscrowNativeCoin={acceptEscrowNativeCoin}
                            cancelEscrow={() => handleCancelEscrow(offer.id)} 
                            address={address}
                          />
                        ))
                      ) : (
                        <p>No hay ofertas en ETH disponibles.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="app-offers-container">
                  <div className="app-offers-token">
                    <h2>Ofertas en USDT</h2>
                    <div className="app-offers-map">
                      {usdtOffers.length > 0 ? (
                        usdtOffers.map((offer) => (
                          <OfferCard
                            key={offer.id}
                            offer={offer}
                            acceptEscrowToken={acceptEscrowToken}
                            acceptEscrowNativeCoin={acceptEscrowNativeCoin}
                            cancelEscrow={() => handleCancelEscrow(offer.id)} 
                            address={address}
                          />
                        ))
                      ) : (
                        <p>No hay ofertas en USDT disponibles.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="offersContainer">
                {!isFormVisible ? (
                  <button
                    className="publish-offer-button"
                    onClick={openForm}
                  >
                    PUBLICAR OFERTA
                  </button>
                ) : (
                  isFormVisible && (
                    <FormularioOferta
                      datosModal={datosModal}
                      handleSubmitModal={handleSubmitModal}
                      handleChange={handleChange}
                      onCloseForm={handleCloseForm}
                      ethBalance={ethBalance}
                      balanceOf={balanceOf}
                      prices={prices}
                    />
                  )
                )}
                {isModalOpen && (
                  <div className="modal-container">
                    <div>
                      <ModalResumen
                        onCloseModal={closeModal}
                        datosModal={datosModal}
                        onConfirm={handleConfirmModal}
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* Aqui iria aquello que puede hacer el dueño del contrato, por ejemplo retirar las fee */}
              {/* {address && address.toLowerCase() === owner?.toLowerCase() ? (
                <div>
                   {isLoading ? (
                  <button className="button">Loading...</button>
                ) : (<div>
                <div> 
                  <div className="containerRefunds">
                    <p>Devolver escrow al dueño (Solo Owner)</p> 
                  <div className="containerEscrowOwner">
                      <label htmlFor="price">Número de Escrow USDT a devolver</label>
                      <input type="number" placeholder="Número Escrow USDT" min="0">
                      value={refundNumber} onChange={(e) => setRefundNumber(parseInt(e.target.value))}></input>
                      <div className="divRelease">
                      <button onClick={refundEscrow}>Devolver USDT</button>
                      </div>
                  </div>
                  <div className="containerEscrowOwner">                  
                    <label htmlFor="price">Número de Escrow ETH a devolver</label>
                    <input type="number" placeholder="Número Escrow ETH" min="0"
                    value={refundNumberNativeC} onChange={(e) => setRefundNumberNativeC(parseInt(e.target.value))}></input>
                    <div className="divRelease">
                    <button onClick={refundEscrowNativeCoin}>Devolver ETH</button>
                    </div>
                  </div>
                </div>
                <div className="containerReleases">
                </div>
                </div>  */}
                  {/* <div className={styles.containerWithdraw}>
                <form className="approveAddStable" onSubmit={handleSubmit}>
                      <input type="text" placeholder="Direccion EstableCoin"
                      value={stableAddress} onChange={(e) => setStableAddress(e.target.value)} />
                      <button type="submit">Añadir StableCoin</button>
                    </form> */}
                  {/* <button className={styles.withdrawButton} onClick={withdrawFees}>
                    Retirar Fees USDT
                  </button>
                  <button className={styles.withdrawButton} onClick={withdrawFeesNativeCoin}>
                 
                    Retirar Fees ETH
                  </button> */}
                  {/* </div>  */}

                  {/* </div>
                )}
                </div>
              ) : (
                ""
              )} */}
            </div>
          </div>
        </div>
      )}
      {!loggedIn && (
        <div className="connect-container">
          <h1>CONECTATE A LA APLICACION</h1>
        </div>
      )}
    </div>
  );
}

