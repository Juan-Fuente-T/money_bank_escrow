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