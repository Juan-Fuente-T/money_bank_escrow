import React, { useState } from "react";
import "../styles/FormularioOferta.css";

// Definición de las propiedades que acepta el componente FormularioOferta
type FormularioOfertaProps = {
  /**
 * Function executed upon form submission.
 * @param e - Form event being submitted.
 */
  handleSubmitModal: (e: React.FormEvent<HTMLFormElement>) => void;
  /**
 * Data to be displayed in the modal.
 * @property crypto - Type of cryptocurrency.
 * @property value - Offer value.
 * @property price - Current cryptocurrency price.
 * @property conditions - Offer conditions.
 */
  datosModal: {
    crypto: string;
    value: string;
    price: string;
    conditions: string;
  };
  /**
   * Function that handles changes in input fields.
   * @param e -   Input event being changed.
   */
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCloseForm: () => void; //Función que se ejecuta al cerrar el formulario.
  balanceOf: number;
  ethBalance: string;
  prices: {
    //Precios de las criptomonedas disponibles.
    [key: string]: {
      precio: number;
      nombre: string;
    };
  };
};

/**
 * Functional component representing a form for making cryptocurrency offers.
 *
 * @param {object} props - Component properties.
 * @param {function} props.handleSubmitModal - Function executed upon form submission.
 * @param {object} props.datosModal - Data to be displayed in the modal.
 * @param {function} props.handleChange - Function that handles changes in input fields.
 * @param {function} props.onCloseForm - Function executed when the form is closed.
 * @param {string} props.ethBalance - ETH account balance.
 * @param {number} props.balanceOf - Balance of the selected cryptocurrency.
 * @param {object} props.prices - Prices of available cryptocurrencies.
 * @return {JSX.Element} - Rendered component.
*/
const FormularioOferta: React.FC<FormularioOfertaProps> = ({
  handleSubmitModal,
  datosModal,
  handleChange,
  onCloseForm,
  ethBalance,
  balanceOf,
  prices,
}) => {
  // Obtiene el precio de USDT y ETH desde el objeto de precios
  const usdtPrecio = prices["usdt"]?.precio;
  const ethPrecio = prices["eth"]?.precio;
  // const usdtPrecio = 1; //Precios simulados usados durante el desarrollo
  // const ethPrecio = 3333;

  const ethPriceInUsdt = prices["eth"]?.precio / prices["usdt"]?.precio || 1;
  const usdtPriceInEth = prices["usdt"]?.precio / prices["eth"]?.precio || 1;

  // Valores iniciales para usdtValue y ethValue
  const initialUsdtValue = "";
  const initialEthValue = "";
  // Estado para almacenar los valores de USDT y ETH
  const [usdtValue, setUsdtValue] = useState(initialUsdtValue);
  const [ethValue, setEthValue] = useState(initialEthValue);

/**
 * Handles changes in the USDT and ETH input fields, updating the corresponding values 
 * and performing conversions between the two cryptocurrencies as necessary.
 *
 * @param {object} event - The change event from the input field.
 * @param {object} event.target - The object that triggered the event.
 * @param {string} event.target.name - The name of the input field.
 * @param {string} event.target.value - The value of the input field.
 * @return {void}
 */
  const handleInputChange = (event: { target: { name: string; value: string} }) => {
    const { name, value } = event.target;

    // Reemplaza comas por puntos y elimina espacios en blanco
    let newVal = value.replace(",", ".");
    let newValue = newVal.trim();
    // Verifica si el nuevo valor es una cadena vacía o contiene caracteres no numéricos
    if (!newValue || isNaN(parseFloat(newValue))) {
      // Limpia el valor del campo correspondiente
      if (name === "usdt") {
        setUsdtValue(initialUsdtValue);
        // setEthValue(usdtValue); // Mantiene el valor de ETH igual
        setEthValue("");
      } else if (name === "eth") {
        setEthValue(initialEthValue);
        // setUsdtValue(ethValue); // Mantiene el valor de USDT igual
        setUsdtValue("");
      }
      return; // Sale de la función si no es eth o usdt
    }

    if (name === "usdt") {
      setUsdtValue(newValue);
      // Convierte USDT a ETH: Divide la cantidad de USDT por el precio de ETH en dólares
      const convertedEthValue = parseFloat(newValue) * usdtPriceInEth; // Ajusta los decimales a 18 para ETH
      // console.log("convertedEthValue", convertedEthValue.toFixed(18));
      setEthValue(convertedEthValue.toFixed(18));
    } else if (name === "eth") {
      setEthValue(newValue);
      // Convierte ETH a USDT: Multiplica la cantidad de ETH por el precio de ETH en dólares
      const convertedUsdtValue = parseFloat(newValue) * ethPriceInUsdt; // Ajusta los decimales a 6 para USDT
      // console.log("convertedUsdtValue", parseFloat(newValue) * ethPriceInUsdt);
      setUsdtValue(convertedUsdtValue.toFixed(6));
    }
    // console.log("usdtValue", usdtValue, "ethValue", ethValue);
  };
  /**
   * Close the form and reset the state.
   *
   * @return {void}
   */
  const handleClose = () => {
    onCloseForm(); // Reinicia datosModal y cierra el formulario
  };
  return (
    <div className="form">
      <form onSubmit={handleSubmitModal}>
        <div className="form-price-container">
          <div className="form-prices-cont">
            <div className="form-prices">
              {prices && <p>1 ETH es {ethPrecio} dolares </p>}
              {prices && <p>1 USDT es {usdtPrecio} dolares</p>}
            </div>
            <div className="form-prices">
              {prices && <p>1 ETH es {(ethPrecio / usdtPrecio).toFixed(6)} usdt</p>}
              {prices && (
                <p>1 USDT es {(usdtPrecio / ethPrecio).toFixed(18)} eth </p>
              )}
            </div>
          </div>
          <div>
            <button className="form-close-button" onClick={handleClose}>
              x
            </button>
          </div>

          <div className="conversor-container">
            <p>Valor de cambio de USDT a ETH y viceversa</p>
            <div className="converter-container">
              <label htmlFor="usdt">USDT:</label>
              <input
                type="text"
                pattern="\d*(\.\d{0,18})?"
                id="usdt"
                name="usdt"
                value={usdtValue}
                onChange={handleInputChange}
              />
            </div>
            <div className="converter-container">
              {/* <p>ETH: {ethValue}</p> */}
              <label className="eth" htmlFor="eth">ETH:</label>
              <input
                type="text"
                pattern="\d*(\.\d{0,18})?"
                id="eth"
                name="eth"
                value={ethValue}
                onChange={handleInputChange}
              />
              {/* <p>USDT: {usdtValue}</p> */}
            </div>
          </div>
        </div>
        <div className="radio-container">
          <label htmlFor="usdt">
            <input
              type="radio"
              id="usdt"
              name="crypto"
              value="usdt"
              checked={datosModal.crypto === "usdt"}
              onChange={handleChange}
            />
            Seleccionar USDT como moneda de origen
          </label>
          <label htmlFor="eth">
            <input
              type="radio"
              id="eth"
              name="crypto"
              value="eth"
              checked={datosModal.crypto === "eth"}
              onChange={handleChange}
            />
            Seleccionar ETH como moneda de origen
          </label>
        </div>
        <p className="text-decimals">Usar máximo 18 decimales para ETH y 6 para USDT. {`Tu saldo disponible es: ${datosModal.crypto === "usdt" ? balanceOf.toString() : ethBalance} ${' '} ${datosModal.crypto === "usdt" ? "USDT" : "ETH"}`}</p>
        <div className="inputs-container">
          <div className="inputs">
            <label htmlFor="value">
              {/* Cantidad - Usar 18 decimales para ETH y 6 para USDT */}
              Cantidad
            </label>
            <input
              type="text"
              id="value"
              name="value"
              // placeholder="Ejemplo 12.555577 USDT o 0.000000000000000111 ETH"
              // placeholder={`Ej. 12.55667 USDT o 0.000111 ETH. Disponible: ${datosModal.crypto === "usdt" ? balanceOf.toString() : ethBalance} ${' '} ${datosModal.crypto === "usdt" ? "USDT" : "ETH"}`}
              placeholder="Ej. 12.5566 USDT o 0.000111 ETH."
              value={datosModal.value}
              onChange={handleChange}
            ></input>
            {/* <p>
            Disponible:{" "}
            {datosModal.crypto === "usdt" ? balanceOf.toString() : ethBalance}
            </p> */}
            <label htmlFor="price">
              {/* Precio por unidad - Usar 18 decimales para ETH y 6 para USDT */}
              Precio por unidad
            </label>
            <input
              type="text"
              id="price"
              name="price"
              placeholder="Ej. 2600.50 o 0.000384542166381116 ETH"
              value={datosModal.price}
              onChange={handleChange}
            ></input>
          </div>
          <div>
            <label htmlFor="conditions">Condiciones de la venta</label>
            <textarea
              id="conditions"
              name="conditions"
              placeholder="Condiciones de la venta"
              rows={3}
              cols={70}
              value={datosModal.conditions}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
          {/* <p className="text-balance">{`Tu saldo disponible es: ${datosModal.crypto === "usdt" ? balanceOf.toString() : ethBalance} ${' '} ${datosModal.crypto === "usdt" ? "USDT" : "ETH"}`}</p> */}
        {/* </div> */}
        <button type="submit">Crear Oferta {datosModal.crypto}</button>
      </form>
    </div>
  );
};

export default FormularioOferta;
