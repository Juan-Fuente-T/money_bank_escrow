// SPDX-License-Identifier: Open software License 3.0(OSL-3.0)
pragma solidity ^0.8.24;
import {Script, console2 } from "forge-std/Script.sol";
import { Moneybank } from "../src/Moneybank.sol";
import { USDTToken  } from "../src/USDTToken.sol";

contract MoneybankScript is Script {
    Moneybank public moneybank;
    USDTToken public usdtToken;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        console2.log("Deployer private key: ", deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);
        usdtToken = new USDTToken();
        console2.log("UsdtToken deployed at: ", address(usdtToken));
        require(address(usdtToken) != address(0), "Failed to deploy USDTToken");

        moneybank = new Moneybank(address(usdtToken));
        console2.log("Moneybank deployed at: ", address(moneybank));
        require(address(moneybank) != address(0), "Failed to deploy Moneybank");
        vm.stopBroadcast();
    }
}




// import {Script, console2 } from "foundry/lib/forge-std/src/Script.sol";

// //es necesario agregar el RPC_URl y la ETHERSCAN_API_KEY AL foundry.toml

// //contract Proxy1967UUPSScript is Script {
// contract MyScript is Script {
//     function setUp() public {}

//     function run() external {
//         uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
//         vm.startBroadcast(deployerPrivateKey);
//         vm.broadcast();
//         // LuxtycheMarketplace luxtyche = new LuxtycheMarketplacer();
//         // Proxy1967Marketplace proxy = new Proxy1967Marketplace(
//         //     address(marketplace),
//         //     abi.encodeWithSignature("initialize()")
//         // );
//         vm.stopBroadcast();
//     }
// }