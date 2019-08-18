import React, { Component } from 'react';
import logo from '../assets/logo.svg';

import USFlag from '../assets/us-flag.svg';
import JPFlag from '../assets/jp-flag.svg';
import USFlagFaded from '../assets/us-flag-faded.svg';
import JPFlagFaded from '../assets/jp-flag-faded.svg';
import Divider from '../assets/divider.svg';
import SunDark from '../assets/sun-dark.svg';

import LightTheme from '../styles/App-light.module.css';
import DarkTheme from '../styles/App-dark.module.css';

class App extends Component {
	constructor() {
		super();

		this.changeTheme = this.changeTheme.bind(this);

		this.handleRegionChange = this.handleRegionChange.bind(this);

		this.translations = {
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
		};

		this.state = {
			region: 'US',
			theme: 'light',
			cssText: {
				light: LightTheme,
				dark: DarkTheme
			},
			flags: {
				US: USFlag,
				JP: JPFlagFaded
			},
			...this.translations
		}
	}

	changeTheme(e) {
		this.setState({ theme: (this.state.theme === 'light') ? 'dark' : 'light' });

		console.log(`Theme changed to: ${this.state.theme}`);
	}

	handleRegionChange(e) {
		const updatedRegion = (this.state.region === 'US') ? 'JP' : 'US';

		console.log(`Changing region to: ${updatedRegion}`);

		this.setState({ 
			flags: {
				US: (updatedRegion === 'US') ? USFlag : USFlagFaded,
				JP: (updatedRegion === 'US') ? JPFlagFaded : JPFlag
			},
			region: updatedRegion 
		});
	}

	render() {
		return (
			<div className="container">
				<style>{this.state.cssText[this.state.theme]}</style>
				<header>
					<img id="logo" src={logo} />

					<div id="icons">
						<img id="us-flag" onClick={this.handleRegionChange} src={this.state.flags.US} alt="" />
						<img id="jp-flag" onClick={this.handleRegionChange} src={this.state.flags.JP} alt="" />

						<img id="divider" src={Divider} alt="" />

						<img id="sun-dark" onClick={this.changeTheme} src={SunDark} alt="" />
					</div>
				</header>

				<div className="form-control-group">
					<div style={{ display: 'inline-block', float: 'left', width: '74%' }}>
						<label className="form-label" htmlFor="inputProxy">{this.state.proxyText[this.state.region]}</label>
						<input id="inputProxy" type="text"></input>
					</div>

					<div style={{ display: 'inline-block', float: 'right', width: '24%' }}>
						<label className="form-label" htmlFor="inputPort">{this.state.portText[this.state.region]}</label>
						<input id="inputPort" type="text"></input>
					</div>

					<div style={{ display: 'inline-block', marginTop: '40px', float: 'left', width: '49%' }}>
						<label className="form-label" htmlFor="inputUser">{this.state.usernameText[this.state.region]}</label>
						<input id="inputUser" type="text"></input>
					</div>

					<div style={{ display: 'inline-block', marginTop: '40px', float: 'right', width: '49%' }}>
						<label className="form-label" htmlFor="inputPassword">{this.state.passwordText[this.state.region]}</label>
						<input id="inputPassword" type="password"></input>
					</div>
				</div>

				<span id="cb-paste">{this.state.pasteText[this.state.region]}</span>

				<div className="form-control-group">
					<div style={{ display: 'inline-block', float: 'left', width: '74%' }}>
						<label className="form-label" htmlFor="inputDomain">{this.state.domainText[this.state.region]}</label>
						<input id="inputDomain" type="text"></input>
					</div>

					<div style={{ display: 'inline-block', float: 'right', width: '24%' }}>
						<label className="form-label" htmlFor="inputPing">{this.state.pingText[this.state.region]}</label>
						<input id="inputPing" type="text" value="203 ms" disabled></input>
					</div>

					<button style={{ marginTop: '15px' }} className="form-btn blue-btn">{this.state.pingTestText[this.state.region]}</button>
					<button style={{ marginTop: '16px', marginBottom: '25px' }} className="form-btn grey-btn">{this.state.connectText[this.state.region]}</button>
				</div>
			</div>
		);
	}
}

export default App;