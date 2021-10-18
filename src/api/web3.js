import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import BigNumber from "bignumber.js";

const address = process.env.REACT_APP_ADDRESS
console.log(process.env.REACT_APP_ABI)
const abi = JSON.parse(process.env.REACT_APP_ABI)
const contract1 = function (web3) {
    return new web3.eth.Contract(abi, address)
}
export default contract1

export async function connect() {
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            bridge: 'https://bridge.walletconnect.org',
            options: {
                rpc: {
                    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
                    3: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
                    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
                    5: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
                    42: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
                    56: 'https://bsc-dataseed1.defibit.io/',
                    65: 'https://exchaintestrpc.okex.org',
                    66: 'https://exchainrpc.okex.org',
                    70: 'https://http-mainnet.hoosmartchain.com',
                    97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
                    128: 'https://http-mainnet-node.huobichain.com',
                    170: 'https://http-testnet.hoosmartchain.com',
                    256: 'https://http-testnet.hecochain.com',
                    20212: 'https://zsc.one/rpc'
                }
            }
        }
    }
    const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions
    })
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    console.log(web3)
    const chainId = await web3.eth.getChainId()
    console.log('chainId', chainId)
    const blockNumber = await web3.eth.getBlockNumber()
    console.log('blockNumber', blockNumber)
    try {
        var accounts = await web3.eth.getAccounts()
        var Balance = await web3.eth.getBalance(accounts[0])
    } catch (e) {
        accounts = []
        Balance = 0
    }
    console.log('Balance', Balance / 10 ** 18)
    const NodeInfo = await web3.eth.getNodeInfo()
    console.log('NodeInfo', NodeInfo)
    const defaultaccount = accounts[0]

    async function edit() {
        const contract = new web3.eth.Contract(abi, address)
        const tx2 = contract.methods.edit(13).send({from: defaultaccount})
        return tx2
    }

    async function transfer(recipient, amount, decimals) {
        const token = '0xf2ad9f600656652c6ab8a53dcc909f55b00f39a9'
        const abi = `[{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`
        const contract = new web3.eth.Contract(JSON.parse(abi), token)
        console.log(contract)
        const tx2 = contract.methods.transfer(recipient, new BigNumber(amount * (10 ** decimals))).send({from: defaultaccount})
        return tx2
    }

    return {
        blockNumber: blockNumber,
        Balance: Balance / (10 ** 18),
        chainId: chainId,
        islinkwallte: true,
        wallet_address: accounts[0].slice(0, 4) + '...' + accounts[0].slice(-4),
        web3Modal: web3Modal,
        web3: web3,
        defaultaccount: defaultaccount,
        show_account: accounts[0].substr(0, 5),
        collection_address: accounts[0],
        edit: edit,
        transfer: transfer
    }
}

const TypeList = {
    1: {
        "image": "1.jpg",
        "name": "China"
    },
    2: {
        "image": "2.jpg",
        "name": "US"
    },
    3: {
        "image": "3.jpg",
        "name": "UK"
    }
}

const TokenList = {
    1: 3,
    2: 1
}

export function getdata(tokenID) {
    const type = TokenList[tokenID]
    const data = TypeList[type]
    return data
}