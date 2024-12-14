// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console, console2} from "forge-std/Test.sol";
import { Moneybank } from "../src/Moneybank.sol";
import { USDTToken } from "../src/USDTToken.sol";
import { IERC20 } from "../src/IERC20.sol";
contract MoneybankTest is Test {
    Moneybank public moneybank;
    USDTToken  public token;
    address alice;
    address bob;
    bool private skipNormalSetup;

    enum EscrowStatus {
        Unknown,
        Funded,
        NOT_USED,
        Completed,
        Refund,
        Arbitration
    }


    struct Escrow {
        address payable buyer; //Comprador
        address payable seller; //Vendedor
        uint256 value; //Valor en venta en moneda 1
        uint256 cost; //Monto compra en moneda 2
        uint256 sellerfee; //Comision vendedor
        uint256 buyerfee; //Comision comprador
        bool escrowNative;//De Escrow, USDT (false, por defecto) o ETH(true)
        IERC20 currency; //Moneda
        EscrowStatus status; //Estado
    }

    event EscrowDeposit(uint256 indexed orderId, Escrow escrow);
    event EscrowComplete(uint256 indexed orderId, Escrow escrow);
    event EscrowDisputeResolved(uint256 indexed orderId);
    event EscrowCancelled(uint256 indexed orderId, Escrow escrow);
    event TokenFeesSuccessfullyWithdrawn(address indexed token);
    event EtherFeesSuccessfullyWithdrawn(bool indexed isSent);
    event TokenAddedToWhitelist(address indexed token);
    event TokenRemovedFromWhitelist(address indexed token);
    event BuyerFeeUpdated(uint256 indexed oldFeeBuyer,uint256 indexed newFeeBuyer);
    event SellerFeeUpdated(uint256 indexed oldFeeSeller, uint256 indexed newFeeSeller);


    // function setupSpecificTest() internal {
    // // Configurar estado específico necesario para esta prueba
    //     alice = 0x328809Bc894f92807417D2dAD6b7C998c1aFdac6;
    //     bob = 0x1D96F2f6BeF1202E4Ce1Ff6Dad0c2CB002861d3e;
    //     startHoax(alice, 100000000);
    //     token = new USDTToken();
    //     moneybank = new Moneybank(address(token));
    //     moneybank.addStablesAddresses(address(token));
    // }
    function setUp() public {
        if (!skipNormalSetup) {
            alice = 0x328809Bc894f92807417D2dAD6b7C998c1aFdac6;
            bob = 0x1D96F2f6BeF1202E4Ce1Ff6Dad0c2CB002861d3e;
            vm.startPrank(alice);
            token = new USDTToken();
            vm.stopPrank();
            moneybank = new Moneybank(address(token));
            moneybank.addTokenToWhitelist(address(token));
            startHoax(alice, 100000000);
            console.log(address(token));
        }
    }


        // vm.expectRevert(abi.encodeWithSignature("CantBeAddressZero()"));
        // vm.expectRevert(abi.encodeWithSignature("CantBeAddressZero()"));
        // vm.expectRevert(abi.encodeWithSignature("CantBeAddressZero()"));

////////////////////////////////////TEST ADD STABLE COIN//////////////////////////////////
    function testAddStablesAddresses() public{
        vm.stopPrank();
        // vm.expectRevert(abi.encodeWithSignature("CantBeAddressZero()"));
        moneybank.addTokenToWhitelist(address(token));
        assertTrue(moneybank.whitelistedStablesAddresses(address(token)));
    }

    ////////////////////////////////////TEST FAIL ADD STABLE COIN//////////////////////////////////
    function testAddStablesAddressesFail() public{
        vm.stopPrank();
        vm.expectRevert(abi.encodeWithSignature("CantBeAddressZero()"));
        moneybank.addTokenToWhitelist(address(0));
    }

////////////////////////////////////TEST DEL STABLE COIN//////////////////////////////////
    function testDelStablesAddresses() public{
        vm.stopPrank();
        moneybank.addTokenToWhitelist(address(token));
        assertTrue(moneybank.whitelistedStablesAddresses(address(token)));
        moneybank.deleteTokenFromWhitelist(address(token));
        assertFalse(moneybank.whitelistedStablesAddresses(address(token)));
    }
////////////////////////////////////TEST CREATE ESCROW//////////////////////////////////
    function testCreateEscrowToken() public {
      
        console.log("Balance USDT Alice: ",token.balanceOf(alice));
        assertEq(token.balanceOf(alice), 50000000000000000000000000);
        assertEq(alice.balance, 100000000);
        
        token.approve(address(moneybank), 50);
        // vm.expectEmit();
        // emit EscrowDeposit(0, Moneybank.moneybank.getEscrow(0));
    //     emit EscrowDeposit(0, {
    //     alice; //Comprador
    //     bob; //Vendedor
    //     50; //Monto compra
    //     0; //Comision vendedor
    //     0; //Comision comprador
    //     false;//De Escrow, USDT o ETH
    //     IERC20(address(token)); //Moneda
    //     Moneybank.EscrowStatus.Funded; //Estado
    // });
        // emit EscrowDeposit(0, Escrow escrow);
        moneybank.createEscrowToken(50, 100, IERC20(address(token)));


        assertEq(token.balanceOf(alice), 49999999999999999999999950);
        assertEq(moneybank.getValue(0), 50);

        Moneybank.Escrow memory escrow = moneybank.getEscrow(0);
        assertEq(escrow.seller, alice);
        assertEq(escrow.value, 50);
        assertEq(escrow.cost, 100);
        assertEq(escrow.escrowNative, false);
    }
 ////////////////////////////////////TEST FAIL CREATE ESCROW//////////////////////////////////   
    function testCreateEscrowTokenFail() public {
        console.log("Balance USDT Alice: ",token.balanceOf(alice));
        assertEq(token.balanceOf(alice), 50000000000000000000000000);
        
        // vm.expectEmit(0,  moneybank.getEscrow(0));
        vm.expectRevert(abi.encodeWithSignature("SellerApproveEscrowFirst()"));
        // vm.expectRevert("ERC20: transfer amount exceeds allowance");
        moneybank.createEscrowToken( 150, 300, IERC20(address(token)));

        token.approve(address(moneybank), 200);
        
        // vm.expectRevert(abi.encodeWithSignature("SellerCantBeAddressZero()"));
        // moneybank.createEscrowToken(150, 300, IERC20(address(token)));
        vm.expectRevert(abi.encodeWithSignature("AddressIsNotWhitelisted()")); 
        moneybank.createEscrowToken(150, 300, IERC20(address(bob)));

        // vm.expectRevert(abi.encodeWithSignature("SellerCantBeTheSameAsBuyer()"));
        // moneybank.createEscrowToken(150, 300, IERC20(address(token)));
        
        vm.expectRevert(abi.encodeWithSignature("ValueMustBeGreaterThan0()"));
        moneybank.createEscrowToken(0, 300, IERC20(address(token)));
        assertEq(token.balanceOf(alice), 50000000000000000000000000);
        
        vm.expectRevert(abi.encodeWithSignature("ValueMustBeGreaterThan0()"));
        moneybank.createEscrowToken(150, 0, IERC20(address(token)));
        assertEq(token.balanceOf(alice), 50000000000000000000000000);

        vm.startPrank(bob);
        token.approve(address(moneybank), 150);
        vm.expectRevert("ERC20: transfer amount exceeds balance");
        moneybank.createEscrowToken(150, 300, IERC20(address(token)));
        
    }
 ////////////////////////////////////TEST ACCEPT ESCROW USDT////////////////////////////////// 
    function testAcceptEscrowToken() public {
        assertEq(token.balanceOf(alice), 50000000000000000000000000);
        // token.transfer(bob, 300);
        // assertEq(token.balanceOf(alice), 49999999999999999999999700);
        // assertEq(token.balanceOf(bob), 100);
        assertEq(alice.balance, 100000000);
        assertEq(token.balanceOf(bob), 0);
        token.approve(address(moneybank), 100);
        moneybank.createEscrowToken(100, 20, IERC20(address(token)));
        assertEq(token.balanceOf(alice), 49999999999999999999999900);
        vm.stopPrank();

        Moneybank.Escrow memory escrow  = moneybank.getEscrow(0);
        assertEq(escrow.seller, alice);
        // assertEq(escrow.buyer, bob);
        assertEq(address(escrow.currency), address(token));
        assertEq(escrow.value, 100);
        assertEq(escrow.cost, 20);
        assertEq(uint256(escrow.status), 1);

        startHoax(bob, 1000);
        assertEq(bob.balance, 1000);
        // token.approve(address(moneybank), 300);
        // moneybank.acceptEscrow(0);
    // vm.expectEmit(true, true, true, true);
    // emit EscrowComplete(
    //     0, 
    //     Escrow({
    //         seller: escrow.seller,
    //         buyer: escrow.buyer,
    //         value: escrow.value,
    //         cost: escrow.cost,
    //         sellerfee: escrow.sellerfee,
    //         buyerfee: escrow.buyerfee,
    //         escrowNative: escrow.escrowNative,
    //         currency: escrow.currency,
    //         EscrowStatus status
    //     })
    // );

   
        // moneybank.acceptEscrowToken{value: escrow.cost}(0);
        moneybank.acceptEscrow{value: escrow.cost}(0);
        assertEq(token.balanceOf(bob), 100);
        assertEq(bob.balance, 980);
        assertEq(alice.balance, 100000020);

        Moneybank.Escrow memory escrow1  = moneybank.getEscrow(0);
        assertEq(escrow1.buyer, address(0));
        assertEq(escrow1.seller, address(0));
        assertEq(address(escrow1.currency), address(0));
        assertEq(escrow1.value, 0);
        assertEq(escrow1.cost, 0);
        assertEq(uint256(escrow1.status), 0);
    }
 ////////////////////////////////////TEST ACCEPT ESCROW ETH////////////////////////////////// 
    function testAcceptEscrowNativeCoin() public {
        assertEq(token.balanceOf(alice), 50000000000000000000000000);
        assertEq(token.balanceOf(bob), 0);
        token.transfer(bob, 300);
        assertEq(token.balanceOf(alice), 49999999999999999999999700);
        assertEq(token.balanceOf(bob), 300);
        assertEq(alice.balance, 100000000);
        moneybank.createEscrowNativeCoin{value: 100}(100, 200, IERC20(address(token)));
        assertEq(token.balanceOf(alice), 49999999999999999999999700);
        assertEq(alice.balance, 99999900);
        vm.stopPrank();

        Moneybank.Escrow memory escrow  = moneybank.getEscrow(0);
        assertEq(escrow.seller, alice);
        // assertEq(escrow.buyer, bob);
        assertEq(address(escrow.currency), address(token));
        assertEq(escrow.value, 100);
        assertEq(escrow.cost, 200);
        assertEq(uint256(escrow.status), 1);

        startHoax(bob, 1000);
        assertEq(bob.balance, 1000);
        // token.approve(address(moneybank), 300);
        // moneybank.acceptEscrow(0);
    // vm.expectEmit(true, true, true, true);
    // emit EscrowComplete(
    //     0, 
    //     Escrow({
    //         seller: escrow.seller,
    //         buyer: escrow.buyer,
    //         value: escrow.value,
    //         cost: escrow.cost,
    //         sellerfee: escrow.sellerfee,
    //         buyerfee: escrow.buyerfee,
    //         escrowNative: escrow.escrowNative,
    //         currency: escrow.currency,
    //         EscrowStatus status
    //     })
    // );
        console.log("Es eth?:", escrow.escrowNative);
        token.approve(address(moneybank), 2000);
        // moneybank.acceptEscrow(0);
        // moneybank.acceptEscrowNativeCoin(0);
        moneybank.acceptEscrow(0);
        assertEq(bob.balance, 1100);
        assertEq(alice.balance, 99999900);
        assertEq(token.balanceOf(alice), 49999999999999999999999900);
        assertEq(token.balanceOf(bob), 100);

        Moneybank.Escrow memory escrow1  = moneybank.getEscrow(0);
        assertEq(escrow1.buyer, address(0));
        assertEq(escrow1.seller, address(0));
        assertEq(address(escrow1.currency), address(0));
        assertEq(escrow1.value, 0);
        assertEq(escrow1.cost, 0);
        assertEq(uint256(escrow1.status), 0);
    }
//  ////////////////////////////////////TEST RELEASE ESCROW OWNER////////////////////////////////// 
//     function testReleaseEscrowOwner() public {
//         assertEq(token.balanceOf(alice), 50000000000000000000000000);
//         assertEq(token.balanceOf(bob), 0);
//         token.approve(address(moneybank), 100);
//         moneybank.createEscrow(100, 300, IERC20(address(token)));
//         assertEq(token.balanceOf(alice), 49999999999999999999999900);
//         vm.stopPrank();

//         Moneybank.Escrow memory escrow  = moneybank.getEscrow(0);
//         assertEq(escrow.buyer, alice);
//         assertEq(escrow.seller, bob);
//         assertEq(address(escrow.currency), address(token));
//         assertEq(escrow.value, 100);
//         assertEq(uint256(escrow.status), 1);

//         moneybank.releaseEscrowOwner(0);
//         assertEq(token.balanceOf(bob), 100);

//         Moneybank.Escrow memory escrow1  = moneybank.getEscrow(0);
//         assertEq(escrow1.buyer, address(0));
//         assertEq(escrow1.seller, address(0));
//         assertEq(address(escrow1.currency), address(0));
//         assertEq(escrow1.value, 0);
//         assertEq(uint256(escrow1.status), 0);
//     }
     ////////////////////////////////////TEST FAIL RELEASE ESCROW OWNER////////////////////////////////// 
    function testReleaseEscrowOwnerFail() public {
        token.approve(address(moneybank), 100);
        vm.expectRevert("Ownable: caller is not the owner");
        // moneybank.releaseEscrowOwner(0);

        vm.stopPrank();

        vm.expectRevert(abi.encodeWithSignature("EscrowIsNotFunded()"));
        // moneybank.releaseEscrowOwner(0);
    }
 ////////////////////////////////////TEST RELEASE ESCROW////////////////////////////////// 
    // function testReleaseEscrowBuyer() public {
    //     assertEq(token.balanceOf(alice), 50000000000000000000000000);
    //     assertEq(token.balanceOf(bob), 0);
    //     token.approve(address(moneybank), 100);
    //     moneybank.createEscrow(100, 300, IERC20(address(token)));
    //     assertEq(token.balanceOf(alice), 49999999999999999999999900);

    //     Moneybank.Escrow memory escrow  = moneybank.getEscrow(0);
    //     assertEq(escrow.buyer, alice);
    //     assertEq(escrow.seller, bob);
    //     assertEq(address(escrow.currency), address(token));
    //     assertEq(escrow.value, 100);
    //     assertEq(uint256(escrow.status), 1);

    //     moneybank.releaseEscrow(0);
    //     assertEq(token.balanceOf(bob), 100);

    //     Moneybank.Escrow memory escrow1  = moneybank.getEscrow(0);
    //     assertEq(escrow1.buyer, address(0));
    //     assertEq(escrow1.seller, address(0));
    //     assertEq(address(escrow1.currency), address(0));
    //     assertEq(escrow1.value, 0);
    //     assertEq(uint256(escrow1.status), 0);
    // }
 ////////////////////////////////////TEST FAIL RELEASE ESCROW//////////////////////////////////     
        
    // function testReleaseEscrowBuyerFail() public {
    //     token.approve(address(moneybank), 100);
    //     moneybank.createEscrow(100, 300, IERC20(address(token)));

    //     vm.stopPrank();
        
    //     vm.expectRevert("Only Buyer can call this");
    //     moneybank.releaseEscrow(0);
    //     vm.startPrank(alice);
    //     moneybank.releaseEscrow(0);
    //     vm.expectRevert("Only Buyer can call this");
    //     moneybank.releaseEscrow(0); 
    //     vm.expectRevert("Only Buyer can call this");
    //     moneybank.releaseEscrow(1);
    // }
////////////////////////////////////TEST CREATE ESCROW NATIVE COIN////////////////////////////////// 
    // function testCreateEscrowNativeCoin() public {
    //     // startHoax(bob);
    //     // token.approve(address(moneybank), 100);
    //     // assertEq(token.allowance(alice, address(moneybank)),100);
    //     // vm.startPrank(alice);
    //     console.log("Balance USDT Alice: ", alice.balance);
    //     assertEq(alice.balance, 100000000);
        
    //     // vm.expectEmit();
    //     // emit EscrowDeposit(0, moneybank.getEscrow(0));
    //     moneybank.createEscrowNativeCoin{value:50}(50, 300, address(token));
    //     assertEq(moneybank.getValue(0), 50);
    //     assertEq(alice.balance, 99999950);
        
    //     Moneybank.Escrow memory escrow  = moneybank.getEscrow(0);
    //     // assertEq(escrow.status, 1);
    //     assertEq(escrow.seller, alice);
    //     assertEq(escrow.buyer, address(0));
    //     assertEq(escrow.sellerfee, 0);//Si la fee cambia no debe ser 0
    //     assertEq(escrow.buyerfee, 0);
    //     assertEq(address(escrow.currency), address(0));
    //     assertEq(escrow.value, 50);
    //     assertEq(escrow.cost, 300);
    //     assertEq(uint256(escrow.status), 1);
    // }

////////////////////////////////////TEST FAIL CREATE ESCROW NATIVE COIN//////////////////////////////////    
    // function testCreateEscrowNativeCoinFail() public {
    //     // vm.expectEmit();
    //     // emit EscrowDeposit(0, moneybank.getEscrow(0));

    //     assertEq(alice.balance, 100000000);

    //     vm.expectRevert(abi.encodeWithSignature("IncorretAmount()"));
    //     moneybank.createEscrowNativeCoin{value:50}(100, 300, address(token));
    //     assertEq(alice.balance, 100000000);

    //     vm.expectRevert(abi.encodeWithSignature("ValueMustBeGreaterThan0()"));
    //     moneybank.createEscrowNativeCoin{value:0}(0, 300, address(token));
    //     assertEq(alice.balance, 100000000);

    //     // vm.expectRevert(abi.encodeWithSignature("SellerCantBeAddressZero()"));
    //     // moneybank.createEscrowNativeCoin{value:100}(100, 300, address(token));
        
    //     //Prueba. El Escrow se crea con el valor 100 pero el contrato guarda el valor 120
    //     moneybank.createEscrowNativeCoin{value:120}(100, 300, address(token));
    //     assertEq(alice.balance, 99999880);
    // }

////////////////////////////////////TEST RELEASE ESCROW NATIVE COIN OWNER////////////////////////////////// 
    function testReleaseEscrowOwnerNativeCoin() public {
        assertEq(bob.balance, 0);
        moneybank.createEscrowNativeCoin{value:50}(50, 300, IERC20(address(token)));
        assertEq(alice.balance, 99999950);
    
        Moneybank.Escrow memory escrow  = moneybank.getEscrow(0);
        assertEq(escrow.buyer, alice);
        assertEq(escrow.seller, bob);
        assertEq(address(escrow.currency), address(0));
        assertEq(escrow.value, 50);
        assertEq(uint256(escrow.status), 1);

        vm.stopPrank();
        // moneybank.releaseEscrowOwnerNativeCoin(0);
        assertEq(bob.balance, 50);

        Moneybank.Escrow memory escrow1  = moneybank.getEscrow(0);
        assertEq(escrow1.buyer, address(0));
        assertEq(escrow1.seller, address(0));
        assertEq(address(escrow1.currency), address(0));
        assertEq(escrow1.value, 0);
        assertEq(uint256(escrow1.status), 0);
    }

////////////////////////////////////TEST FAIL RELEASE ESCROW NATIVE COIN OWNER////////////////////////////////// 
    function testReleaseEscrowOwnerNativeCoinFail() public {
        vm.stopPrank();
        vm.expectRevert(abi.encodeWithSignature("EscrowIsNotFunded()"));
        // vm.expectRevert("THX has not been deposited");
        // moneybank.releaseEscrowOwnerNativeCoin(1);

        vm.startPrank(alice);
        assertEq(bob.balance, 0);
        moneybank.createEscrowNativeCoin{value:50}(50, 300, IERC20(address(token)));
        assertEq(moneybank.getValue(0), 50);
        assertEq(alice.balance, 99999950);
    
        vm.expectRevert("Ownable: caller is not the owner");
        // moneybank.releaseEscrowOwnerNativeCoin(0);
        assertEq(bob.balance, 0);
    }
    
////////////////////////////////////TEST RELEASE ESCROW NATIVE COIN////////////////////////////////// 
    function testReleaseEscrowBuyerNativeCoin() public {
        assertEq(bob.balance, 0);
        moneybank.createEscrowNativeCoin{value:50}(50,300, IERC20(address(token)));
        assertEq(moneybank.getValue(0), 50);
        assertEq(alice.balance, 99999950);

        Moneybank.Escrow memory escrow  = moneybank.getEscrow(0);
        assertEq(escrow.buyer, alice);
        assertEq(escrow.seller, bob);
        assertEq(address(escrow.currency), address(0));
        assertEq(escrow.value, 50);
        assertEq(uint256(escrow.status), 1);

        // moneybank.releaseEscrowNativeCoin(0);
        assertEq(bob.balance, 50);

        Moneybank.Escrow memory escrow1  = moneybank.getEscrow(0);
        assertEq(escrow1.buyer, address(0));
        assertEq(escrow1.seller, address(0));
        assertEq(address(escrow1.currency), address(0));
        assertEq(escrow1.value, 0);
        assertEq(uint256(escrow1.status), 0);
    }

////////////////////////////////////TEST FAIL RELEASE ESCROW NATIVE COIN////////////////////////////////// 
    function testReleaseEscrowBuyerNativeCoinFail() public {
        vm.expectRevert("Only Buyer can call this");
        // moneybank.releaseEscrowNativeCoin(1);

        assertEq(bob.balance, 0);
        moneybank.createEscrowNativeCoin{value:50}(50, 300, IERC20(address(token)));
        assertEq(moneybank.getValue(0), 50);
        assertEq(alice.balance, 99999950);

        vm.stopPrank();    
        vm.expectRevert("Only Buyer can call this");
        // moneybank.releaseEscrowNativeCoin(0);
        assertEq(bob.balance, 0);
    }

////////////////////////////////////TEST REFUND ESCROW////////////////////////////////// 
    // function testRefundBuyer() public{
    //     assertEq(token.balanceOf(alice), 50000000000000000000000000);
    //     assertEq(token.balanceOf(bob), 0);
    //     token.approve(address(moneybank), 130);
    //     moneybank.createEscrow(100, 300, IERC20(address(token)));
    //     assertEq(token.balanceOf(alice), 49999999999999999999999900);

    //     vm.stopPrank();

    //     Moneybank.Escrow memory escrow  = moneybank.getEscrow(0);
    //     assertEq(escrow.buyer, alice);
    //     assertEq(escrow.seller, bob);
    //     assertEq(address(escrow.currency), address(token));
    //     assertEq(escrow.value, 100);
    //     assertEq(uint256(escrow.status), 1);

    //     vm.expectEmit();
    //     emit EscrowDisputeResolved(0);
    //     moneybank.refundBuyer(0);
    //     assertEq(token.balanceOf(alice), 50000000000000000000000000);
    //     assertEq(token.balanceOf(bob), 0);

    //     Moneybank.Escrow memory escrow1  = moneybank.getEscrow(0);
    //     assertEq(escrow1.buyer, address(0));
    //     assertEq(escrow1.seller, address(0));
    //     assertEq(address(escrow1.currency), address(0));
    //     assertEq(escrow1.value, 0);
    //     assertEq(uint256(escrow1.status), 0); 
    // }
////////////////////////////////////TEST FAIL REFUND ESCROW////////////////////////////////// 
    // function testRefundBuyerFail() public{

    //     assertEq(token.balanceOf(alice), 50000000000000000000000000);
    //     token.approve(address(moneybank), 100);
    //     moneybank.createEscrow(100, 300, IERC20(address(token)));
    //     assertEq(token.balanceOf(alice), 49999999999999999999999900);

    //     vm.expectRevert("Ownable: caller is not the owner");
    //     moneybank.refundBuyer(0);
    //     vm.stopPrank();

    //     vm.expectRevert(abi.encodeWithSignature("EscrowIsNotFunded()"));
    //     moneybank.refundBuyer(5);
    //     assertEq(token.balanceOf(alice), 49999999999999999999999900);

    //     moneybank.refundBuyer(0);
    //     vm.expectRevert(abi.encodeWithSignature("EscrowIsNotFunded()"));
    //     moneybank.refundBuyer(0);
        
    // }
 
////////////////////////////////////TEST REFUND ESCROW NATIVE COIN////////////////////////////////// 
    function testRefundBuyerNativeCoin() public{
        assertEq(alice.balance, 100000000);
        moneybank.createEscrowNativeCoin{value: 100}(100, 300, IERC20(address(token)));
        assertEq(alice.balance, 99999900);
        assertEq(bob.balance, 0);
        
        vm.stopPrank();

        Moneybank.Escrow memory escrow  = moneybank.getEscrow(0);
        assertEq(escrow.buyer, alice);
        assertEq(escrow.seller, bob);
        assertEq(address(escrow.currency), address(0));
        assertEq(escrow.value, 100);
        assertEq(uint256(escrow.status), 1);

        vm.expectEmit();
        emit EscrowDisputeResolved(0);
        moneybank.refundBuyerNativeCoin(0);
        assertEq(alice.balance, 100000000);
        assertEq(bob.balance, 0);

        Moneybank.Escrow memory escrow1  = moneybank.getEscrow(0);
        assertEq(escrow1.buyer, address(0));
        assertEq(escrow1.seller, address(0));
        assertEq(address(escrow1.currency), address(0));
        assertEq(escrow1.value, 0);
        assertEq(uint256(escrow1.status), 0); 
    }

////////////////////////////////////TEST FAIL REFUND ESCROW NATIVE COIN////////////////////////////////// 
    function testRefundBuyerNativeCoinFail() public{
        assertEq(alice.balance, 100000000);
        moneybank.createEscrowNativeCoin{value: 100}(100, 300, IERC20(address(token)));
        assertEq(alice.balance, 99999900);

        vm.expectRevert("Ownable: caller is not the owner");
        moneybank.refundBuyerNativeCoin(0);
        assertEq(alice.balance, 99999900);
        assertEq(bob.balance, 0);

        vm.stopPrank();
        vm.expectRevert(abi.encodeWithSignature("EscrowIsNotFunded()"));
        moneybank.refundBuyerNativeCoin(5);
        assertEq(alice.balance, 99999900);
        assertEq(bob.balance, 0);
    }
////////////////////////////////////TEST WITHDRAW FEES////////////////////////////////// 
    function testWithdrawFees() public {
        assertEq(token.balanceOf(bob), 0);
        vm.stopPrank();
        moneybank.setFeeSeller(500);
        vm.startPrank(alice);
        assertEq(moneybank.feesAvailable(IERC20(address(token))), 0);
        token.approve(address(moneybank), 3500);
        moneybank.createEscrowToken(700, 1400, IERC20(address(token)));
        // moneybank.releaseEscrow(0);
        moneybank.createEscrowToken(500, 1000, IERC20(address(token)));
        // moneybank.releaseEscrow(1);
        moneybank.createEscrowToken(700, 1400, IERC20(address(token)));
        // moneybank.releaseEscrow(2);
        moneybank.createEscrowToken(600, 1200, IERC20(address(token)));
        // moneybank.releaseEscrow(3);
        assertEq(token.balanceOf(address(this)),0);
        assertEq(moneybank.feesAvailable(IERC20(address(token))), 11);

        vm.stopPrank();
        // moneybank.withdrawFees(IERC20(address(token)));

        assertEq(token.balanceOf(address(this)),11);
        assertEq(token.balanceOf(bob), 2500-11);
        assertEq(moneybank.feesAvailable(IERC20(address(token))), 0);
    }
////////////////////////////////////TEST FAIL WITHDRAW FEES////////////////////////////////// 
    function testWithdrawFeesFail() public{
            assertEq(token.balanceOf(address(this)),0);
            vm.expectRevert("Ownable: caller is not the owner");
            moneybank.withdrawTokenFees(IERC20(address(token)));

            vm.stopPrank();
            vm.expectRevert(abi.encodeWithSignature("NoFeesToWithdraw()"));
            moneybank.withdrawTokenFees(IERC20(address(token)));

            moneybank.setFeeSeller(500);

            assertEq(moneybank.feesAvailable(IERC20(address(token))), 0);
            vm.expectRevert(abi.encodeWithSignature("NoFeesToWithdraw()"));
            moneybank.withdrawTokenFees(IERC20(address(token)));
            assertEq(moneybank.feesAvailable(IERC20(address(token))), 0);
            assertEq(token.balanceOf(address(this)),0);
    }

////////////////////////////////////TEST WITHDRAW FEES NATIVE COIN////////////////////////////////// 
    function testWithdrawFeesNativeCoin() public { 
        vm.stopPrank();
        moneybank.transferOwnership(alice);
        vm.startPrank(alice);
        moneybank.setFeeBuyer(500);
        moneybank.setFeeSeller(400);
        assertEq(moneybank.feesAvailableNativeCoin(), 0);
        assertEq(alice.balance, 100000000);
        uint256 aliceBalance = alice.balance;
        uint256 _value= 100000;
        uint256 _value2= 200000;

        uint256 _amountFeeBuyer = ((_value * (500 * 10 ** token.decimals())) /
            (100 * 10 ** token.decimals())) / 1000;

        uint256 _amountFeeSeller = ((_value *
            (400 * 10 ** token.decimals())) /
            (100 * 10 ** token.decimals())) / 1000;

        uint256 _amountFeeBuyer2 = ((_value2 * (500 * 10 ** token.decimals())) /
            (100 * 10 ** token.decimals())) / 1000;

        uint256 _amountFeeSeller2 = ((_value2 *
            (400 * 10 ** token.decimals())) /
            (100 * 10 ** token.decimals())) / 1000;
        uint256 totalFees =  _amountFeeBuyer + _amountFeeBuyer2 + _amountFeeSeller + _amountFeeSeller2;
  
        moneybank.createEscrowNativeCoin{value: _value + _amountFeeBuyer}( _value, 300, IERC20(address(token)));
        moneybank.createEscrowNativeCoin{value: _value2 + _amountFeeBuyer2}(_value2, 300, IERC20(address(token)));

        assertEq(alice.balance, (aliceBalance - _value - _value2 - _amountFeeBuyer - _amountFeeBuyer2));
        assertEq(bob.balance, 0);

        // moneybank.releaseEscrowNativeCoin(0);
        // moneybank.releaseEscrowNativeCoin(1);

        assertEq(moneybank.feesAvailableNativeCoin(), totalFees);

        moneybank.withdrawEtherFees();
        assertEq(alice.balance, aliceBalance - _value - _value2 - _amountFeeBuyer - _amountFeeBuyer2 + totalFees);
        assertEq(bob.balance, _value + _value2 - _amountFeeSeller - _amountFeeSeller2);
    }

////////////////////////////////////TEST FAIL WITHDRAW FEES NATIVE COIN////////////////////////////////// 
    function testWithdrawFeesNativeCoinFail() public { 
        vm.expectRevert("Ownable: caller is not the owner");
        moneybank.withdrawEtherFees();
        vm.stopPrank();
        moneybank.transferOwnership(alice);
        vm.startPrank(alice);
        assertEq(moneybank.feesAvailableNativeCoin(), 0);
            vm.expectRevert(abi.encodeWithSignature("NoFeesToWithdraw()"));
        moneybank.withdrawEtherFees();
        assertEq(moneybank.feesAvailableNativeCoin(), 0);
    }


////////////////////////////////////TEST VERSION////////////////////////////////// 
    function TestVersion() public {
        string memory version = moneybank.version();
        assertEq(version, '0.0.3');
        assertEq(moneybank.version(), '0.0.3');
    }

////////////////////////////////////TEST GETESCROW////////////////////////////////// 
    function testGetEscrow() public{
      token.approve(address(moneybank), 50);
        moneybank.createEscrowToken(50, 300, IERC20(address(token)));
        assertEq(token.balanceOf(alice), 49999999999999999999999950);

        Moneybank.Escrow memory escrowInfo  = moneybank.getEscrow(0);
        assertEq(escrowInfo.buyer, alice);
        assertEq(escrowInfo.seller, bob);
        assertEq(escrowInfo.value, 50);
        assertEq(escrowInfo.sellerfee, 0);
        assertEq(escrowInfo.buyerfee, 0);
        assertEq(escrowInfo.escrowNative, false);
        // assertEq(moneybank.getEscrow(0).status, false);
        // assertEq(escrowInfo.currency, IERC20(address(token)));

        // console.log(escrowInfo.buyer);
        // console.log(escrowInfo.seller);
        // console.log(escrowInfo.escrowNative);
    }
////////////////////////////////////TEST GETVALUE////////////////////////////////// 
    function testGetValue() public{
        assertEq(token.balanceOf(alice), 50000000000000000000000000);
        token.approve(address(moneybank), 50);
        moneybank.createEscrowToken(50, 300, IERC20(address(token)));
        assertEq(token.balanceOf(alice), 49999999999999999999999950);
        uint256 value = moneybank.getValue(0);
        assertEq(value, 50);
        assertEq(moneybank.getValue(0), 50);
    }
////////////////////////////////////TEST GETSTATE////////////////////////////////// 
    function testGetState() public{
        assertEq(token.balanceOf(alice), 50000000000000000000000000);
        token.approve(address(moneybank), 50);
        moneybank.createEscrowToken(50, 300, IERC20(address(token)));
        assertEq(token.balanceOf(alice), 49999999999999999999999950);
        Moneybank.EscrowStatus state = moneybank.getState(0);
        require(state == Moneybank.EscrowStatus.Funded, "Estado del escrow no es Funded");
    }
////////////////////////////////////TEST ISESCROWNATIVE////////////////////////////////// 
    function testIsEscrowNative() public{
        assertEq(token.balanceOf(alice), 50000000000000000000000000);
        token.approve(address(moneybank), 50);
        moneybank.createEscrowToken(50, 300, IERC20(address(token)));
        assertEq(token.balanceOf(alice), 49999999999999999999999950);
        bool typeEscrow = moneybank.isEscrowEther(0);
        assertEq(typeEscrow, false);
        assertEq(moneybank.isEscrowEther(0), false);
    }
////////////////////////////////////TEST SET FEESELLER////////////////////////////////// 
    function testSetFeeSeller() public{
        vm.expectRevert("Ownable: caller is not the owner");
        moneybank.setFeeSeller(500);
        vm.stopPrank();
        // vm.expectRevert(abi.encodeWithSignature("FeeCanBeFrom0to1Percent"));
        assertEq(moneybank.feeSeller(), 0);
        moneybank.setFeeSeller(500);
        assertEq(moneybank.feeSeller(), 500);
        // vm.expectRevert("The fee can be from 0% to 1%");
        // moneybank.setFeeSeller(400 - 500);
    }
////////////////////////////////////TEST SET FEEBUYER////////////////////////////////// 
    function testSetFeeBuyer() public{
        vm.expectRevert("Ownable: caller is not the owner");
        moneybank.setFeeBuyer(500);
        vm.stopPrank();
        assertEq(moneybank.feeBuyer(), 0);
        moneybank.setFeeBuyer(500);
        assertEq(moneybank.feeBuyer(), 500);
        // vm.expectRevert("The fee can be from 0% to 1%");
        // moneybank.setFeeBuyer(400 - 500);
    }
}

