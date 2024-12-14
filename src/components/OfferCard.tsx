import React, { useState } from 'react';
import { ethers } from 'ethers';
import ConfirmationModal from './ModalConfirmation';
import CancelationModal from './ModalCancelation';
import '../styles/OfferCard.css';

/**
 * A component that displays an offer card with options to accept or cancel the offer.
 *
 * @param {Object} props - The component props.
 * @param {any} props.offer - The offer object containing details like id, value, cost, and whether it's an ETH offer.
 * @param {Function} props.acceptEscrow - Function to accept the offer. It requires the offer id, cost, and a boolean indicating if it's an ETH offer.
 * @param {Function} props.cancelEscrow - Function to cancel the offer. It requires the offer id.
 * @param {string} props.address - The user's wallet address.
 * @return {JSX.Element} The JSX for the offer card.
 */
interface OfferCardProps {
  offer: any;
  acceptEscrow: (id: number, cost: number, isEthOffer: boolean) => void;
  // acceptEscrowNativeCoin: (id: number, cost: number, isEthOffer: boolean) => void;
  cancelEscrow: (id: number) => void;
  address: string;
}
const OfferCard: React.FC<OfferCardProps> = ({ offer, acceptEscrow, cancelEscrow, address }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  /**
  * Handles the acceptance of the offer.
  * Checks if the offer is in escrow with native coins or USDT and calls the appropriate function.
  */
  const handleAccept = () => {
    if (offer[6]) {//comprobar si es escrowNative
      acceptEscrow(offer.id, offer?.[3], true);//Aceptar escrow ETH
      // acceptEscrowNativeCoin(offer.id, offer?.[3]);//Aceptar escrow ETH
    } else {
      acceptEscrow(offer?.id, offer?.[3], false);//Aceptar escrow USDT
    }
    setShowModal(false);
  };

  /**
   * Handles the cancellation of the offer.
   * Only allows the offer to be canceled if the user is the creator.
   */
  const handleCancel = () => {
    if (offer[1] === address) {//comprobar si es escrowNative
      cancelEscrow(offer.id);//Cancelar un escrow
    }
    setShowModal(false);//Ocultar el modal
  };
  // Conversion and display logic
  const weiValue = BigInt(offer?.[2]?.toString() || "0"); // Valor en wei
  const _cost = BigInt(offer?.[3]?.toString() || "0"); // Coste en wei

  // Determinar el tipo de oferta
  // Determine the type of offer (ETH or USDT)
  const isEthOffer = offer?.[6];

  // Convertir el valor de wei a la unidad correspondiente
  // Convert value from wei to the appropriate unit
  const valueInEth = parseFloat(ethers.formatEther(weiValue)); // Convertir wei a ETH y a número
  const valueInUsdt = Number(weiValue) / 1e6; // Convertir wei a USDT y a número

  const valueToDisplay = isEthOffer
    ? valueInEth.toFixed(18) // Convertir a ETH y limitar a 18 decimales
    : valueInUsdt.toFixed(6); // Convertir a USDT y limitar a 6 decimales

  // Convertir el coste de wei a la unidad correspondiente
  // Convert cost from wei to the appropriate unit
  const costInEth = parseFloat(ethers.formatEther(_cost)); // Convertir wei a ETH y a número
  const costInUsdt = Number(_cost) / 1e6; // Convertir wei a USDT y a número

  const costToDisplay = isEthOffer
    ? costInUsdt.toFixed(6) // Convertir a USDT y limitar a 6 decimales
    : costInEth.toFixed(18); // Convertir a ETH y limitar a 18 decimales

  // Determinar si el usuario es el creador de la oferta
  // Determine if the user is the creator of the offer
  const isCreator = offer[1] === address;

  return (
    <div className='offerCard'>
      <h3>Oferta {offer?.id}</h3>
      <p>Valor: {valueToDisplay} {isEthOffer ? 'ETH' : 'USDT'}</p>
      <p>Coste: {costToDisplay} {!isEthOffer ? 'ETH' : 'USDT'}</p>
      <p>Tipo: {offer?.[6] ? 'ETH' : 'UDST'}</p>
      <p>Comision: {offer?.[8].toString()}</p>
      <div className='offercard-button-container'>
        {isCreator ? (
          <>
            <button className='cancel-button' onClick={() => { setShowModal(true); setIsCanceling(true); }}>Cancelar Oferta</button>
            <CancelationModal
              show={showModal}
              onClose={() => setShowModal(false)}
              onConfirm={handleCancel}
              offer={offer}
            />
          </>
        ) : (
          <>
            <button className='accept-button' onClick={() => { setShowModal(true); setIsCanceling(false); }}>Aceptar Oferta</button>
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