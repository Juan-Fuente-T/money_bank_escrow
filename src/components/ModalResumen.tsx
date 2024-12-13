import { useState } from 'react';
import '../styles/ModalResumen.css'; 

type ModalResumenProps = {
  onCloseModal: () => void;
  datosModal: DatosModal
  onConfirm: () => void;
};

  // Define los tipos para datosModal
  type DatosModal = {
    crypto: string; 
    value: string;
    price: string;
    maximo: string;
    minimo: string;
    conditions: string;
  };

  /**
   *  Renders a modal window with a summary of the transaction data.
   * 
   *  @param {ModalResumenProps} props - The properties for the modal window.
   *  @param {function} props.onCloseModal - A callback function to close the modal window.
   *  @param {DatosModal} props.datosModal - An object containing the transaction data.
   *  @param {function} props.onConfirm - A callback function to confirm the transaction.
   * 
   *  @return {JSX.Element} The JSX element representing the modal window.
   */
  const ModalResumen: React.FC<ModalResumenProps> = ({ onCloseModal, datosModal, onConfirm }: ModalResumenProps): JSX.Element => {
  const isValidCrypto = datosModal.crypto === "usdt" || datosModal.crypto === "eth";
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const handleConfirm = () => {
    setIsButtonDisabled(true);
    onConfirm();
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* <p>{datosModal.crypto === "usdt"? "USDT" : "ETH"}</p> */}
        <p>{isValidCrypto ? datosModal.crypto.toUpperCase() : "Criptomoneda no válida"}</p>
        <p>Cantidad disponible: {datosModal.value}</p>
        <p>Precio por unidad: {datosModal.price}</p>
        {/* <p>Límite máximo de venta: {datosModal.maximo}</p>
        <p>Límite mínimo de venta: {datosModal.minimo}</p> */}
        <p>Condiciones de venta: {datosModal.conditions}</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCloseModal} disabled={isButtonDisabled}>
            x
          </button>
          <button className="btn-confirm" onClick={handleConfirm} disabled={isButtonDisabled}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalResumen;
