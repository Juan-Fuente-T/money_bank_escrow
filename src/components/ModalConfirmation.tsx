// ConfirmationModal.tsx
import React from 'react';
import '../styles/ModalConfirmation.css'; // Asegúrate de crear este archivo CSS
// import { Modal, Button } from 'react-bootstrap'; 
import truncateEthAddress from 'truncate-eth-address';


interface ConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  offer: any;
}

/**
 * Renders a confirmation modal with details of an offer and actions to confirm or cancel.
 *
 * @param {boolean} show - Whether the modal should be displayed.
 * @param {() => void} props.onClose - Callback function to close the modal.
 * @param {() => void} props.onConfirm  - Callback function to confirm the offer.
 * @param {any} props.offer - Details of the offer to be displayed.
 * @return {JSX.Element|null} The modal component or null if it should not be displayed.
 */

// CancelationModal muestra una confirmación antes de cancelar una oferta.
// Permite al usuario revisar los detalles de la oferta antes de confirmar la cancelación.
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, onClose, onConfirm, offer }) => {
    if (!show) return null; // No renderiza nada si el modal no debe mostrarse
    return (
      <div className="modal-overlay-confirmation">
        <div className="modal-content-confirmation">
          {/* <button className="modal-close-confirmation" onClick={onClose}>X</button> */}
          <h2>Confirmar</h2>
          <p>¿Estás seguro de que quieres aceptar esta oferta?</p>
          <p>Detalles de la oferta: {offer?.id}</p>
          <ul>
            <li>Valor: {offer?.[2].toString()}</li>
            <li>Coste: {offer?.[3].toString()}</li>
            <p>Tipo: {offer?.[6]? 'ETF': 'UDST'}</p>
            <li>Vendedor: {truncateEthAddress(offer?.[1])}</li>
            <li>Comision: {offer?.[8].toString()}</li>
          </ul>
          <div className="modal-actions-confirmation">
            <button className="modal-button-confirmation-cancel" onClick={onClose}>x</button>
            <button className="modal-button-confirmation-confirm" onClick={onConfirm}>Aceptar</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationModal;