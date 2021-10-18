import logo from './logo.svg';
import './App.css';
import React, {Component, useState, useEffect} from 'react';
import {connect, getdata} from "./api/web3";
//添加Toat组件
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    console.log(list)
    const [data, setData] = useState({defaultaccount: '', transfer: null});

    useEffect(() => {
        const fetchData = async () => {
            const result = await connect();
            console.log(result)
            const transfer = () => {
                let tx = result.transfer('0xDDd81F8759b0871523D6a0D704a7d2683797c13F', 0.1, 18)
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
            setData({defaultaccount: result.defaultaccount, transfer: transfer});
        };

        fetchData();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload. Name: {list.name}  Age: {list.age}<br/>
                    {data.defaultaccount}
                </p>
                <p onClick={data.transfer}>transfer</p>
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

export default App2;
