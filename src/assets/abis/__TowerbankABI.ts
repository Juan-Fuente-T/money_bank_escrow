export const TowerbankABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "currency",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "AddressIsNotWhitelisted",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "BuyerApproveEscrowFirst",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "CantBeAddressZero",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "EscrowIsNotFunded",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "FeeCanBeFrom0to1Percent",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "IncorretAmount",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NoFeesToWithdraw",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "SellerApproveEscrowFirst",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "SellerCantBeAddressZero",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "SellerCantBeTheSameAsBuyer",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ValueMustBeGreaterThan0",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "YouAreNotOwnerOfThisOffer",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "address payable",
						"name": "buyer",
						"type": "address"
					},
					{
						"internalType": "address payable",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "cost",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "sellerfee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "buyerfee",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "escrowNative",
						"type": "bool"
					},
					{
						"internalType": "contract IERC20",
						"name": "currency",
						"type": "address"
					},
					{
						"internalType": "enum Towerbank.EscrowStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"indexed": false,
				"internalType": "struct Towerbank.Escrow",
				"name": "escrow",
				"type": "tuple"
			}
		],
		"name": "EscrowCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "address payable",
						"name": "buyer",
						"type": "address"
					},
					{
						"internalType": "address payable",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "cost",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "sellerfee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "buyerfee",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "escrowNative",
						"type": "bool"
					},
					{
						"internalType": "contract IERC20",
						"name": "currency",
						"type": "address"
					},
					{
						"internalType": "enum Towerbank.EscrowStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"indexed": false,
				"internalType": "struct Towerbank.Escrow",
				"name": "escrow",
				"type": "tuple"
			}
		],
		"name": "EscrowComplete",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "address payable",
						"name": "buyer",
						"type": "address"
					},
					{
						"internalType": "address payable",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "cost",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "sellerfee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "buyerfee",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "escrowNative",
						"type": "bool"
					},
					{
						"internalType": "contract IERC20",
						"name": "currency",
						"type": "address"
					},
					{
						"internalType": "enum Towerbank.EscrowStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"indexed": false,
				"internalType": "struct Towerbank.Escrow",
				"name": "escrow",
				"type": "tuple"
			}
		],
		"name": "EscrowDeposit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			}
		],
		"name": "EscrowDisputeResolved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "acceptEscrow",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "acceptEscrowNativeCoin",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "acceptEscrowToken",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addressStableToWhitelist",
				"type": "address"
			}
		],
		"name": "addStablesAddresses",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "cancelEscrow",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_cost",
				"type": "uint256"
			},
			{
				"internalType": "contract IERC20",
				"name": "_currency",
				"type": "address"
			}
		],
		"name": "createEscrowNativeCoin",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_cost",
				"type": "uint256"
			},
			{
				"internalType": "contract IERC20",
				"name": "_currency",
				"type": "address"
			}
		],
		"name": "createEscrowToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addressStableToWhitelist",
				"type": "address"
			}
		],
		"name": "delStablesAddresses",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "escrows",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "buyer",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "cost",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sellerfee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "buyerfee",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "escrowNative",
				"type": "bool"
			},
			{
				"internalType": "contract IERC20",
				"name": "currency",
				"type": "address"
			},
			{
				"internalType": "enum Towerbank.EscrowStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feeBuyer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feeSeller",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"name": "feesAvailable",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feesAvailableNativeCoin",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "getEscrow",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address payable",
						"name": "buyer",
						"type": "address"
					},
					{
						"internalType": "address payable",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "cost",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "sellerfee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "buyerfee",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "escrowNative",
						"type": "bool"
					},
					{
						"internalType": "contract IERC20",
						"name": "currency",
						"type": "address"
					},
					{
						"internalType": "enum Towerbank.EscrowStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct Towerbank.Escrow",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "getState",
		"outputs": [
			{
				"internalType": "enum Towerbank.EscrowStatus",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "getValue",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "isEscrowNative",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "orderId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "refundBuyer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "refundBuyerNativeCoin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "releaseEscrow",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "releaseEscrowNativeCoin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "releaseEscrowOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_orderId",
				"type": "uint256"
			}
		],
		"name": "releaseEscrowOwnerNativeCoin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_feeBuyer",
				"type": "uint256"
			}
		],
		"name": "setFeeBuyer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_feeSeller",
				"type": "uint256"
			}
		],
		"name": "setFeeSeller",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "version",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "whitelistedStablesAddresses",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "_currency",
				"type": "address"
			}
		],
		"name": "withdrawFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawFeesNativeCoin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]