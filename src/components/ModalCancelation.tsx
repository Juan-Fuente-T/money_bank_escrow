// CancelationModal.tsx
import React from 'react';
import '../styles/ModalConfirmation.css'; 
import truncateEthAddress from 'truncate-eth-address';


interface CancelationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  offer: any;
}

/**
 * A modal component for canceling an offer.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - Whether the modal should be displayed.
 * @param {() => void} props.onClose - A callback function to call when the modal is closed.
 * @param {() => void} props.onConfirm - A callback function to call when the cancel button is clicked.
 * @param {any} props.offer - The offer object being canceled.
 * @return {JSX.Element|null} The modal component or null if it should not be displayed.
 */
const CancelationModal: React.FC<CancelationModalProps> = ({ show, onClose, onConfirm, offer }: { show: boolean; onClose: () => void; onConfirm: () => void; offer: any; }): JSX.Element | null => {
    if (!show) return null; // No renderiza nada si el modal no debe mostrarse

    return (
      <div className="modal-overlay-confirmation">
        <div className="modal-content-confirmation">
          {/* <button className="modal-close-confirmation" onClick={onClose}>X</button> */}
          <h2>Cancelar</h2>
          <p>¿Estás seguro de que quieres cancelar esta oferta?</p>
          <p>Número de oferta: {offer?.id}</p>
          <ul>
            <li>Valor: {offer?.[2].toString()}</li>
            <li>Coste: {offer?.[3].toString()}</li>
            <p>Tipo: {offer?.[6]? 'ETH': 'UDST'}</p>
            <li>Vendedor: {truncateEthAddress(offer?.[1])}</li>
            <li>Comision: {offer?.[8].toString()}</li> 
          </ul>
          <div className="modal-actions-confirmation">
            <button className="modal-button-confirmation-cancel" onClick={onClose}>x</button>
            <button className="modal-button-confirmation-confirm" onClick={onConfirm}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default CancelationModal;