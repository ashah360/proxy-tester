import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../styles/App-light.css';

import USFlag from '../assets/us-flag.svg';
import JPFlag from '../assets/jp-flag.svg';
import USFlagFaded from '../assets/us-flag-faded.svg';
import JPFlagFaded from '../assets/jp-flag-faded.svg';

import Divider from '../assets/divider.svg';

import SunDark from '../assets/sun-dark.svg';

class App extends Component {
	constructor() {
		super();

		this.handleUSRegionChange = this.handleUSRegionChange.bind(this);
		this.handleJPRegionChange = this.handleJPRegionChange.bind(this);

		this.state = {
			region: 'US',
			flags: {
				US: USFlag,
				JP: JPFlagFaded
			},
			proxyText: {
				US: 'Proxy IP',
				JP: 'プロキシー IP'
			},
			portText: {
				US: 'Port',
				JP: 'ポート'
			},
			usernameText: {
				US: 'Username',
				JP: 'ユーザーネーム'
			},
			passwordText: {
				US: 'Password',
				JP: 'パスワード'
			},
			pasteText: {
				US: 'Paste from clipboard',
				JP: 'クリップボードから貼り付け'
			},
			domainText: {
				US: 'Test Domain',
				JP: 'テストするドメイン'
			},
			pingText: {
				US: 'Ping',
				JP: '速度'
			},
			pingTestText: {
				US: 'Test Ping',
				JP: '速度をテストする'
			},
			connectText: {
				US: 'Connect',
				JP: '接続'
			}
		}
	}

	handleUSRegionChange(e) {
		console.log('Changing region to US');

		this.setState({ 
			flags: {
				US: USFlag,
				JP: JPFlagFaded
			},
			region: 'US' 
		});
	}

	handleJPRegionChange(e) {
		console.log('Changing region to JP');

		this.setState({
			flags: {
				US: USFlagFaded,
				JP: JPFlag
			},
			region: 'JP'
		});
	}

	render() {
		return (
			<div className='container'>
				<header>
					<img id="logo" src={logo} />

					<div id="icons">
						<img id="us-flag" onClick={this.handleUSRegionChange} src={this.state.flags.US} alt="" />
						<img id="jp-flag" onClick={this.handleJPRegionChange} src={this.state.flags.JP} alt="" />

						<img id="divider" src={Divider} alt="" />

						<img id="sun-dark" src={SunDark} alt="" />
					</div>
				</header>

				<div className='form-control-group'>
					<div style={{ display: 'inline-block', float: 'left', width: '74%' }}>
						<label className='form-label' for="inputProxy">{this.state.proxyText[this.state.region]}</label>
						<input id="inputProxy" type="text"></input>
					</div>

					<div style={{ display: 'inline-block', float: 'right', width: '24%' }}>
						<label className='form-label' for="inputPort">{this.state.portText[this.state.region]}</label>
						<input id="inputPort" type="text"></input>
					</div>

					<div style={{ display: 'inline-block', marginTop: '40px', float: 'left', width: '48%' }}>
						<label className='form-label' for="inputUser">{this.state.usernameText[this.state.region]}</label>
						<input id="inputUser" type="text"></input>
					</div>

					<div style={{ display: 'inline-block', marginTop: '40px', float: 'right', width: '48%' }}>
						<label className='form-label' for="inputPassword">{this.state.passwordText[this.state.region]}</label>
						<input id="inputPassword" type="password"></input>
					</div>
				</div>

				<span id="cb-paste">{this.state.pasteText[this.state.region]}</span>

				<div className='form-control-group'>
					<div style={{ display: 'inline-block', float: 'left', width: '74%' }}>
						<label className='form-label' for="inputDomain">{this.state.domainText[this.state.region]}</label>
						<input id="inputDomain" type="text"></input>
					</div>

					<div style={{ display: 'inline-block', float: 'right', width: '24%' }}>
						<label className='form-label' for="inputPing">{this.state.pingText[this.state.region]}</label>
						<input id="inputPing" type="text" value="203 ms" disabled></input>
					</div>

					<button style={{ marginTop: '15px' }} className='form-btn blue-btn'>{this.state.pingTestText[this.state.region]}</button>
					<button style={{ marginTop: '16px' }} className='form-btn grey-btn'>{this.state.connectText[this.state.region]}</button>
				</div>
			</div>
		);
	}
}

export default App;
