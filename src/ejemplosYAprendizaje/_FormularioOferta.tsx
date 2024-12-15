import React, { useState } from "react";
import "../styles/FormularioOferta.css";

// Definición de las propiedades que acepta el componente FormularioOferta
type FormularioOfertaProps = {
  /**
   * Función que se ejecuta al enviar el formulario.
   * @param e - Evento de formulario que se está enviando.
   */
  handleSubmitModal: (e: React.FormEvent<HTMLFormElement>) => void;
  /**
   * Datos que se mostrarán en el modal.
   * @property crypto - Tipo de criptomoneda.
   * @property value - Valor de la oferta.
   * @property price - Precio actual de la criptomoneda.
   * @property conditions - Condiciones de la oferta.
   */
  datosModal: {
    crypto: string;
    value: string;
    price: string;
    conditions: string;
  };
  /**
   * Función que maneja los cambios en los campos de entrada.
   * @param e - Evento de cambio en el campo de entrada.
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
 * Componente funcional que representa un formulario para realizar ofertas de criptomonedas.
 *
 * @param {object} props - Propiedades del componente.
 * @param {function} props.handleSubmitModal - Función que se ejecuta al enviar el formulario.
 * @param {object} props.datosModal - Datos que se mostrarán en el modal.
 * @param {function} props.handleChange - Función que maneja los cambios en los campos de entrada.
 * @param {function} props.onCloseForm - Función que se ejecuta al cerrar el formulario.
 * @param {string} props.ethBalance - Balance de la cuenta en ETH.
 * @param {number} props.balanceOf - Balance de la cuenta en la criptomoneda seleccionada.
 * @param {object} props.prices - Precios de las criptomonedas disponibles.
 * @return {JSX.Element} - Componente renderizado.
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

  const ethPriceInUsdt = prices["eth"]?.precio / prices["usdt"]?.precio;
  const usdtPriceInEth = prices["usdt"]?.precio / prices["eth"]?.precio;

  // Valores iniciales para usdtValue y ethValue
  const initialUsdtValue = "";
  const initialEthValue = "";
  // Estado para almacenar los valores de USDT y ETH
  const [usdtValue, setUsdtValue] = useState(initialUsdtValue);
  const [ethValue, setEthValue] = useState(initialEthValue);

  /**
   /**
   * Maneja los cambios en los campos de entrada de USDT y ETH, 
   * actualizando los valores correspondientes y realizando conversiones 
   * entre ambas criptomonedas según sea necesario.
   *
   * @param {object} event - Evento de cambio en el campo de entrada.
   * @param {object} event.target - Objeto que desencadenó el evento.
   * @param {string} event.target.name - Nombre del campo de entrada.
   * @param {string} event.target.value - Valor del campo de entrada.
   * @return {void}
   */
  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;

    // Reemplaza comas por puntos
    let newValue = value.replace(",", ".");

    // Verifica si el nuevo valor es una cadena vacía o contiene caracteres no numéricos
    if (!newValue || isNaN(parseFloat(newValue))) {
      // Limpia el valor del campo correspondiente
      if (name === "usdt") {
        setUsdtValue(initialUsdtValue);
        setEthValue(usdtValue); // Mantiene el valor de ETH igual
      } else if (name === "eth") {
        setEthValue(initialEthValue);
        setUsdtValue(ethValue); // Mantiene el valor de USDT igual
      }
      return; // Sale de la función si no es eth o usdt
    }

    if (name === "usdt") {
      setUsdtValue(newValue);
      // Convierte USDT a ETH: Divide la cantidad de USDT por el precio de ETH en dólares
      const convertedEthValue = parseFloat(newValue) * usdtPriceInEth; // Ajusta los decimales a 18 para ETH
      setEthValue(convertedEthValue.toFixed(18));
    } else if (name === "eth") {
      setEthValue(newValue);
      // Convierte ETH a USDT: Multiplica la cantidad de ETH por el precio de ETH en dólares
      const convertedUsdtValue = parseFloat(newValue) * ethPriceInUsdt; // Ajusta los decimales a 6 para USDT
      setUsdtValue(convertedUsdtValue.toFixed(6));
    }
  };
  /**
   * Cierra el formulario y reinicia los datos modales.
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
          <div className="form-prices">
            {prices && <p>1 ETH: {ethPrecio} dolares </p>}
            {prices && <p>1 USDT: {usdtPrecio} dolares</p>}
          </div>
          <div className="form-prices">
            {prices && <p>1 ETH: {(ethPrecio / usdtPrecio).toFixed(6)} usdt</p>}
            {prices && (
              <p>1 USDT: {(usdtPrecio / ethPrecio).toFixed(18)} eth </p>
            )}
          </div>
          <div>
            <button className="form-close-button" onClick={handleClose}>
              x
            </button>
          </div>
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
            {/* <p>ETH: {ethValue}</p> */}
            <label htmlFor="eth">ETH:</label>
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
        <div className="inputs-container">
          <label htmlFor="value">
            Cantidad - Usar 18 decimales para ETH y 6 para USDT
          </label>
          <input
            type="text"
            id="value"
            name="value"
            // placeholder="Ejemplo 12.555577 USDT o 0.000000000000000111 ETH"
            placeholder={`Ejemplo 12.55667 USDT o 0.000111 ETH. Disponible: ${datosModal.crypto === "usdt" ? balanceOf.toString() : ethBalance } ${ ' ' } ${  datosModal.crypto === "usdt" ? "USDT" : "ETH" }` }
            value={datosModal.value}
            onChange={handleChange}
            ></input>
          {/* <p>
            Disponible:{" "}
            {datosModal.crypto === "usdt" ? balanceOf.toString() : ethBalance}
          </p> */}
          <label htmlFor="price">
            Precio por unidad - Usar 18 decimales para ETH y 6 para USDT
          </label>
          <input
            type="text"
            id="price"
            name="price"
            placeholder="Ejemplo 4500000 USDT o 1000000000000000000 ETH"
            value={datosModal.price}
            onChange={handleChange}
          ></input>
          {/* Elementos descartados temporalmente ¿interesa recuperarlos?  */}
          
          {/* <div className={styles.container}>
                        <input type="radio" id="usdt" name="crypto" value="usdt" checked={datosModal.usdt} onChange={handleChange}></input>
                  <label for="usdt">USDT</label><br></br>
                           <input type="radio" id="eth" name="crypto" value="eth" checked={datosModal.eth} onChange={handleChange}></input> 
                  <input type="radio" id="eth" name="crypto" value="eth" checked={datosModal.eth} onChange={handleChange}></input>
                           <label for="eth">ETH</label> 
                  <label for="eth">ETH</label>
                </div>
                <div> */}

          {/* <label for="maximo">Límite máximo de venta</label><br></br>
                <input type="number" id="maximo" name="maximo" min="0" step="0.001" placeholder="Límite máximo de venta" value={datosModal.maximo}
                  onChange={handleChange}></input>

                <label for="minimo">Límite mínimo de venta</label><br></br>
                <input type="number" id="minimo" name="minimo" min="0" step="0.001" placeholder="Límite mínimo de venta" value={datosModal.minimo}
                  onChange={handleChange}></input> */}

          <label htmlFor="conditions">Condiciones de la venta</label>
          <textarea
            id="conditions"
            name="conditions"
            placeholder="Condiciones de la venta"
            rows={2}
            cols={90}
            value={datosModal.conditions}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Crear Oferta {datosModal.crypto}</button>
      </form>
    </div>
  );
};

export default FormularioOferta;
