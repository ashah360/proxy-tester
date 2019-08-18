import React, { Component } from 'react';

import Logo from '../assets/logo.svg';
import USFlag from '../assets/us-flag.svg';
import JPFlag from '../assets/jp-flag.svg';
import USFlagFaded from '../assets/us-flag-faded.svg';
import JPFlagFaded from '../assets/jp-flag-faded.svg';
import Divider from '../assets/divider.svg';
import SunDark from '../assets/sun-dark.svg';

import LightTheme from '../styles/App-light.module.css';
import DarkTheme from '../styles/App-dark.module.css';

import '../styles/App.css';

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
			themeCSS: {
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
		this.state.css = this.state.themeCSS[this.state.theme];

		return (
			<div className={this.state.css['container']}>
				<header>
					<img id={this.state.css['logo']} src={Logo} />

					<div id={this.state.css['icons']}>
						<img id={this.state.css['us-flag']} onClick={this.handleRegionChange} src={this.state.flags.US} alt="" />
						<img id={this.state.css['jp-flag']} onClick={this.handleRegionChange} src={this.state.flags.JP} alt="" />

						<img id={this.state.css['divider']} src={Divider} alt="" />

						<img id={this.state.css['sun-dark']} onClick={this.changeTheme} src={SunDark} alt="" />
					</div>
				</header>

				<div className={this.state.css['form-control-group']}>
					<div style={{ display: 'inline-block', float: 'left', width: '74%' }}>
						<label className={this.state.css['form-label']} htmlFor="inputProxy">{this.state.proxyText[this.state.region]}</label>
						<input className={this.state.css['input']} id="inputProxy" type="text"></input>
					</div>

					<div style={{ display: 'inline-block', float: 'right', width: '24%' }}>
						<label className={this.state.css['form-label']} htmlFor="inputPort">{this.state.portText[this.state.region]}</label>
						<input className={this.state.css['input']} id="inputPort" type="text"></input>
					</div>

					<div style={{ display: 'inline-block', marginTop: '40px', float: 'left', width: '49%' }}>
						<label className={this.state.css['form-label']} htmlFor="inputUser">{this.state.usernameText[this.state.region]}</label>
						<input className={this.state.css['input']} id="inputUser" type="text"></input>
					</div>

					<div style={{ display: 'inline-block', marginTop: '40px', float: 'right', width: '49%' }}>
						<label className={this.state.css['form-label']} htmlFor="inputPassword">{this.state.passwordText[this.state.region]}</label>
						<input className={this.state.css['input']} id="inputPassword" type="password"></input>
					</div>
				</div>

				<span id={this.state.css['cb-paste']}>{this.state.pasteText[this.state.region]}</span>

				<div className={this.state.css['form-control-group']}>
					<div style={{ display: 'inline-block', float: 'left', width: '74%' }}>
						<label className={this.state.css['form-label']} htmlFor="inputDomain">{this.state.domainText[this.state.region]}</label>
						<input className={this.state.css['input']} id="inputDomain" type="text"></input>
					</div>

					<div style={{ display: 'inline-block', float: 'right', width: '24%' }}>
						<label className={this.state.css['form-label']} htmlFor="inputPing">{this.state.pingText[this.state.region]}</label>
						<input className={this.state.css['input']} id="inputPing" type="text" value="203 ms" disabled></input>
					</div>

					<button style={{ marginTop: '15px' }} className={[this.state.css['form-btn'], this.state.css['blue-btn']].join(' ')}>{this.state.pingTestText[this.state.region]}</button>
					<button style={{ marginTop: '16px', marginBottom: '25px' }} className={[this.state.css['form-btn'], this.state.css['grey-btn']].join(' ')}>{this.state.connectText[this.state.region]}</button>
				</div>
			</div>
		);
	}
}

export default App;