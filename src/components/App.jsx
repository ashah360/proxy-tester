/* global chrome */
import React, {
	useState,
	useEffect
} from 'react';

import Logo from '../assets/logo.svg';

import USFlag from '../assets/us-flag.svg';
import JPFlag from '../assets/jp-flag.svg';

import USFlagFaded from '../assets/us-flag-faded.svg';
import JPFlagFaded from '../assets/jp-flag-faded.svg';
import USFlagFadedDark from '../assets/us-flag-faded-dark.svg';
import JPFlagFadedDark from '../assets/jp-flag-faded-dark.svg';

import Divider from '../assets/divider.svg';
import DividerDark from '../assets/divider-dark.svg';

import Sun from '../assets/sun.svg';
import Moon from '../assets/moon.svg';

import LightTheme from '../styles/App-light.module.css';
import DarkTheme from '../styles/App-dark.module.css';

import '../styles/App.css';

const DEFAULT_DOMAIN = 'kith.com';

Array.prototype._push = function (item) {
	this.push(item);

	return this;
};

function App () {
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
				domain: DEFAULT_DOMAIN
			})
		);
	}

	// Initialize states with Hooks
	const [region, setRegion] = useState(localStorage.getItem('region'));
	const [theme, setTheme] = useState(localStorage.getItem('theme'));
	const [divider, setDivider] = useState((theme === 'light') ? Divider : DividerDark);

	const [themeCSS] = useState({
		light: LightTheme,
		dark: DarkTheme
	});
	const [flags, setFlags] = useState({
		US: region === 'US' ? USFlag : ((theme === 'light') ? USFlagFaded : USFlagFadedDark),
		JP: region === 'JP' ? JPFlag : ((theme === 'light') ? JPFlagFaded : JPFlagFadedDark)
	});

	const css = themeCSS[theme];

	const [ping, setPing] = useState('0 ms');
	const [proxyText, setProxyText] = useState({});
	const [connectText, setConnectBtnText] = useState(translations.connectText[region]);
	const [pingBtnText, setPingBtnText] = useState(translations.pingTestText[region]);

	const [connectBtnClasses, setConnectBtnClasses] = useState([css['form-btn'], css['grey-btn']]);

	// componentDidMount
	useEffect(() => {
		const { host, port, username, password, domain, connected } = JSON.parse(localStorage.getItem('proxySettings'));

		setProxyText({
			host,
			username,
			password,
			port,
			domain
		});

		if (connected) {
			setConnectBtnText(translations.disconnectText[region]);
			setConnectBtnClasses(connectBtnClasses
				.filter((c) => !c.includes('grey-btn'))
				._push(css['scarlet-btn'])
			);
		}
	}, []);

	// componentDidUpdate - only when values in dependency array change
	useEffect(() => {
		const { connected } = JSON.parse(localStorage.getItem('proxySettings'));

		if (connected) {
			setConnectBtnText(translations.disconnectText[region]);
			setConnectBtnClasses(connectBtnClasses
				.filter((c) => !c.includes('grey-btn'))
				._push(css['scarlet-btn'])
			);
		}
		else {
			setConnectBtnText(translations.connectText[region]);
			setConnectBtnClasses(connectBtnClasses
				.filter((c) => !c.includes('grey-btn'))
				._push(css['grey-btn'])
			);
		}

		setPingBtnText(translations.pingTestText[region]);
		setFlags({
			US: region === 'US' ? USFlag : ((theme === 'light') ? USFlagFaded : USFlagFadedDark),
			JP: region === 'JP' ? JPFlag : ((theme === 'light') ? JPFlagFaded : JPFlagFadedDark)
		});
	}, [proxyText, region, theme]);

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
		const updatedTheme = (theme === 'light') ? 'dark' : 'light';

		localStorage.setItem('theme', updatedTheme);
		setTheme(updatedTheme);
		setDivider((updatedTheme === 'light') ? Divider : DividerDark);

		console.log(`Theme changed to: ${updatedTheme}`);
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

		setProxyText({
			...proxyText,
			[type]: e.target.value
		});
		localStorage.setItem('proxySettings', JSON.stringify(proxySettings));
	};

	const _handlePasteBtnClick = (_e) => {
		console.log('Paste button clicked');

		navigator.clipboard.readText().then(console.log);

		navigator.clipboard.readText().then((pasteData) => {
			const split = pasteData.toString().trim().split(':');
			const proxySettings = JSON.parse(localStorage.getItem('proxySettings'));

			console.log('Data:', pasteData);

			if (split.length === 2) {
				setProxyText({
					...proxyText,
					host: split[0],
					port: split[1]
				});

				proxySettings.host = split[0];
				proxySettings.port = split[1];
			}
			else if (split.length === 4) {
				setProxyText({
					...proxyText,
					host: split[0],
					port: split[1],
					username: split[2],
					password: split[3]
				});

				proxySettings.host = split[0];
				proxySettings.port = split[1];
				proxySettings.username = split[2];
				proxySettings.password = split[3];
			}

			localStorage.setItem('proxySettings', JSON.stringify(proxySettings));
		})
		.catch((e) => {
			console.error(e);

			alert([
				'There was an error reading the content from your clipboard!',
				'Make sure your proxy is in the format ip:port OR ip:port:user:pass'
			].join('\n\n'));
		});
	};

	const handlePasteBtnClick = _e => {
		console.log('Paste button clicked');

		function readClipboard() {
			const t = document.createElement('input');
			document.body.appendChild(t);
			t.focus();

			document.execCommand('paste');

			const clipboardText = t.value;
			console.log(clipboardText);

			document.body.removeChild(t);

			return clipboardText;
		}

		const pasteData = readClipboard();
		const split = pasteData.toString().trim().split(':');
		const proxySettings = JSON.parse(localStorage.getItem('proxySettings'));

		if (split.length === 2) {
			setProxyText({
				...proxyText,
				host: split[0],
				port: split[1]
			});

			proxySettings.host = split[0];
			proxySettings.port = split[1];
		}
		else if (split.length === 4) {
			setProxyText({
				...proxyText,
				host: split[0],
				port: split[1],
				username: split[2],
				password: split[3]
			});

			proxySettings.host = split[0];
			proxySettings.port = split[1];
			proxySettings.username = split[2];
			proxySettings.password = split[3];
		}

		localStorage.setItem('proxySettings', JSON.stringify(proxySettings));
	};
 
	const handleConnectBtnClick = _e => {
		const proxySettings = JSON.parse(localStorage.getItem('proxySettings'));
		if (proxySettings.connected) {
			setConnectBtnText(translations.disconnectingText[region]);
			
			disconnectProxy();

			setConnectBtnText(translations.connectText[region]);
			setConnectBtnClasses(connectBtnClasses
				.filter((c) => !c.includes('scarlet-btn'))
				._push(css['grey-btn'])
			);

			proxySettings.connected = false;
			localStorage.setItem('proxySettings', JSON.stringify(proxySettings));
		} else {
			setConnectBtnText(translations.connectingText[region]);

			connectToProxy(proxySettings);

			setConnectBtnText(translations.disconnectText[region]);
			setConnectBtnClasses(connectBtnClasses
				.filter((c) => !c.includes('grey-btn'))
				._push(css['scarlet-btn'])
			);

			proxySettings.connected = true;
			localStorage.setItem('proxySettings', JSON.stringify(proxySettings));
		}
	};

	const handlePingTest = e => {
		e.preventDefault();

		setPingBtnText(translations.pingTestingText[region]);

		const proxy = {
			...proxyText
		};

		const formattedDomain = proxyText.domain
			.trim()
			.replace(/http(s|)(:\/\/|)(www\.|)/, '');
		const testDomain = 'https://' + formattedDomain;

		let useAuthCredentials = true;

		if (proxy.username && !proxy.password) {
			alert('Proxy password required!');

			return;
		} else if (proxy.password && !proxy.username) {
			alert('Proxy username required!');

			return;
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

		fetch(testDomain, {
			method: 'GET', // *GET, POST, PUT, DELETE, etc.
			mode: 'no-cors', // no-cors, cors, *same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'omit', // include, *same-origin, omit
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			setPing(`${Date.now() - startTime} ms`);

			console.log(`Got ping: ${ping}`);

			return response.text();
		}).then((text) => {
			console.log('Response:', text);

			setPingBtnText(translations.pingTestText[region]);

			disconnectProxy();
		}).catch((err) => {
			console.error(err);

			setPingBtnText(translations.pingTestText[region]);
			setPing('TIMEOUT');

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

					<img id={css['divider']} src={divider} alt='' />

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
						spellCheck={false}
						onChange={e => handleProxySettingChange('host', e)}
						value={proxyText.host}
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
						spellCheck={false}
						onChange={e => handleProxySettingChange('port', e)}
						value={proxyText.port}
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
						spellCheck={false}
						onChange={e => handleProxySettingChange('username', e)}
						value={proxyText.username}
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
						spellCheck={false}
						onChange={e => handleProxySettingChange('password', e)}
						value={proxyText.password}
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
						spellCheck={false}
						onChange={e => handleProxySettingChange('domain', e)}
						value={proxyText.domain}
						type='text'
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
						spellCheck={false}
						value={ping}
						type='text'
						disabled
					/>
				</div>

				<button
					style={{ marginTop: '15px' }}
					className={[css['form-btn'], css['blue-btn']].join(' ')}
					onClick={handlePingTest}
				>
					{pingBtnText}
				</button>
				<button
					style={{ marginTop: '16px', marginBottom: '25px' }}
					className={connectBtnClasses.join(' ')}
					onClick={handleConnectBtnClick}
				>
					{connectText}
				</button>
			</div>
		</div>
	);
}

export default App;