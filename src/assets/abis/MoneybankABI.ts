export const MoneybankABI = [
	{
		"type": "constructor",
		"inputs": [
			{
				"name": "currency",
				"type": "address",
				"internalType": "address"
			}
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "acceptEscrow",
		"inputs": [
			{
				"name": "_orderId",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "nonce",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "signature",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "payable"
	},
	{
		"type": "function",
		"name": "addTokenToWhitelist",
		"inputs": [
			{
				"name": "_token",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "nonce",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "signature",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "cancelEscrow",
		"inputs": [
			{
				"name": "_orderId",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "nonce",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "signature",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "createEscrowNativeCoin",
		"inputs": [
			{
				"name": "_value",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "_cost",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "_currency",
				"type": "address",
				"internalType": "contract IERC20"
			},
			{
				"name": "nonce",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "signature",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "payable"
	},
	{
		"type": "function",
		"name": "createEscrowToken",
		"inputs": [
			{
				"name": "_value",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "_cost",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "_currency",
				"type": "address",
				"internalType": "contract IERC20"
			},
			{
				"name": "nonce",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "signature",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "deleteTokenFromWhitelist",
		"inputs": [
			{
				"name": "_token",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "nonce",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "signature",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "escrows",
		"inputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "buyer",
				"type": "address",
				"internalType": "address payable"
			},
			{
				"name": "seller",
				"type": "address",
				"internalType": "address payable"
			},
			{
				"name": "value",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "cost",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "sellerfee",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "buyerfee",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "escrowNative",
				"type": "bool",
				"internalType": "bool"
			},
			{
				"name": "currency",
				"type": "address",
				"internalType": "contract IERC20"
			},
			{
				"name": "status",
				"type": "uint8",
				"internalType": "enum Moneybank.EscrowStatus"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "feeBuyer",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "feeSeller",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "feesAvailable",
		"inputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "contract IERC20"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "feesAvailableNativeCoin",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "fundUser",
		"inputs": [
			{
				"name": "_user",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "_amount",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "nonce",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "signature",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "getEscrow",
		"inputs": [
			{
				"name": "escrowId",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "tuple",
				"internalType": "struct Moneybank.Escrow",
				"components": [
					{
						"name": "buyer",
						"type": "address",
						"internalType": "address payable"
					},
					{
						"name": "seller",
						"type": "address",
						"internalType": "address payable"
					},
					{
						"name": "value",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "cost",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "sellerfee",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "buyerfee",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "escrowNative",
						"type": "bool",
						"internalType": "bool"
					},
					{
						"name": "currency",
						"type": "address",
						"internalType": "contract IERC20"
					},
					{
						"name": "status",
						"type": "uint8",
						"internalType": "enum Moneybank.EscrowStatus"
					}
				]
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getState",
		"inputs": [
			{
				"name": "_orderId",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "uint8",
				"internalType": "enum Moneybank.EscrowStatus"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getTokenBalance",
		"inputs": [
			{
				"name": "_user",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getValue",
		"inputs": [
			{
				"name": "_orderId",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "isEscrowEther",
		"inputs": [
			{
				"name": "_orderId",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "bool",
				"internalType": "bool"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "orderId",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "owner",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "address"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "refundBuyer",
		"inputs": [
			{
				"name": "_orderId",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "nonce",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "signature",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "refundBuyerNativeCoin",
		"inputs": [
			{
				"name": "_orderId",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "nonce",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "signature",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "renounceOwnership",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "setFeeBuyer",
		"inputs": [
			{
				"name": "_newFeeBuyer",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "nonce",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "signature",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "setFeeSeller",
		"inputs": [
			{
				"name": "_newFeeSeller",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "nonce",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "signature",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "token",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "contract IERC20"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "transferOwnership",
		"inputs": [
			{
				"name": "newOwner",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "version",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "string",
				"internalType": "string"
			}
		],
		"stateMutability": "pure"
	},
	{
		"type": "function",
		"name": "whitelistedStablesAddresses",
		"inputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "bool",
				"internalType": "bool"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "withdrawEtherFees",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "withdrawTokenFees",
		"inputs": [
			{
				"name": "_currency",
				"type": "address",
				"internalType": "contract IERC20"
			},
			{
				"name": "nonce",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "signature",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "event",
		"name": "BuyerFeeUpdated",
		"inputs": [
			{
				"name": "oldFeeBuyer",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "newFeeBuyer",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "EscrowCancelled",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "escrow",
				"type": "tuple",
				"indexed": false,
				"internalType": "struct Moneybank.Escrow",
				"components": [
					{
						"name": "buyer",
						"type": "address",
						"internalType": "address payable"
					},
					{
						"name": "seller",
						"type": "address",
						"internalType": "address payable"
					},
					{
						"name": "value",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "cost",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "sellerfee",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "buyerfee",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "escrowNative",
						"type": "bool",
						"internalType": "bool"
					},
					{
						"name": "currency",
						"type": "address",
						"internalType": "contract IERC20"
					},
					{
						"name": "status",
						"type": "uint8",
						"internalType": "enum Moneybank.EscrowStatus"
					}
				]
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "EscrowComplete",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "escrow",
				"type": "tuple",
				"indexed": false,
				"internalType": "struct Moneybank.Escrow",
				"components": [
					{
						"name": "buyer",
						"type": "address",
						"internalType": "address payable"
					},
					{
						"name": "seller",
						"type": "address",
						"internalType": "address payable"
					},
					{
						"name": "value",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "cost",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "sellerfee",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "buyerfee",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "escrowNative",
						"type": "bool",
						"internalType": "bool"
					},
					{
						"name": "currency",
						"type": "address",
						"internalType": "contract IERC20"
					},
					{
						"name": "status",
						"type": "uint8",
						"internalType": "enum Moneybank.EscrowStatus"
					}
				]
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "EscrowDeposit",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "escrow",
				"type": "tuple",
				"indexed": false,
				"internalType": "struct Moneybank.Escrow",
				"components": [
					{
						"name": "buyer",
						"type": "address",
						"internalType": "address payable"
					},
					{
						"name": "seller",
						"type": "address",
						"internalType": "address payable"
					},
					{
						"name": "value",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "cost",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "sellerfee",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "buyerfee",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "escrowNative",
						"type": "bool",
						"internalType": "bool"
					},
					{
						"name": "currency",
						"type": "address",
						"internalType": "contract IERC20"
					},
					{
						"name": "status",
						"type": "uint8",
						"internalType": "enum Moneybank.EscrowStatus"
					}
				]
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "EscrowDisputeResolved",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "EtherFeesSuccessfullyWithdrawn",
		"inputs": [
			{
				"name": "isSent",
				"type": "bool",
				"indexed": true,
				"internalType": "bool"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "OwnershipTransferred",
		"inputs": [
			{
				"name": "previousOwner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "newOwner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "SellerFeeUpdated",
		"inputs": [
			{
				"name": "oldFeeSeller",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "newFeeSeller",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "TokenAddedToWhitelist",
		"inputs": [
			{
				"name": "token",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "TokenFeesSuccessfullyWithdrawn",
		"inputs": [
			{
				"name": "token",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "TokenRemovedFromWhitelist",
		"inputs": [
			{
				"name": "token",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "error",
		"name": "AddressIsNotWhitelisted",
		"inputs": []
	},
	{
		"type": "error",
		"name": "BuyerApproveEscrowFirst",
		"inputs": []
	},
	{
		"type": "error",
		"name": "BuyerCantBeAddressZero",
		"inputs": []
	},
	{
		"type": "error",
		"name": "CantBeAddressZero",
		"inputs": []
	},
	{
		"type": "error",
		"name": "EscrowIsNotFunded",
		"inputs": []
	},
	{
		"type": "error",
		"name": "FeeCanBeFrom0to1Percent",
		"inputs": []
	},
	{
		"type": "error",
		"name": "HaveMoreThan100Tokens",
		"inputs": []
	},
	{
		"type": "error",
		"name": "IncorretAmount",
		"inputs": []
	},
	{
		"type": "error",
		"name": "InsufficientBalance",
		"inputs": []
	},
	{
		"type": "error",
		"name": "NoFeesToWithdraw",
		"inputs": []
	},
	{
		"type": "error",
		"name": "SellerApproveEscrowFirst",
		"inputs": []
	},
	{
		"type": "error",
		"name": "SellerCantBeAddressZero",
		"inputs": []
	},
	{
		"type": "error",
		"name": "SellerCantBeTheSameAsBuyer",
		"inputs": []
	},
	{
		"type": "error",
		"name": "TransactionFailed",
		"inputs": []
	},
	{
		"type": "error",
		"name": "ValueMustBeGreaterThan0",
		"inputs": []
	},
	{
		"type": "error",
		"name": "YouAreNotOwnerOfThisOffer",
		"inputs": []
	}
]