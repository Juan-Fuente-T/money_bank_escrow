// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.24;

// contract SplitSignature {
//     function splitSignature(
//         bytes memory sig
//     ) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
//         require(sig.length == 65, "Invalid signature length");

//         assembly {
//             r := mload(add(sig, 32))
//             s := mload(add(sig, 64))
//             v := byte(0, mload(add(sig, 96)))
//         }

//         return (r, s, v);
//     }
// }