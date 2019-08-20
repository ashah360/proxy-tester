/* global chrome */
import React, { useRef, useState, useEffect } from "react";

import Logo from "../assets/logo.svg";
import USFlag from "../assets/us-flag.svg";
import JPFlag from "../assets/jp-flag.svg";
import USFlagFaded from "../assets/us-flag-faded.svg";
import JPFlagFaded from "../assets/jp-flag-faded.svg";
import Divider from "../assets/divider.svg";
import Sun from "../assets/sun.svg";
import Moon from "../assets/moon.svg";

import LightTheme from "../styles/App-light.module.css";
import DarkTheme from "../styles/App-dark.module.css";

import "../styles/App.css";

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

  const langTranslations = {
    proxyText: {
      US: "Proxy IP",
      JP: "プロキシー IP"
    },
    portText: {
      US: "Port",
      JP: "ポート"
    },
    usernameText: {
      US: "Username",
      JP: "ユーザーネーム"
    },
    passwordText: {
      US: "Password",
      JP: "パスワード"
    },
    pasteText: {
      US: "Paste from clipboard",
      JP: "クリップボードから貼り付け"
    },
    domainText: {
      US: "Test Domain",
      JP: "テストするドメイン"
    },
    pingText: {
      US: "Ping",
      JP: "速度"
    },
    pingTestText: {
      US: "Test Ping",
      JP: "速度をテストする"
    },
    pingTestingText: {
      US: "Testing...",
      JP: "テスト中"
    },
    connectText: {
      US: "Connect",
      JP: "接続"
    },
    connectingText: {
      US: "Connecting...",
      JP: "接続中..."
    },
    disconnectText: {
      US: "Disconnect",
      JP: "切断"
    },
    disconnectingText: {
      US: "Disconnecting...",
      JP: "切断中..."
    }
  };

  const theme = localStorage.getItem("theme");
  const region = localStorage.getItem("region");
  const proxySettings = localStorage.getItem("proxySettings");

  if (!theme) {
    localStorage.setItem("theme", "light");
  }
  if (!region) {
    localStorage.setItem("region", "US");
  }
  if (!proxySettings) {
    localStorage.setItem(
      "proxySettings",
      JSON.stringify({
        connected: false,
        host: "",
        port: "",
        username: "",
        password: "",
        domain: ""
      })
    );
  }

  // Initialize states with Hooks
  const [region, setRegion] = useState(localStorage.getItem("region"));
  const [theme, setTheme] = useState(localStorage.getItem("theme"));
  const [themeCSS, setThemeCSS] = useState({
    light: LightTheme,
    dark: DarkTheme
  });
  const [flags, setFlags] = useState({
    US: localStorage.getItem("region") === "US" ? USFlag : USFlagFaded,
    JP: localStorage.getItem("region") === "US" ? JPFlagFaded : JPFlag
  });
  const [translations, setTranslations] = useState(...translations);

  // componentDidMount
  useEffect(() => {
    const proxySettings = JSON.parse(localStorage.getItem("proxySettings"));

    let css = themeCSS[theme];

    inputProxy.current.value = proxySettings.host;
    inputPort.current.value = proxySettings.port;
    inputUsername.current.value = proxySettings.username;
    inputPassword.current.value = proxySettings.password;
    inputDomain.current.value = proxySettings.domain;

    if (proxySettings.connected) {
      connectToProxyBtn.current.innerHTML = translations.disconnectText[region];

      connectToProxyBtn.current.classList.remove(css["grey-btn"]);
      connectToProxyBtn.current.classList.add(css["scarlet-btn"]);
    }
  }, []);

  // componentDidUpdate
  useEffect(() => {
    const proxySettings = JSON.parse(localStorage.getItem("proxySettings"));

    if (proxySettings.connected) {
      connectToProxyBtn.current.innerHTML = translations.disconnectText[region];

      connectToProxyBtn.current.classList.remove(css["grey-btn"]);
      connectToProxyBtn.current.classList.add(css["scarlet-btn"]);
    }
  });

  const changeTheme = e => {
    const updatedTheme = theme === "light" ? "dark" : "light";

    localStorage.setItem("theme", updatedTheme);
    setTheme(theme === "light" ? "dark" : "light");

    console.log(`Theme changed to ${theme}`);
  };

  const handleRegionChange = e => {
    const updatedRegion = region === "US" ? "JP" : "US";
    console.log(`Changing region to: ${updatedRegion}`);

    localStorage.setItem("region", updatedRegion);

    setFlags({
      US: updatedRegion === "US" ? USFlag : USFlagFaded,
      JP: updatedRegion === "US" ? JPFlagFaded : JPFlag
    });

    setRegion(updatedRegion);
  };

  const handleProxySettingChange = (type, e) => {
    const proxySettings = JSON.parse(localStorage.getItem("proxySettings"));
    proxySettings[type] = e.target.value;
    localStorage.setItem("proxySettings", JSON.stringify(proxySettings));
  };

  const handleConnectBtnClick = e => {
    const proxySettings = JSON.parse(localStorage.getItem("proxySettings"));
    if (proxySettings.connected) {
      connectToProxyBtn.current.innerHTML =
        translations.disconnectingText[region];

      disconnectProxy();

      connectToProxyBtn.current.classList.remove(css["scarlet-btn"]);
      connectToProxyBtn.current.classList.add(css["grey-btn"]);

      connectToProxyBtn.current.innerHTML = translations.connectText[region];

      proxySettings.connected = false;
      localStorage.setItem("proxySettings", JSON.stringify(proxySettings));
    } else {
      connectToProxyBtn.current.innerHTML = translations.connectingText[region];

      connectToProxy(proxySettings);

      connectToProxyBtn.current.classList.remove(css["grey-btn"]);
      connectToProxyBtn.current.classList.add(css["scarlet-btn"]);

      connectToProxyBtn.current.innerHTML = translations.disconnectText[region];

      proxySettings.connected = true;
      localStorage.setItem("proxySettings", JSON.stringify(proxySettings));
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
      .replace(/http(s|)(:\/\/|)(www\.|)/, "");

    let useAuthCredentials = true;

    if (proxy.username && !proxy.password) {
      alert("Proxy password required!");
    } else if (proxy.password && !proxy.username) {
      alert("Proxy username required!");
    } else if (!proxy.username && !proxy.password) {
      useAuthCredentials = false;
    }

    connectToProxy(proxy);

    const proxyURI =
      "http://" +
      (useAuthCredentials ? `${proxy.username}:${proxy.password}@` : "") +
      `${proxy.host}:${proxy.port}`;

    // THIS IS WHERE I LEFT OFF I'M TIRED
  };

  return <div>hi</div>;
}

export default App;
