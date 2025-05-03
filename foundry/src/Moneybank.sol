// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// import "../lib/forge-std/src/Test.sol";
// import "forge-std/Test.sol";
import {IERC20} from "./IERC20.sol";
import { Address } from "./Address.sol";
import { SafeERC20 } from "./SafeERC20.sol";
import { ReentrancyGuard } from "./ReentrancyGuard.sol";
import { Context } from "./Context.sol";
import { Ownable } from "./Ownable.sol";

/**
 * @title Moneybank
 * @dev A smart contract for managing escrow transactions between buyers and sellers.
 */
// contract Towerbank is ReentrancyGuard, Ownable, Test {
contract Moneybank is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    // 0.1 es 100 porque se multiplica por mil => 0.1 X 1000 = 100
    // Fee charged to the seller for each transaction (in basis points)
    uint256 public feeSeller;
    // Fee charged to the buyer for each transaction (in basis points)
    uint256 public feeBuyer;
    // Total fees available for withdrawal in native coin
    uint256 public feesAvailableNativeCoin;
    // Counter for order IDs
    uint256 public orderId;
    // Mapping of order ID to Escrow struct
    mapping(uint256 => Escrow) public escrows;
    // Mapping of whitelisted stablecoin addresses
    mapping(address => bool) public whitelistedStablesAddresses;
    // Mapping of token => summation of fees that can be withdrawn
    // mapping(IERC20 => uint) public feesAvailable;
    mapping(address => uint) public feesAvailable;
    IERC20 public token;

    event EscrowDeposit(uint256 indexed orderId, Escrow escrow);
    event EscrowComplete(uint256 indexed orderId, Escrow escrow);
    event EscrowDisputeResolved(uint256 indexed orderId);
    event EscrowCancelled(uint256 indexed orderId, Escrow escrow);
    event TokenFeesSuccessfullyWithdrawn(address indexed token);
    event EtherFeesSuccessfullyWithdrawn(bool indexed isSent);
    event TokenAddedToWhitelist(address indexed token);
    event TokenRemovedFromWhitelist(address indexed token);
    event BuyerFeeUpdated(
        uint256 indexed oldFeeBuyer,
        uint256 indexed newFeeBuyer
    );
    event SellerFeeUpdated(
        uint256 indexed oldFeeSeller,
        uint256 indexed newFeeSeller
    );
    
    error CantBeAddressZero();
    error SellerCantBeAddressZero();
    error BuyerCantBeAddressZero();
    error FeeCanBeFrom0to1Percent();
    error AddressIsNotWhitelisted();
    error ValueMustBeGreaterThan0();
    error SellerCantBeTheSameAsBuyer();
    error SellerApproveEscrowFirst();
    error BuyerApproveEscrowFirst();
    error YouAreNotOwnerOfThisOffer();
    error IncorretAmount();
    error EscrowIsNotFunded();
    error NoFeesToWithdraw();
    error InsufficientBalance();
    error HaveMoreThan100Tokens();
    error TransactionFailed();

    // Modifier to restrict access to only the buyer or seller of an escrow
    // Buyer defined as who buys usd
    // modifier onlyBuyer(uint256 _orderId) {
    //     require(
    //         msg.sender == escrows[_orderId].buyer,
    //         "Only Buyer can call this"
    //     );
    //     _;
    // }

    // Seller defined as who sells usd
    // modifier onlySeller(uint256 _orderId) {
    //     require(
    //         msg.sender == escrows[_orderId].seller,
    //         "Only Seller can call this"
    //     );
    //     _;
    // }

    // Enum defining the status of an escrow
    enum EscrowStatus {
        Unknown,
        Funded,
        NOT_USED,
        Completed,
        Refund,
        Arbitration,
        Cancelled
    }

    // Struct representing an escrow transaction
    struct Escrow {
        address buyer; //Comprador
        address seller; //Vendedor
        uint256 value; //Valor en venta en moneda 1
        uint256 cost; //Monto compra en moneda 2
        uint256 sellerfee; //Comision vendedor
        uint256 buyerfee; //Comision comprador
        bool escrowNative; //Tipo de Escrow, USDT (false, por defecto) o ETH(true)
        IERC20 currency; //Moneda
        EscrowStatus status; //Estado
    }

    constructor(address currency) {
        feeSeller = 0;
        feeBuyer = 0;
        whitelistedStablesAddresses[currency] = true;
        token = IERC20(currency);
    }
    // ================== Begin External functions ==================
    /**
     * @dev Creates a new escrow transaction with an ERC20 token.
     * This function allows users to initiate a new escrow transaction for an ERC20 token, specifying the amount of the transaction, the cost calculated based on the price per unit, and the currency itself.
     *
     * @param _value The total amount of the transaction, representing the sum of the item's price and the seller's fee.
     * @param _cost The calculated cost of the transaction, derived from multiplying the item's price by the quantity.
     * @param _currency The ERC20 token involved in the transaction.
     *
     * Requirements:
     * - The caller must be whitelisted to perform this operation.
     * - The `_seller` cannot be the same as the buyer.
     * - The `_seller` cannot be the zero address.
     * - `_value` must be greater than 0.
     * - The transaction value must be sufficient to cover the transaction amount plus the buyer's fee.
     *
     * Effects:
     * - Checks if the token is whitelisted and if the sender is authorized to perform the transaction.
     * - Calculates the seller's fee based on the transaction value and the predefined fee rate.
     * - Initializes a new escrow record with the provided details.
     * - Transfers the specified amount of tokens from the buyer to the contract, including the seller's fee.
     *
     * Events:
     * - Emits an `EscrowDeposit` event upon successful creation of the escrow.
     */
    function createEscrowToken(
        uint256 _value,
        uint256 _cost,
        IERC20 _currency,
        uint256 nonce,
        bytes memory signature
    ) external virtual {
        bytes32 messageHash = keccak256(abi.encodePacked(_value, _cost, _currency, nonce));
        checkHashMessage(messageHash, signature);
        ///////////////////////CHECKS///////////////////////
        _sellerValidation(_value, _cost, _currency);
        ///////////////////////EFETCS///////////////////////
        uint8 _decimals = _currency.decimals();

        //Obtiene el monto a transferir desde el comprador al contrato
        uint256 _amountFeeSeller = ((_value * (feeSeller * 10 ** _decimals)) /
            (100 * 10 ** _decimals)) / 1000;
        if (
            _value + _amountFeeSeller >
            _currency.allowance(msg.sender, address(this))
        ) {
            // if(_allowance < _currency.allowance(msg.sender, address(this))){
            revert SellerApproveEscrowFirst();
        }
        orderId++;
        escrows[orderId] = Escrow(
            payable(address(0)), // Futuro comprador, buyer
            payable(msg.sender), //creador del escrow, seller
            _value,
            _cost,
            _amountFeeSeller,
            feeBuyer,
            false,
            _currency,
            EscrowStatus.Funded
        );
        ///////////////////////INTERACTIONS///////////////////////
        //Transferir USDT al contracto
        _currency.safeTransferFrom(
            msg.sender,
            address(this),
            (_value + _amountFeeSeller)
        );
        emit EscrowDeposit(orderId, escrows[orderId]);
    }

    /**
     * @dev Creates a new escrow transaction with native coin.
     * This function allows a seller to deposit funds into an escrow contract,
     * setting up a transaction with a specified value and cost. It also calculates
     * and sets the fees for both the seller and the buyer based on predefined rates.
     *
     * @param _value The total amount of the transaction, including the seller's fee.
     * @param _cost The amount of native coins (e.g., ETH) required to initiate the transaction.
     * @param _currency The ERC20 token currency involved in the transaction.
     * return orderId The unique identifier assigned to this new escrow transaction.
     *
     * Requirements:
     * - `seller` cannot be the same as the buyer.
     * - `seller` cannot be the zero address.
     * - `_value` must be greater than 0.
     * - The transaction value must be sufficient to cover the transaction amount plus buyer fee.
     * - The currency passed must be whitelisted in the contract.
     *
     * Events emitted:
     * - `EscrowDeposit`: Indicates that a new escrow transaction has been successfully created.
     */
    /**
     * @dev Creates a new escrow transaction with native coin.
     * This function allows a seller to deposit funds into an escrow contract,
     * setting up a transaction with a specified value and cost. It also calculates
     * and sets the fees for both the seller and the buyer based on predefined rates.
     *
     * @param _value The total amount of the transaction, including the seller's fee.
     * @param _cost The amount of native coins (e.g., ETH) required to initiate the transaction.
     * @param _currency The ERC20 token currency involved in the transaction.
     * return orderId The unique identifier assigned to this new escrow transaction.
     *
     * Requirements:
     * - `seller` cannot be the same as the buyer.
     * - `seller` cannot be the zero address.
     * - `_value` must be greater than 0.
     * - The transaction value must be sufficient to cover the transaction amount plus buyer fee.
     * - The currency passed must be whitelisted in the contract.
     *
     * Events emitted:
     * - `EscrowDeposit`: Indicates that a new escrow transaction has been successfully created.
     */
    function createEscrowNativeCoin(
        uint256 _value,
        uint256 _cost,
        IERC20 _currency,
        uint256 nonce,
        bytes memory signature
    ) external payable virtual {
        bytes32 messageHash = keccak256(abi.encodePacked(_value, _cost, _currency, nonce));
        checkHashMessage(messageHash, signature);
        ///////////////////////CHECKS///////////////////////
        _sellerValidation(_value, _cost, _currency);
        ///////////////////////EEFETCS///////////////////////
        //Obtiene el monto a transferir desde el comprador al contrato
        uint256 _amountFeeSeller = ((_value * (feeSeller * 10 ** 18)) /
            (100 * 10 ** 18)) / 1000;
        if (msg.value < _value + _amountFeeSeller) {
            revert IncorretAmount();
        }
        orderId++;
        escrows[orderId] = Escrow(
            payable(address(0)), //Futuro comprador, buyer
            payable(msg.sender), //Creador del escrow, seller
            _value,
            _cost,
            _amountFeeSeller,
            feeBuyer,
            true,
            IERC20(_currency),
            EscrowStatus.Funded
        );
        emit EscrowDeposit(orderId, escrows[orderId]);
    }

    /**
     * @dev Accepts an existing escrow transaction.
     * This function allows a buyer to finalize an escrowed transaction, transferring
     * either native coins (ETH) or ERC20 tokens from the escrow to the seller, and
     * then transferring the agreed-upon amount to the buyer minus any applicable fees.
     *
     * @param _orderId The unique identifier of the escrow transaction to be accepted.
     *
     * Requirements:
     * - The escrow must be funded and not yet completed.
     * - The caller must not be the seller of the escrow.
     * - The escrow must not have already been accepted.
     * - If the escrow involves ERC20 tokens, the buyer must have approved the contract
     *   to spend the necessary amount on their behalf.
     *
     * Effects:
     * - Updates the status of the escrow to Completed.
     * - Transfers the agreed-upon amount from the buyer to the seller, handling both
     *   native coins and ERC20 tokens according to the type of escrow.
     * - Deducts and transfers the buyer's fee from the escrow amount to the contract.
     * - Emits an EscrowComplete event to indicate the completion of the escrow transaction.
     *
     * Interactions:
     * - Calls `safeTransferFrom` on the ERC20 token contract if the escrow involves tokens.
     * - Performs a native coin transfer using low-level calls if the escrow involves ETH.
     *
     * Note: The buyer must approve the contract to spend the necessary amount of tokens
     * on their behalf before calling this function if the escrow involves ERC20 tokens.
     */
    function acceptEscrow(
        uint256 _orderId,
        uint256 nonce,
        bytes memory signature
    ) external payable nonReentrant {
        bytes32 messageHash = keccak256(abi.encodePacked(_orderId, nonce));
        checkHashMessage(messageHash, signature);

        Escrow storage escrow = escrows[_orderId];
        //////////////////////////////////CHECKS///////////////////////////////
        if (escrow.status != EscrowStatus.Funded) {
            revert EscrowIsNotFunded();
        }
        if (escrow.seller == msg.sender) {
            revert SellerCantBeTheSameAsBuyer();
        }
        if (msg.sender == address(0)) {
            revert SellerCantBeAddressZero();
        }
        //////////////////////////////////EFFECTS///////////////////////////////
        uint256 amountFeeBuyer = (escrow.value * feeBuyer) / 10000;

        //NECESARIO  HACER UN APPROVE EN EL MOMENTO EN QUE EL USER ACEPTE LA OFERTA EN EL FRONT
        // Transfer to buyer
        escrow.buyerfee = amountFeeBuyer;
        escrow.buyer = payable(msg.sender);

        //////////////////////////////////INTERACTIONS///////////////////////////////
        //////////////////////////////////INTERACTIONS///////////////////////////////
        if (escrow.escrowNative) {
            if (
                escrow.cost >
                escrow.currency.allowance(msg.sender, address(this))
            ) {
                revert BuyerApproveEscrowFirst();
            }
            feesAvailableNativeCoin += amountFeeBuyer + escrow.sellerfee;
            // Transfer tokens from buyer to seller
            escrow.currency.safeTransferFrom(
                msg.sender,
                escrow.seller,
                escrow.cost
            );
            // Transfer tokens from contract to buyer
            (bool buyerSent, ) = payable(msg.sender).call{
                value: escrow.value - amountFeeBuyer
            }("");
            // require(buyerSent, "Transfer to buyer failed");
            if(!buyerSent){
                revert TransactionFailed();
            }

            // Refund excess value
            // if (msg.value > escrow.value + amountFeeBuyer) {
            //     (sent, ) = msg.sender.call{value: msg.value - (escrow.value + amountFeeBuyer)}("");
            //     require(sent, "Refund failed");
            // }
        } else {
            feesAvailable[address(escrow.currency)] += amountFeeBuyer + escrow.sellerfee;
            if(msg.value < escrow.cost){
                revert IncorretAmount();
            }
            // Transfer ETH from buyer to seller
            (bool sellerSent, ) = escrow.seller.call{value: escrow.cost}("");
            if(!sellerSent){
                revert TransactionFailed();
            }
            // Transfer tokens from contract to buyer
            escrow.currency.safeTransfer(
                msg.sender,
                escrow.value - amountFeeBuyer
            );
            escrow.currency.safeTransfer(
                msg.sender,
                escrow.value - amountFeeBuyer
            );
        }
        escrow.status = EscrowStatus.Completed;
        escrow.buyer = payable(msg.sender);
        emit EscrowComplete(_orderId, escrow);
        delete escrows[_orderId];
}
    /**
     * @dev Cancels an escrow transaction.
     * This function allows the seller to cancel an escrow transaction if it is in the Funded status.
     * The function handles both native coin (ETH) and ERC20 token transfers based on the escrow's configuration.
     *
     * @param _orderId The unique identifier of the escrow transaction to be cancelled.
     *
     * Requirements:
     * - The escrow must be in the Funded status.
     * - The caller must be the seller of the escrow.
     *
     * Effects:
     * - Updates the status of the escrow to Cancelled.
     *
     * Interactions:
     * - If the escrow involves ERC20 tokens, it transfers the tokens from the escrow back to the seller using `safeTransfer`.
     * - If the escrow involves native coins (ETH), it transfers the ETH back to the seller using a low-level call.
     *
     * Emits:
     * - `EscrowCancelled` event with the `_orderId` and the escrow details.
     *
     * Note: The escrow must be funded and not completed to call this function. The seller can only cancel if they are the owner of the escrow.
     */
    function cancelEscrow(
        uint256 _orderId,
        uint256 nonce,
        bytes memory signature
    ) external nonReentrant {
        bytes32 messageHash = keccak256(abi.encodePacked(_orderId, nonce));
        checkHashMessage(messageHash, signature);

        Escrow storage escrow = escrows[_orderId];
        //////////////////////////////////CHECKS///////////////////////////////
        if (escrow.status != EscrowStatus.Funded) {
            revert EscrowIsNotFunded();
        }
        if (escrow.seller != msg.sender) {
        if (escrow.seller != msg.sender) {
            revert YouAreNotOwnerOfThisOffer();
        }
        ////////////////////////////////EFFECTS////////////////////////////////
        ////////////////////////////////EFFECTS////////////////////////////////
        escrow.status = EscrowStatus.Cancelled;

        ///////////////////////////////INTERACTIONS////////////////////////////
        if (!escrow.escrowNative) {
            escrow.currency.safeTransfer(escrow.seller, escrow.value);
        } else {
            (bool sellerSent, ) = payable(msg.sender).call{value: escrow.value}(
                ""
            );
            if(!sellerSent){
                revert TransactionFailed();
            }
        }
        emit EscrowCancelled(_orderId, escrow);
     }
    }
    /**
     * @dev Refunds the buyer in case of a cancelled contract.
     * @param _orderId The ID of the escrow.
     * Requirements:
     * - The caller must be the contract owner.
     */
    function refundBuyer(
        uint256 _orderId,
        uint256 nonce,
        bytes memory signature
    ) external nonReentrant onlyOwner {
        bytes32 messageHash = keccak256(abi.encodePacked(_orderId, nonce));
        checkHashMessage(messageHash, signature);
        // require(escrows[_orderId].status == EscrowStatus.Refund,"Refund not approved");

        if (escrows[_orderId].status != EscrowStatus.Funded) {
        if (escrows[_orderId].status != EscrowStatus.Funded) {
            revert EscrowIsNotFunded();
        }
        uint256 _value = escrows[_orderId].value;
        address _buyer = escrows[_orderId].buyer;
        IERC20 _currency = escrows[_orderId].currency;

        // dont charge seller any fees - because its a refund
        delete escrows[_orderId];
        _currency.safeTransfer(_buyer, _value);
        emit EscrowDisputeResolved(_orderId);
    }
    }
    /**
     * @dev Refunds the buyer in native coin in case of a cancelled contract.
     * @param _orderId The ID of the escrow.
     * Requirements:
     * - The caller must be the contract owner.
     */
    function refundBuyerNativeCoin(
        uint256 _orderId,
        uint256 nonce,
        bytes memory signature
    ) external nonReentrant onlyOwner {
        bytes32 messageHash = keccak256(abi.encodePacked(_orderId, nonce));
        checkHashMessage(messageHash, signature);
        if (escrows[_orderId].status != EscrowStatus.Funded) {
            revert EscrowIsNotFunded();
        }
        uint256 _value = escrows[_orderId].value;
        address _buyer = escrows[_orderId].buyer;
        
        // dont charge seller any fees - because its a refund
        delete escrows[_orderId];
        //Transfer call
        (bool sent, ) = payable(address(_buyer)).call{value: _value}("");
        if(!sent){
            revert TransactionFailed();
        }
        emit EscrowDisputeResolved(_orderId);
    }

    /**
     * @dev Sets the fee charged to the seller for each transaction.
     * @param _newFeeSeller The fee percentage (in basis points).
     * Requirements:
     * - `_feeSeller` must be between 0 and 1% (inclusive).
     */
    function setFeeSeller(uint256 _newFeeSeller, uint256 nonce, bytes memory signature) public onlyOwner {
        bytes32 messageHash = keccak256(abi.encodePacked(_newFeeSeller, nonce));
        checkHashMessage(messageHash, signature);
        
        _feeValidation(_newFeeSeller);
        uint256 oldFeeSeller = feeSeller;
        feeSeller = _newFeeSeller;
        emit SellerFeeUpdated(oldFeeSeller, _newFeeSeller);
    }

    /**
     * @dev Sets the fee charged to the buyer for each transaction.
     * @param _newFeeBuyer The fee percentage (in basis points).
     * Requirements:
     * - `_newFeeBuyer` must be between 0 and 1% (inclusive).
     */
    function setFeeBuyer(uint256 _newFeeBuyer, uint256 nonce, bytes memory signature) public onlyOwner {
        bytes32 messageHash = keccak256(abi.encodePacked(_newFeeBuyer, nonce));
        checkHashMessage(messageHash, signature);

        _feeValidation(_newFeeBuyer);
        uint256 oldFeeBuyer = feeBuyer;
        feeBuyer = _newFeeBuyer;
        emit BuyerFeeUpdated(oldFeeBuyer, _newFeeBuyer);
    }
    

    /**
     * @dev Withdraws fees accumulated in a specific currency by the contract owner.
     * @param _currency The currency token.
     * Requirements:
     * - The caller must be the contract owner.
     */
    function withdrawTokenFees(IERC20 _currency, uint256 nonce, bytes memory signature) external onlyOwner {
       bytes32 messageHash = keccak256(abi.encodePacked(_currency, nonce));
        checkHashMessage(messageHash, signature);
 
        uint256 _amount = feesAvailable[address(_currency)];
        if (feesAvailable[address(_currency)] <= 0) {
            revert NoFeesToWithdraw();
        }
        feesAvailable[address(_currency)] -= _amount;
        _currency.safeTransfer(owner(), _amount);
        emit TokenFeesSuccessfullyWithdrawn(address(_currency));
    }

    /**
     * @dev Withdraws fees accumulated in native coin by the contract owner.
     * Requirements:
     * - The caller must be the contract owner.
     */
    function withdrawEtherFees() external onlyOwner {
        uint256 _amount = feesAvailableNativeCoin;
        if (_amount <= 0) {
            revert NoFeesToWithdraw();
        }
        feesAvailableNativeCoin -= _amount;
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        if(!sent){
            revert TransactionFailed();
        }
        emit EtherFeesSuccessfullyWithdrawn(sent);
    }

    // ================== End External functions ==================

    // ================== Begin External functions that are pure ==================

    /**
     * @dev Returns the version of the contract.
     */
    function version() external pure virtual returns (string memory) {
        return "0.0.3";
    }

    // ================== End External functions that are pure ==================

    /// ================== Begin Public functions ==================


    /**
     * @dev Retrieves the escrow details based on the provided escrow ID.
     * @param escrowId The ID of the escrow.
     * @return Escrow The details of the escrow.
     */
    function getEscrow(uint256 escrowId) public view returns (Escrow memory) {
        return escrows[escrowId];
    }


    /**
     * @dev Retrieves the status of an escrow based on the provided order ID.
     * @param _orderId The ID of the order.
     * @return EscrowStatus The status of the escrow.
     */
    function getState(uint256 _orderId) public view returns (EscrowStatus) {
        Escrow memory _escrow = escrows[_orderId];
        return _escrow.status;
    }

    /**
     * @dev Retrieves the value of an escrow based on the provided order ID.
     * @param _orderId The ID of the order.
     * @return uint256 The value of the escrow.
     */
    function getValue(uint256 _orderId) public view returns (uint256) {
        Escrow memory _escrow = escrows[_orderId];
        return _escrow.value;
    }

    /**
     * @dev Retrieves the token balance of a user.
     * @param _user The address of the user.
     * @return uint256 The token balance of the user.
     */
    function getTokenBalance(address _user) public view returns (uint256) {
        return token.balanceOf(_user);
    }

    /**
     * @dev Retrieves the type of an escrow based on the provided order ID. Can be native, ETH or with token
     * @param _orderId The ID of the order.
     * @return bool The type of the escrow. True for native.
     */
    function isEscrowEther(uint256 _orderId) public view returns (bool) {
        Escrow memory _escrow = escrows[_orderId];
        return _escrow.escrowNative;
    }

    /**
     * @dev Add the address of the token to the whitelist.
     * @param _token The address of the token to add to the whitelist.
     * Requirements:
     * - `_token` cannot be the zero address.
     */
    function addTokenToWhitelist(address _token, uint256 nonce, bytes memory signature ) public onlyOwner {
        bytes32 messageHash = keccak256(abi.encodePacked(_token, nonce));
        checkHashMessage(messageHash, signature);

        if (_token == address(0)) {
            revert CantBeAddressZero();
        }
        whitelistedStablesAddresses[_token] = true;
        emit TokenAddedToWhitelist(_token);
    }

    /**
     * @dev Remove the address of the token from the whitelist.
     * @param _token The address of the token to remove from the whitelist.
     * Requirements:
     * - `_token` cannot be the zero address.
     */
    function deleteTokenFromWhitelist(address _token, uint256 nonce, bytes memory signature) public onlyOwner {
        bytes32 messageHash = keccak256(abi.encodePacked(_token, nonce));
        checkHashMessage(messageHash, signature);
        
        if (_token == address(0)) {
            revert CantBeAddressZero();
        }
        whitelistedStablesAddresses[_token] = false;
        emit TokenRemovedFromWhitelist(_token);
    }

    /**
     * @dev Transfers tokens to a user.
     * @param _user The address of the user to transfer tokens to.
     * @param _amount The amount of tokens to transfer.
     *requirements:
     * - `_user` cannot be the zero address.
     * - `The contract must have at least `_amount` tokens.
     * - `_user` must have less than 100 tokens.
     */
    function fundUser(
        address _user,
        uint256 _amount,
        uint256 nonce,
        bytes memory signature
        ) public onlyOwner {
        bytes32 messageHash = keccak256(abi.encodePacked(_user, _amount, nonce));
        checkHashMessage(messageHash, signature);

        if (_user == address(0)) {
            revert CantBeAddressZero();
        }
        if (token.balanceOf(address(this)) < _amount) {
            revert InsufficientBalance();
        }
        if (token.balanceOf(_user) > 100) {
            revert HaveMoreThan100Tokens();
        }
        token.transfer(_user, _amount);
    }

    /// ================== End Public functions ==================

    /// ================== Begin Private functions ==================
        /**
     * @dev Verifies the signature of a message.
     * @param messageHash The hash of the message to verify.
     * @param signature The signature of the message.
     * @return The address that signed the message. 
     */
    function checkHashMessage(bytes32 messageHash, bytes memory signature) pure internal  returns (address) {
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        bytes32 r;
        uint8 v;
        bytes20 r20; 
            
        assembly {
            r := mload(add(signature, 32))
            v := and(mload(add(signature, 64)), 255)
        }       
        r20 = bytes20(r);      
        return ecrecover(ethSignedMessageHash, v, r20, 0); // Usamos 0 como s porque no lo usamos
    }
    //OPCION 2a
    // function recoverSigner(bytes32 message, bytes memory signature) internal pure returns (address) {
    //     bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message));
    //     (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);
    //     return ecrecover(ethSignedMessageHash, v, r, s);
    // }
    //OPCION 2b
    // function recoverSigner(
    //     bytes32 messageHash,
    //     bytes memory signature
    // ) public pure returns (address) {
    //     (uint8 v, bytes32 r, bytes32 s) = SplitSignature.splitSignature(
    //         signature
    //     ); // Llamada explícita
    //     return ecrecover(message, v, r, s);
    // }
    //Apoyo A OPCION 2a ó OPCION 2b
    // function splitSignature(
    //     bytes memory sig
    // ) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
    //     require(sig.length == 65, "Invalid signature length");

    //     assembly {
    //         r := mload(add(sig, 32))
    //         s := mload(add(sig, 64))
    //         v := byte(0, mload(add(sig, 96)))
    //     }

    //      if (v < 27) {
    //         v += 27;
    //     }

    //     return (v, r, s);
    // }

    /**
     * @dev Calculates the fee based on the provided amount and fee.
     * @param _amount The amount to calculate the fee for.
     * @param _fee The fee to calculate.
     * @return uint256 The calculated fee.
     */
    function _calculateAmountFee(
        uint256 _amount,
        uint256 _fee
    ) private pure returns (uint256) {
        return _amount * _fee;
    }

    /**
     * @dev Checks if the fee is valid.
     * @param _newFee The new fee to validate.
     * Requirements:
     * - `_newFee` must be between 0 and 1% (inclusive).
     */
    function _feeValidation(uint256 _newFee) private pure {
        if (_newFee > 0) {
            revert FeeCanBeFrom0to1Percent();
        }
    }

    /**
     * @dev Checks if the seller is valid.
     * @param _amountToSell The amount to sell.
     * @param _price The price to sell.
     * @param _token The token to sell.
     */
    function _sellerValidation(
        uint256 _amountToSell,
        uint256 _price,
        IERC20 _token
    ) private view {
        if (!whitelistedStablesAddresses[address(_token)]) {
            revert AddressIsNotWhitelisted();
        }
        if (msg.sender == address(0)) {
            revert SellerCantBeAddressZero();
        }
        if (_amountToSell <= 0 || _price <= 0) {
            revert ValueMustBeGreaterThan0();
        }
    }
    /**
     * @notice Fallback function to receive Ether without data.
     * @dev This function is executed when the contract receives Ether without accompanying data.
     * The received Ether is added to the contract's balance.
     */
    receive() external payable {
    }

    /**
     * @dev Fallback function executed when no other function matches the provided function signature,
     * or when no data is provided with the transaction.
     * @notice This function allows the contract to receive Ether and does not contain specific logic.
     * @notice Ether sent with this transaction is added to the contract's balance.
     */
    fallback() external payable {
    }

    // /**
    // * @dev Releases the escrowed funds to the seller.
    // * @param _orderId The ID of the order.
    // * Requirements:
    // * - The status of the escrow must be 'Funded'.
    // * - The transfer of funds must be successful.
    // */
    // function _releaseEscrow(uint256 _orderId) private nonReentrant {
    //     // require(
    //     //     escrows[_orderId].status == EscrowStatus.Funded,
    //     //     "USDT has not been deposited"
    //     // );
    //     if( escrows[_orderId].status != EscrowStatus.Funded){
    //         revert EscrowIsNotFunded();
    //     }

    //     uint8 _decimals = escrows[_orderId].currency.decimals();

    //     //Obtiene el monto a transferir desde el comprador al contrato //sellerfee //buyerfee
    //     uint256 _amountFeeBuyer = ((escrows[_orderId].value *
    //         (escrows[_orderId].buyerfee * 10 ** _decimals)) /
    //         (100 * 10 ** _decimals)) / 1000;
    //     uint256 _amountFeeSeller = ((escrows[_orderId].value *
    //         (escrows[_orderId].sellerfee * 10 ** _decimals)) /
    //         (100 * 10 ** _decimals)) / 1000;

    //     //feesAvailable += _amountFeeBuyer + _amountFeeSeller;
    //     feesAvailable[escrows[_orderId].currency] +=
    //         _amountFeeBuyer +
    //         _amountFeeSeller;

    //     // write as complete, in case transfer fails
    //     escrows[_orderId].status = EscrowStatus.Completed;

    //     //Transfer to sellet Price Asset - FeeSeller
    //     escrows[_orderId].currency.safeTransfer(
    //         escrows[_orderId].seller,
    //         escrows[_orderId].value - _amountFeeSeller
    //     );

    //     emit EscrowComplete(_orderId, escrows[_orderId]);
    //     delete escrows[_orderId];
    // }

    // /**
    // * @dev Releases the escrowed native coin funds to the seller.
    // * @param _orderId The ID of the order.
    // * Requirements:
    // * - The status of the escrow must be 'Funded'.
    // * - The transfer of funds must be successful.
    // */
    // function _releaseEscrowNativeCoin(uint256 _orderId) private nonReentrant {
    //     // require(
    //     //     escrows[_orderId].status == EscrowStatus.Funded,
    //     //     "THX has not been deposited"
    //     // );

    //     if( escrows[_orderId].status != EscrowStatus.Funded){
    //         revert EscrowIsNotFunded();
    //     }

    //     uint8 _decimals = 6; //Wei

    //     //Obtiene el monto a transferir desde el comprador al contrato //sellerfee //buyerfee
    //     uint256 _amountFeeBuyer = ((escrows[_orderId].value *
    //         (escrows[_orderId].buyerfee * 10 ** _decimals)) /
    //         (100 * 10 ** _decimals)) / 1000;
    //     uint256 _amountFeeSeller = ((escrows[_orderId].value *
    //         (escrows[_orderId].sellerfee * 10 ** _decimals)) /
    //         (100 * 10 ** _decimals)) / 1000;

    //     //Registra los fees obtenidos para Towerbank
    //     feesAvailableNativeCoin += _amountFeeBuyer + _amountFeeSeller;

    //     // write as complete, in case transfer fails
    //     escrows[_orderId].status = EscrowStatus.Completed;

    //     //Transfer to sellet Price Asset - FeeSeller
    //     (bool sent, ) = escrows[_orderId].seller.call{
    //         value: escrows[_orderId].value - _amountFeeSeller
    //     }("");
    //     require(sent, "Transfer failed.");

    //     emit EscrowComplete(_orderId, escrows[_orderId]);
    //     delete escrows[_orderId];
    // }
    // ================== End Private functions ==================
}