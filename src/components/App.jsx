/* global chrome */
import React, { useRef } from 'react';

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

  return <div>hi</div>;
}

export default App;
