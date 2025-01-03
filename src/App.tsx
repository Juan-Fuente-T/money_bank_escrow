import { USDTABI } from "./assets/abis/UsdtABI";
import { CONTRACT_ADDRESS } from "./assets/constants";
import { USDTAddress } from "./assets/constants";
import { MoneybankABI } from "./assets/abis/MoneybankABI";
import { useEffect, useState, useCallback, useRef } from "react";
import { Contract, ethers } from 'ethers';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import LoadingSpinner from "./utils/LoadingSpinner";

import ModalResumen from './components/ModalResumen';
import FormularioOferta from './components/FormularioOferta'
import OfferCard from "./components/OfferCard";
import { useAccount, useBalance, useProvider } from 'wagmi'
import { usePrices } from './hooks/usePrices';
import useFees from "./hooks/useFees";
import { useEscrow } from "./hooks/useEscrow";
import { useContract, useSigner } from 'wagmi';

// Importaciones TEMPORALMENTE en deshuso
// import truncateEthAddress from 'truncate-eth-address';
// import {uiConsole} from './utils/Utils';
// import { setBalance } from "viem/actions";

// Estilos 
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';

// Extensión de la interfaz Window para incluir ethereum como una propiedad opcional
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  // Estados para manejar el montado del componente, carga, modales, balances, direcciones, proveedores, contratos, etc.
  const [isMounted, setIsMounted] = useState(false);// State variable to know if the component has been mounted yet or not
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datosModal, setDatosModal] = useState({
    crypto: "usdt",
    value: '',
    price: '',
    maximo: '',
    minimo: '',
    conditions: ""
  });
  const [balanceOf, setBalanceOf] = useState<number>(0); //ERC20 token balance
  const [ethBalance, setEthBalance] = useState<string>('');//ETH balance
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [contract, setContract] = useState<Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<Contract | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [nativeOffers, setNativeOffers] = useState<any[]>([]);
  const [usdtOffers, setUsdtOffers] = useState<any[]>([]);
  const [feeBuyer, setFeeBuyer] = useState<number>(0);
  const [feeSeller, setFeeSeller] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const { runTask } = useAsyncTask();

  const { address: _address } = useAccount();
  const { data, isError } = useBalance({ address: _address });
  const { fees, fetchFees } = useFees(contract);
  let prices: { [key: string]: { precio: number; nombre: string; } } = {};


 /** 
 * Sets the component as mounted.
 */
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  /** 
   * Initializes the contract with the user's wallet if available.
 * 
 * @async
 */
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

 
  /** 
   * Effect to update the state when the user's address changes.
   * Sets the address, verifies if the user is logged in, fetches fees,
   * and updates the ETH balance.
   */
  useEffect(() => {
    if (_address) {
      setAddress(_address);
      setLoggedIn(true);
      fetchFees();
      // Sets the fees for buyer and seller if they are available
      if (fees.feeBuyer !== null && fees.feeSeller !== null) {
        setFeeBuyer(fees?.feeBuyer);
        setFeeSeller(fees?.feeSeller);
      }
       // Sets the Ethereum balance if no errors are found and the data is available
      if (!isError && data?.value !== undefined) {
        setEthBalance(ethers.formatEther(data?.value)); // Convierte bigint a string
      }
    } else {
      setLoggedIn(false);
    }
  }, [_address, data, isError, fetchFees, fees.feeBuyer, fees.feeSeller]);

  /** 
 * Retrieves cryptocurrency prices and transforms them into a manageable object.
 * The prices are used for conversions between ETH and USDT.
 */
  const { data: _prices } = usePrices();

  // Transform price data from usePrices into a more usable structure
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

  const { createEscrow, cancelEscrow, acceptEscrow } = useEscrow(contract, tokenContract);
 
  /**
   * Handles the creation of a new escrow by interacting with the smart contract.
   * Fetches updated offers and resets the form after successful creation.
   *
   * @param {string} value - The amount being offered.
   * @param {string} price - The price per unit of the offer.
   * @param {boolean} isEthOffer - Whether the offer is in native ETH.
   * @throws Will log an error if the contract interaction fails.
   */
  async function handleCreateEscrow(value: string, price: string, isEthOffer: boolean) {
  
    // setTimeout(() => {
    //   setIsLoading(true);
    // }, 1000);
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 0));
      console.log("ISLOADING1", isLoading);
      await createEscrow(value, price, isEthOffer);
      fetchOffers();
      handleCloseForm();
    } catch (error) {
      console.error("Error al cancelar el escrow:", error);
    } finally {
      setIsLoading(false);
    }
  }
  /**
  * Cancels an existing escrow by its ID.
  * Updates the offers list after successful cancellation.
  *
  * @param {number} offerId - The ID of the escrow to be canceled.
  * @throws Will log an error if the cancellation fails.
  */
  async function handleCancelEscrow(offerId: number) {
    setIsLoading(true);
    try {
      console.log("ISLOADING1", isLoading);
      await cancelEscrow(offerId);
      fetchOffers();
      handleCloseForm();
    } catch (error) {
      console.error("Error al cancelar el escrow:", error);
    } finally {
      setIsLoading(false);
    }
  }
  /**
   * Accepts an escrow offer by interacting with the smart contract.
   * Fetches updated offers after successful acceptance.
   *
   * @param {number} offerId - The ID of the offer to accept.
   * @param {number} cost - The total cost of the offer.
   * @param {boolean} isEthOffer - Whether the offer is in native ETH.
   * @throws Will log an error if the acceptance process fails.
   */
  async function handleAcceptEscrow(offerId: number, cost: number, isEthOffer: boolean) {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 0));
      await acceptEscrow(offerId, cost, isEthOffer)
      fetchOffers();
      handleCloseForm();
    } catch (error) {
      console.error("Error al cancelar el escrow:", error);
    } finally {
      setIsLoading(false);
    }
  }
  /**
   * Fetches all active offers from the smart contract and updates the state.
   * Separates native (ETH) offers from USDT offers for easier UI rendering.
   *
   * @throws Will log an error if fetching offers fails.
   */
  const fetchOffers = useCallback(async () => {
    if (!contract) return;
    setIsLoading(true);
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
      setIsLoading(false);
    }
  }, [contract, address, tokenContract]);

  const fetchFeesDoneRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!fetchFeesDoneRef.current) {
        await fetchFees();
        fetchFeesDoneRef.current = true;
      }

      fetchOffers();
    };
    fetchData();
  }, [fetchOffers, fetchFees]);

 /** 
 * Handles changes in the form inputs.
 * If a new cryptocurrency is selected, resets associated data.
 */
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
 /** 
 * Handles the submission of the offer form. Opens the modal with the current form data.
 */
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
    });
    setIsFormVisible(false)
  };

 /** 
 * Shows the offer form.
 */
  const openForm = () => {
    setIsFormVisible(true);
  };
 
 /** 
 * Confirms the action in the confirmation modal based on the selected cryptocurrency.
 * 
 * @async
 */
  const handleConfirmModal = async () => {
    setIsLoading(true);
    try {
      if (datosModal) {
        if (datosModal.crypto === 'eth') {
          await handleCreateEscrow(datosModal.value, datosModal.price, true);
        } else if (datosModal.crypto === 'usdt') {
          await handleCreateEscrow(datosModal.value, datosModal.price, false);
        }
      }
    } catch (error) {
      console.error("Error al crear el escrow:", error);
    } finally {
      setIsLoading(false);
    }
    setIsModalOpen(false);
  };
  
 /** 
 * Opens the form modal with the provided data.
 * 
 * @param {any} data - The form data.
 */
  const openFormularioOferta = (data: any) => {
    setDatosModal(data);
    setIsModalOpen(true);
  };

 /** 
 * Closes the summary modal.
 */
  const closeModal = () => {
    setIsModalOpen(false);
  };

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
                            acceptEscrow={() => handleAcceptEscrow(offer.id, offer[3], true)}
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
                            acceptEscrow={() => handleAcceptEscrow(offer.id, offer[3], false)}
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

