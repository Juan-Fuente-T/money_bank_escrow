import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ToastContainer } from 'react-toastify'
import Modal from 'react-modal';
import { UserProvider } from './contexts/UserContext';

Modal.setAppElement('#root');

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
      <ToastContainer />
    </UserProvider>
  </React.StrictMode>
);

// //USO CON WAGMI Y RAINBOWKIT
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'
// import {RainbowKitProvider,darkTheme,getDefaultConfig} from '@rainbow-me/rainbowkit'
// // import { arbitrumSepolia } from 'wagmi/chains'
// // import { polygonAmoy } from 'wagmi/chains'
// import { sepolia } from 'wagmi/chains'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { WagmiProvider } from 'wagmi'
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import '@rainbow-me/rainbowkit/styles.css'

// const queryClient = new QueryClient()

// const projectId = process.env.REACT_APP_PROJECT_ID;

// if(!projectId){
//   throw new Error('REACT_APP_PROJECT_ID is not set')
// }

// export const config = getDefaultConfig({
//   appName: 'Supply Chain',
//   projectId: projectId,
//   // chains: [arbitrumSepolia],
//   chains: [sepolia],
//   // chains: [polygonAmoy],
// })

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider theme={darkTheme()}>
//         {/* <RainbowKitProvider theme={lightTheme()}> */}
//         {/* <RainbowKitProvider theme={midnightTheme()}> */}
//           <App />
//           <ToastContainer />
//         </RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   </React.StrictMode>
// )
