import React, { useState } from 'react';
import { ethers } from 'ethers'; 
import ConfirmationModal from './ModalConfirmation'; 
import CancelationModal from './ModalCancelation'; 
import '../styles/OfferCard.css';


interface OfferCardProps {
    offer: any;
    acceptEscrowToken: (id: number, cost: number) => void;
    acceptEscrowNativeCoin: (id: number, cost: number) => void;
    cancelEscrow: (id: number) => void;
    address: string;
  }
  const OfferCard: React.FC<OfferCardProps> = ({ offer, acceptEscrowToken, acceptEscrowNativeCoin, cancelEscrow, address }) => {
      const [showModal, setShowModal] = useState(false);
      const [isCanceling, setIsCanceling] = useState(false);
    const handleAccept = () => {
      if (offer[6]) {//comprobar si es escrowNative
        acceptEscrowNativeCoin(offer.id, offer?.[3]);//Aceptar escrow ETH
      } else {
        acceptEscrowToken(offer?.id, offer?.[3]);//Aceptar escrow USDT
      }
      setShowModal(false);
    };
    const handleCancel = () => {
      if (offer[1] === address) {//comprobar si es escrowNative
        cancelEscrow(offer.id);//Cancelar un escrow
      } 
      setShowModal(false);//Ocultar el modal
    };
    
    const weiValue = BigInt(offer?.[2]?.toString() || "0"); // Valor en wei
    const _cost = BigInt(offer?.[3]?.toString() || "0"); // Coste en wei
    // console.log("Cost", _cost);
    // console.log("WeiValue", weiValue);
    // Determinar el tipo de oferta
    const isEthOffer = offer?.[6]; 
    
    // Convertir el valor de wei a la unidad correspondiente
    const valueInEth = parseFloat(ethers.formatEther(weiValue)); // Convertir wei a ETH y a número
    const valueInUsdt = Number(weiValue) / 1e12; // Convertir wei a USDT y a número
    // console.log("Value in Eth", valueInEth);
    // console.log("Value in Usdt", valueInUsdt);
    
    const valueToDisplay = isEthOffer 
        ? valueInEth.toFixed(18) // Convertir a ETH y limitar a 18 decimales
        : valueInUsdt.toFixed(6); // Convertir a USDT y limitar a 6 decimales
      
    // Convertir el coste de wei a la unidad correspondiente
    const costInEth = parseFloat(ethers.formatEther(_cost)); // Convertir wei a ETH y a número
    const costInUsdt = Number(_cost) / 1e12; // Convertir wei a USDT y a número

    const costToDisplay = isEthOffer 
        ? costInUsdt.toFixed(6) // Convertir a USDT y limitar a 6 decimales
        : costInEth.toFixed(18); // Convertir a ETH y limitar a 18 decimales

  // Determinar si el usuario es el creador de la oferta
  const isCreator = offer[1] === address;
  
  return (
    <div className='offerCard'>
      <h3>Oferta {offer?.id}</h3>
      <p>Valor: {valueToDisplay} {isEthOffer ? 'ETH' : 'USDT'}</p>
      <p>Coste: {costToDisplay} {!isEthOffer ? 'ETH' : 'USDT'}</p>
      <p>Tipo: {offer?.[5]? 'ETH': 'UDST'}</p>
      <p>Comision: {offer?.[8].toString()}</p>
      <div className='offercard-button-container'>
                {isCreator ? (
                    <>
                        <button onClick={() => { setShowModal(true); setIsCanceling(true); }}>Cancelar Oferta</button>
                        <CancelationModal
                            show={showModal}
                            onClose={() => setShowModal(false)}
                            onConfirm={handleCancel}
                            offer={offer}
                        />
                    </>
                ) : (
                    <>
                        <button onClick={() => { setShowModal(true); setIsCanceling(false); }}>Aceptar Oferta</button>
                        <ConfirmationModal
                            show={showModal && !isCanceling}
                            onClose={() => setShowModal(false)}
                            onConfirm={handleAccept}
                            offer={offer}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default OfferCard;