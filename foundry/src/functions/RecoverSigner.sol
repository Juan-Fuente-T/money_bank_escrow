// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.24;

// import {SplitSignature} from "./SplitSignature.sol";

// contract RecoverySigner {
//     // Función para recuperar el firmante de un mensaje
//     function recoverSigner(
//         bytes32 message,
//         bytes memory signature
//     ) public pure returns (address) {
//         (bytes32 r, bytes32 s, uint8 v) = SplitSignature.splitSignature(signature); // Llamada explícita
//         return ecrecover(message, v, r, s);
//     }
    
// }
