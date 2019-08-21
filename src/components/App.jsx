/* global chrome */
import React, {
	useRef,
	useState,
	useEffect
} from 'react';

import Logo from '../assets/logo.svg';
import USFlag from '../assets/us-flag.svg';
import JPFlag from '../assets/jp-flag.svg';
import USFlagFaded from '../assets/us-flag-faded.svg';
import JPFlagFaded from '../assets/jp-flag-faded.svg';
import Divider from '../assets/divider.svg';
import Sun from '../assets/sun.svg';
import Moon from '../assets/moon.svg';

import LightTheme from '../styles/App-light.module.css';
import DarkTheme from '../styles/App-dark.module.css';

import '../styles/App.css';

function App() {
	// References
	const inputProxy = useRef(null);
	const inputPort = useRef(null);
	const inputUsername = useRef(null);
	const inputPassword = useRef(null);
	const inputDomain = useRef(null);
	const ping = useRef(null);
	const testPingBtn = useRef(null);
	const connectToProxyBtn = useRef(null);

	const translations = {
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
		pingTestingText: {
			US: 'Testing...',
			JP: 'テスト中'
		},
		connectText: {
			US: 'Connect',
			JP: '接続'
		},
		connectingText: {
			US: 'Connecting...',
			JP: '接続中...'
		},
		disconnectText: {
			US: 'Disconnect',
			JP: '切断'
		},
		disconnectingText: {
			US: 'Disconnecting...',
			JP: '切断中...'
		}
	};

	if (!localStorage.getItem('theme')) {
		localStorage.setItem('theme', 'light');
	}
	if (!localStorage.getItem('region')) {
		localStorage.setItem('region', 'US');
	}
	if (!localStorage.getItem('proxySettings')) {
		localStorage.setItem(
			'proxySettings',
			JSON.stringify({
				connected: false,
				host: '',
				port: '',
				username: '',
				password: '',
				domain: ''
			})
		);
	}

	// Initialize states with Hooks
	const [region, setRegion] = useState(localStorage.getItem('region'));
	const [theme, setTheme] = useState(localStorage.getItem('theme'));
	const [themeCSS, setThemeCSS] = useState({
		light: LightTheme,
		dark: DarkTheme
	});
	const [flags, setFlags] = useState({
		US: localStorage.getItem('region') === 'US' ? USFlag : USFlagFaded,
		JP: localStorage.getItem('region') === 'US' ? JPFlagFaded : JPFlag
	});

	const css = themeCSS[theme];

	// componentDidMount
	useEffect(() => {
		const proxySettings = JSON.parse(localStorage.getItem('proxySettings'));

		inputProxy.current.value = proxySettings.host;
		inputPort.current.value = proxySettings.port;
		inputUsername.current.value = proxySettings.username;
		inputPassword.current.value = proxySettings.password;
		inputDomain.current.value = proxySettings.domain;

		if (proxySettings.connected) {
			connectToProxyBtn.current.innerHTML = translations.disconnectText[region];

			connectToProxyBtn.current.classList.remove(css['grey-btn']);
			connectToProxyBtn.current.classList.add(css['scarlet-btn']);
		}
	}, []);

	// componentDidUpdate
	useEffect(() => {
		const proxySettings = JSON.parse(localStorage.getItem('proxySettings'));

		if (proxySettings.connected) {
			connectToProxyBtn.current.innerHTML = translations.disconnectText[region];

			connectToProxyBtn.current.classList.remove(css['grey-btn']);
			connectToProxyBtn.current.classList.add(css['scarlet-btn']);
		}
	});

	const connectToProxy = proxy => {
		console.log('Connecting to proxy');

		let useAuthCredentials = false;

		if (proxy.username.trim() && proxy.password.trim()) {
			useAuthCredentials = true;
		}

		const config = {
			mode: 'fixed_servers',
			rules: {
				singleProxy: {
					scheme: 'http',
					host: proxy.host,
					port: typeof proxy.port !== 'number' ? parseInt(proxy.port) : proxy.port
				},
				bypassList: []
			}
		};

		chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () { });
		chrome.proxy.settings.get({ incognito: false }, function (config) {
			console.log(config);
		});

		if (useAuthCredentials) {
			function callback(details) {
				// proxySettings = JSON.parse(localStorage.proxySetting);

				return details.isProxy === !0 ?
					{
						authCredentials: {
							username: proxy.username.trim(),
							password: proxy.password.trim()
						}
					} :
					{};
			}

			chrome.webRequest.onAuthRequired.addListener(
				callback, {
					urls: ['<all_urls>']
				},
				['blocking']
			);
		}
	};

	const disconnectProxy = () => {
		const config = {
			mode: 'direct'
		};

		chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () { });
		chrome.proxy.settings.get({ incognito: false }, function (config) {
			console.log(config);
		});

		console.info(`Disconnected any active proxy`);
	};

	const handleThemeChange = _e => {
		const updatedTheme = theme === 'light' ? 'dark' : 'light';

		localStorage.setItem('theme', updatedTheme);
		setTheme(theme === 'light' ? 'dark' : 'light');

		console.log(`Theme changed to: ${theme}`);
	};

	const handleRegionChange = _e => {
		const updatedRegion = region === 'US' ? 'JP' : 'US';
		console.log(`Changing region to: ${updatedRegion}`);

		localStorage.setItem('region', updatedRegion);

		setFlags({
			US: updatedRegion === 'US' ? USFlag : USFlagFaded,
			JP: updatedRegion === 'US' ? JPFlagFaded : JPFlag
		});

		setRegion(updatedRegion);
	};

	const handleProxySettingChange = (type, e) => {
		const proxySettings = JSON.parse(localStorage.getItem('proxySettings'));
		proxySettings[type] = e.target.value;
		localStorage.setItem('proxySettings', JSON.stringify(proxySettings));
	};

	const handlePasteBtnClick = _e => {
		console.log('Paste button clicked');
	};
 
	const handleConnectBtnClick = _e => {
		const proxySettings = JSON.parse(localStorage.getItem('proxySettings'));
		if (proxySettings.connected) {
			connectToProxyBtn.current.innerHTML =
				translations.disconnectingText[region];

			disconnectProxy();

			connectToProxyBtn.current.classList.remove(css['scarlet-btn']);
			connectToProxyBtn.current.classList.add(css['grey-btn']);

			connectToProxyBtn.current.innerHTML = translations.connectText[region];

			proxySettings.connected = false;
			localStorage.setItem('proxySettings', JSON.stringify(proxySettings));
		} else {
			connectToProxyBtn.current.innerHTML = translations.connectingText[region];

			connectToProxy(proxySettings);

			connectToProxyBtn.current.classList.remove(css['grey-btn']);
			connectToProxyBtn.current.classList.add(css['scarlet-btn']);

			connectToProxyBtn.current.innerHTML = translations.disconnectText[region];

			proxySettings.connected = true;
			localStorage.setItem('proxySettings', JSON.stringify(proxySettings));
		}
	};

	const handlePingTest = () => {
		testPingBtn.current.innerHTML = translations.pingTestingText[region];

		const proxy = {
			host: inputProxy.current.value.trim(),
			port: parseInt(inputPort.current.value.trim()),
			username: inputUsername.current.value.trim(),
			password: inputPassword.current.value.trim()
		};

		const testDomain = inputDomain.current.value
			.trim()
			.replace(/http(s|)(:\/\/|)(www\.|)/, '');

		let useAuthCredentials = true;

		if (proxy.username && !proxy.password) {
			alert('Proxy password required!');
		} else if (proxy.password && !proxy.username) {
			alert('Proxy username required!');
		} else if (!proxy.username && !proxy.password) {
			useAuthCredentials = false;
		}

		connectToProxy(proxy);

		const proxyURI =
			'http://' +
			(useAuthCredentials ? `${proxy.username}:${proxy.password}@` : '') +
			`${proxy.host}:${proxy.port}`;

		console.log('Making request with proxy:', proxyURI);
		console.log('Destination URL:', testDomain);

		const startTime = Date.now();

		fetch(`https://cors-anywhere.herokuapp.com/${testDomain}`, {
			method: 'GET', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, cors, *same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'omit', // include, *same-origin, omit
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			ping.current.value = `${Date.now() - startTime} ms`;

			console.log(`Got ping: ${ping.current.value}`);

			return response.text();
		}).then((text) => {
			console.log('Response:', text);

			testPingBtn.current.innerHTML = translations.pingTestText[region];

			disconnectProxy();
		}).catch((err) => {
			console.error(err);

			testPingBtn.current.innerHTML = translations.pingTestText[region];
			ping.current.value = `TIMEOUT`;

			disconnectProxy();
		});
	};

	return (
		<div className={css['container']}>
			<header>
				<img id={css['logo']} src={Logo} alt='' />

				<div id={css['icons']}>
					<img
						id={css['us-flag']}
						onClick={handleRegionChange}
						src={flags.US}
						alt=''
					/>
					<img
						id={css['jp-flag']}
						onClick={handleRegionChange}
						src={flags.JP}
						alt=''
					/>

					<img id={css['divider']} src={Divider} alt='' />

					<img
						id={css['theme-switcher']}
						onClick={handleThemeChange}
						src={theme === 'light' ? Moon : Sun}
						alt=''
					/>
				</div>
			</header>

			<div className={css['form-control-group']}>
				<div style={{ display: 'inline-block', float: 'left', width: '74%' }}>
					<label className={css['form-label']} htmlFor='inputProxy'>
						{translations.proxyText[region]}
					</label>
					<input
						id='inputProxy'
						className={css['input']}
						onChange={e => handleProxySettingChange('host', e)}
						ref={inputProxy}
						type='text'
					/>
				</div>

				<div
					style={{ display: 'inline-block', float: 'right', width: '24%' }}
				>
					<label className={css['form-label']} htmlFor='inputPort'>
						{translations.portText[region]}
					</label>
					<input
						id='inputPort'
						className={css['input']}
						onChange={e => handleProxySettingChange('port', e)}
						ref={inputPort}
						type='text'
					/>
				</div>

				<div
					style={{
						display: 'inline-block',
						marginTop: '40px',
						float: 'left',
						width: '49%'
					}}
				>
					<label className={css['form-label']} htmlFor='inputUsername'>
						{translations.usernameText[region]}
					</label>
					<input
						id='inputUsername'
						className={css['input']}
						onChange={e => handleProxySettingChange('username', e)}
						ref={inputUsername}
						type='text'
					/>
				</div>

				<div
					style={{
						display: 'inline-block',
						marginTop: '40px',
						float: 'right',
						width: '49%'
					}}
				>
					<label className={css['form-label']} htmlFor='inputPassword'>
						{translations.passwordText[region]}
					</label>
					<input
						id='inputPassword'
						className={css['input']}
						onChange={e => handleProxySettingChange('password', e)}
						ref={inputPassword}
						type='password'
					/>
				</div>
			</div>

			<span id={css['cb-paste']} onClick={handlePasteBtnClick}>
				{translations.pasteText[region]}
			</span>

			<div className={css['form-control-group']}>
				<div style={{ display: 'inline-block', float: 'left', width: '74%' }}>
					<label className={css['form-label']} htmlFor='inputDomain'>
						{translations.domainText[region]}
					</label>
					<input
						id='inputDomain'
						className={css['input']}
						onChange={e => handleProxySettingChange('domain', e)}
						type='text'
						ref={inputDomain}
						placeholder='kith.com'
					/>
				</div>

				<div
					style={{ display: 'inline-block', float: 'right', width: '24%' }}
				>
					<label className={css['form-label']} htmlFor='inputPing'>
						{translations.pingText[region]}
					</label>
					<input
						id={css['ping']}
						className={css['input']}
						ref={ping}
						type='text'
						value='0 ms'
						disabled
					/>
				</div>

				<button
					style={{ marginTop: '15px' }}
					className={[css['form-btn'], css['blue-btn']].join(' ')}
					onClick={handlePingTest}
					ref={testPingBtn}
				>
					{translations.pingTestText[region]}
				</button>
				<button
					style={{ marginTop: '16px', marginBottom: '25px' }}
					className={[css['form-btn'], css['grey-btn']].join(' ')}
					onClick={handleConnectBtnClick}
					ref={connectToProxyBtn}
				>
					{translations.connectText[region]}
				</button>
			</div>
		</div>
	);
}

export default App;