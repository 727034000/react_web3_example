import logo from './logo.svg';
import './App.css';
import React, {Component, useState, useEffect} from 'react';
import {connect,getData} from "./api/web3";
//添加Toat组件, https://fkhadra.github.io/react-toastify/introduction/
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {splitSignature} from '@ethersproject/bytes'
import BigNumber from "bignumber.js";
import axios from 'axios';
import qs from 'qs'
//class式组件
class App extends Component {
    //构建函数
    constructor(props) {
        console.log(props.name)
        super(props)
        this.state = {
            defaultaccount: '',
            name: props.name
        }
    }

    //组件将要挂载时候触发的生命周期函数
    componentWillMount() {
        const res = connect()
        res.then(res2 => {
            console.log('res2', res2)
            this.setState(
                {defaultaccount: '当前账号:' + res2.defaultaccount, transfer: res2.transfer}
            )
        })
    }

    //内部异步函数
    transfer = () => {
        let tx = this.state.transfer('0xDDd81F8759b0871523D6a0D704a7d2683797c13F', 0.1, 18)
        tx.then(res => {
            if (res.status === true) {
                toast.success('转账成功', {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        })
    }

    //组件挂载完成时候触发的生命周期函数
    componentDidMount() {
        console.log('04组件将要挂载')
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.js</code> and save to reload. {this.state.name}<br/>
                        {this.state.defaultaccount}
                    </p>
                    <p onClick={this.transfer}>transfer</p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                        <ToastContainer/>
                    </a>
                </header>
            </div>
        );
    }
}

//函数式组件,使用hooks
function App2(list) {
    const toastId = React.useRef(null);
    const pending = (render_conetnt) => toastId.current = toast(render_conetnt, {
        position: "top-center",
        autoClose: 50000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    const update = (render_conetnt) => toast.update(toastId.current, {
        render: render_conetnt,
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    // console.log(list)
    const [data, setData] = useState({defaultaccount: '', transfer: null});
    useEffect(() => {
        const fetchData = async () => {
            axios.post('http://localhost:3000/getdodoroute', qs.stringify({
                fromTokenAddress: '0xa71EdC38d189767582C38A3145b5873052c3e47a',
                fromTokenDecimals:18,
                toTokenAddress:'0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F',
                toTokenDecimals:18,
                fromAmount:1*(10**18),
                slippage:10,
                userAddr:'0x1c1BDADD6b167f4A60dfECcC525534Bf0f5BF323',
                chainId:128,
                rpc:'https://http-mainnet-node.huobichain.com',
                deadLine:99999999999999,
            }),{
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded'
                    }
                }).then(function (response) {
                    console.log(response);
                }).catch(function (error) {
                    console.log(error);
                });
        }
        fetchData()
    })

    useEffect(() => {
        const fetchData = async () => {
            const result = await connect();
            const sign = async () => {
                const pairAbi = JSON.parse(`[{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]`)
                const pairAddress = '0x110b0D78f5Ea6b6B5E161e82617a8756c8f5d598'
                const contract = new result.web3.eth.Contract(pairAbi, pairAddress)
                const nonces = await contract.methods.nonces('0x1c1BDADD6b167f4A60dfECcC525534Bf0f5BF323').call()
                const balance = await contract.methods.balanceOf('0x1c1BDADD6b167f4A60dfECcC525534Bf0f5BF323').call()
                let amount = new BigNumber((balance.toString())*0.01)
                let amount2 = parseInt(amount.toString())
                const nonces2 = result.web3.utils.toHex(nonces)
                const routerAddress = '0xed7d5f38c79115ca12fe6c0041abb22f0a06c300'
                const routerAbi = JSON.parse(`[{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]`)
                // const data2 = `{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Permit":[{"name":"owner","type":"address"},{"name":"spender","type":"address"},{"name":"value","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"deadline","type":"uint256"}]},"domain":{"name":"HSwap LP Token","version":"1","chainId":128,"verifyingContract":"0x110b0D78f5Ea6b6B5E161e82617a8756c8f5d598"},"primaryType":"Permit","message":{"owner":"0x1c1BDADD6b167f4A60dfECcC525534Bf0f5BF323","spender":"0xED7d5F38C79115ca12fe6C0041abb22F0A06C300","value":"49004426843127810","nonce":"${nonces2}","deadline":2634621216}}`
                const data3 = getData('0x1c1bdadd6b167f4a60dfeccc525534bf0f5bf323', 'HSwap LP Token', 128, pairAddress, routerAddress, amount2, nonces2, 2634621216)
                // console.log(data3)
                const kk = result.web3.currentProvider.send('eth_signTypedData_v4', ['0x1c1BDADD6b167f4A60dfECcC525534Bf0f5BF323', data3])
                kk.then((res) => {
                    const {r, s, v} = splitSignature(res.result)
                    // console.log(r, s, v)
                    const pp = new result.web3.eth.Contract(routerAbi, routerAddress)
                    const qq = pp.methods.removeLiquidityWithPermit('0x52ee54dd7a68e9cf131b0a57fd6015c74d7140e2', '0xa71edc38d189767582c38a3145b5873052c3e47a', new BigNumber(amount2), 0, 0, '0x1c1bdadd6b167f4a60dfeccc525534bf0f5bf323', 2634621216, false, v, r, s).send({from: '0x1c1BDADD6b167f4A60dfECcC525534Bf0f5BF323'})
                    qq.then((res) => {
                        console.log(res)
                    })
                })
            }

            const transfer = () => {
                pending('开始转账')
                let tx = result.transfer('0xDDd81F8759b0871523D6a0D704a7d2683797c13F', 0.1, 18)
                tx.then(res => {
                    if (res.status === true) {
                        update('转账成功')
                    }
                    toast.dismiss()
                }).catch(error => {
                    update('转账失败')
                    toast.dismiss()
                })

            }
            setData({defaultaccount: result.defaultaccount, transfer: transfer, sign: sign});

        };

        fetchData();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload. Name: {list.name} Age: {list.age}<br/>
                    {data.defaultaccount}
                </p>
                <p onClick={data.transfer}>transfer</p>
                {/*使用三元运算符,实现条件判断*/}
                {
                    data.defaultaccount === '0xf26d2D7Ca8B95148c90f9EE2321fDdcEa51F38B1'
                        ?
                        <p>这是管理员</p>
                        :
                        <p>这不是管理员</p>
                }
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <div id="id2"><ToastContainer/></div>
                <p onClick={data.sign}>签名</p>
            </header>
        </div>
    );
}

export default App2;
