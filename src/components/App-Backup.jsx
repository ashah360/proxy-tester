/* global chrome */
import React, { Component } from "react";

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

class App extends Component {
  constructor() {
    super();

    this.inputProxy = React.createRef();
    this.inputPort = React.createRef();
    this.inputUsername = React.createRef();
    this.inputPassword = React.createRef();
    this.inputDomain = React.createRef();

    this.ping = React.createRef();
    this.testPingBtn = React.createRef();
    this.connectToProxyBtn = React.createRef();

    this.changeTheme = this.changeTheme.bind(this);
    this.handleRegionChange = this.handleRegionChange.bind(this);
    this.handleProxySettingChange = this.handleProxySettingChange.bind(this);
    this.handleConnectBtnClick = this.handleConnectBtnClick.bind(this);
    this.handlePingTest = this.handlePingTest.bind(this);
    this.connectToProxy = this.connectToProxy.bind(this);

    this.translations = {
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

    this.state = {
      region: localStorage.getItem("region"),
      theme: localStorage.getItem("theme"),
      themeCSS: {
        light: LightTheme,
        dark: DarkTheme
      },
      flags: {
        US: localStorage.getItem("region") === "US" ? USFlag : USFlagFaded,
        JP: localStorage.getItem("region") === "US" ? JPFlagFaded : JPFlag
      },
      ...this.translations
    };
  }

  componentDidMount() {
    const proxySettings = JSON.parse(localStorage.getItem("proxySettings"));

    this.css = this.state.themeCSS[this.state.theme];

    this.inputProxy.current.value = proxySettings.host;
    this.inputPort.current.value = proxySettings.port;
    this.inputUsername.current.value = proxySettings.username;
    this.inputPassword.current.value = proxySettings.password;
    this.inputDomain.current.value = proxySettings.domain;

    if (proxySettings.connected) {
      this.connectToProxyBtn.current.innerHTML = this.state.disconnectText[
        this.state.region
      ];

      this.connectToProxyBtn.current.classList.remove(this.css["grey-btn"]);
      this.connectToProxyBtn.current.classList.add(this.css["scarlet-btn"]);
    }
  }

  componentDidUpdate() {
    const proxySettings = JSON.parse(localStorage.getItem("proxySettings"));

    if (proxySettings.connected) {
      this.connectToProxyBtn.current.innerHTML = this.state.disconnectText[
        this.state.region
      ];

      this.connectToProxyBtn.current.classList.remove(this.css["grey-btn"]);
      this.connectToProxyBtn.current.classList.add(this.css["scarlet-btn"]);
    }
  }

  changeTheme(e) {
    const updatedTheme = this.state.theme === "light" ? "dark" : "light";

    localStorage.setItem("theme", updatedTheme);
    this.setState({ theme: this.state.theme === "light" ? "dark" : "light" });

    console.log(`Theme changed to: ${this.state.theme}`);
  }

  handleRegionChange(e) {
    const updatedRegion = this.state.region === "US" ? "JP" : "US";

    console.log(`Changing region to: ${updatedRegion}`);

    localStorage.setItem("region", updatedRegion);
    this.setState({
      flags: {
        US: updatedRegion === "US" ? USFlag : USFlagFaded,
        JP: updatedRegion === "US" ? JPFlagFaded : JPFlag
      },
      region: updatedRegion
    });
  }

  handleProxySettingChange(type, e) {
    const proxySettings = JSON.parse(localStorage.getItem("proxySettings"));

    proxySettings[type] = e.target.value;

    localStorage.setItem("proxySettings", JSON.stringify(proxySettings));
  }

  handleConnectBtnClick(e) {
    const proxySettings = JSON.parse(localStorage.getItem("proxySettings"));

    if (proxySettings.connected) {
      this.connectToProxyBtn.current.innerHTML = this.state.disconnectingText[
        this.state.region
      ];

      this.disconnectProxy();

      this.connectToProxyBtn.current.classList.remove(this.css["scarlet-btn"]);
      this.connectToProxyBtn.current.classList.add(this.css["grey-btn"]);

      this.connectToProxyBtn.current.innerHTML = this.state.connectText[
        this.state.region
      ];

      proxySettings.connected = false;
      localStorage.setItem("proxySettings", JSON.stringify(proxySettings));
    } else {
      this.connectToProxyBtn.current.innerHTML = this.state.connectingText[
        this.state.region
      ];

      this.connectToProxy(proxySettings);

      this.connectToProxyBtn.current.classList.remove(this.css["grey-btn"]);
      this.connectToProxyBtn.current.classList.add(this.css["scarlet-btn"]);

      this.connectToProxyBtn.current.innerHTML = this.state.disconnectText[
        this.state.region
      ];

      proxySettings.connected = true;
      localStorage.setItem("proxySettings", JSON.stringify(proxySettings));
    }
  }

  handlePingTest() {
    this.testPingBtn.current.innerHTML = this.state.pingTestingText[
      this.state.region
    ];

    const proxy = {
      host: this.inputProxy.current.value.trim(),
      port: parseInt(this.inputPort.current.value.trim()),
      username: this.inputUsername.current.value.trim(),
      password: this.inputPassword.current.value.trim()
    };

    const testDomain = this.inputDomain.current.value
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

    this.connectToProxy(proxy);

    const proxyURI =
      "http://" +
      (useAuthCredentials ? `${proxy.username}:${proxy.password}@` : "") +
      `${proxy.host}:${proxy.port}`;

    console.log("Making request with proxy:", proxyURI);
    console.log("Destination URL:", testDomain);

    const startTime = Date.now();

    const successFn = function(response) {
      this.ping.current.value = `${Date.now() - startTime} ms`;

      console.log(`Got ping: ${this.ping.current.value}`);

      return response.text();
    };
    const nextFn = function(text) {
      console.log("Response:", text);

      this.testPingBtn.current.innerHTML = this.state.pingTestText[
        this.state.region
      ];

      this.disconnectProxy();
    };
    const errorFn = function(err) {
      console.error(err);

      this.testPingBtn.current.innerHTML = this.state.pingTestText[
        this.state.region
      ];
      this.ping.current.value = `TIMEOUT`;

      this.disconnectProxy();
    };

    fetch(`https://cors-anywhere.herokuapp.com/${testDomain}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "omit", // include, *same-origin, omit
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      }
    })
      .then(successFn.bind(this))
      .then(nextFn.bind(this))
      .catch(errorFn.bind(this));
  }

  connectToProxy(proxy) {
    console.log("Connecting to proxy");

    let useAuthCredentials = false;

    if (proxy.username.trim() && proxy.password.trim()) {
      useAuthCredentials = true;
    }

    const config = {
      mode: "fixed_servers",
      rules: {
        singleProxy: {
          scheme: "http",
          host: proxy.host,
          port:
            typeof proxy.port !== "number" ? parseInt(proxy.port) : proxy.port
        },
        bypassList: []
      }
    };

    chrome.proxy.settings.set(
      { value: config, scope: "regular" },
      function() {}
    );
    chrome.proxy.settings.get({ incognito: false }, function(config) {
      console.log(config);
    });

    if (useAuthCredentials) {
      function callback(details) {
        // proxySettings = JSON.parse(localStorage.proxySetting);

        return details.isProxy === !0
          ? {
              authCredentials: {
                username: proxy.username.trim(),
                password: proxy.password.trim()
              }
            }
          : {};
      }

      chrome.webRequest.onAuthRequired.addListener(
        callback,
        { urls: ["<all_urls>"] },
        ["blocking"]
      );
    }
  }

  disconnectProxy() {
    const config = {
      mode: "direct"
    };

    chrome.proxy.settings.set(
      { value: config, scope: "regular" },
      function() {}
    );
    chrome.proxy.settings.get({ incognito: false }, function(config) {
      console.log(config);
    });

    console.info(`Disconnected any active proxy`);
  }

  render() {
    this.css = this.state.themeCSS[this.state.theme];

    return (
      <div className={this.css["container"]}>
        <header>
          <img id={this.css["logo"]} src={Logo} alt="" />

          <div id={this.css["icons"]}>
            <img
              id={this.css["us-flag"]}
              onClick={this.handleRegionChange}
              src={this.state.flags.US}
              alt=""
            />
            <img
              id={this.css["jp-flag"]}
              onClick={this.handleRegionChange}
              src={this.state.flags.JP}
              alt=""
            />

            <img id={this.css["divider"]} src={Divider} alt="" />

            <img
              id={this.css["theme-switcher"]}
              onClick={this.changeTheme}
              src={this.state.theme === "light" ? Moon : Sun}
              alt=""
            />
          </div>
        </header>

        <div className={this.css["form-control-group"]}>
          <div style={{ display: "inline-block", float: "left", width: "74%" }}>
            <label className={this.css["form-label"]} htmlFor="inputProxy">
              {this.state.proxyText[this.state.region]}
            </label>
            <input
              id="inputProxy"
              className={this.css["input"]}
              onChange={e => this.handleProxySettingChange("host", e)}
              ref={this.inputProxy}
              type="text"
            />
          </div>

          <div
            style={{ display: "inline-block", float: "right", width: "24%" }}
          >
            <label className={this.css["form-label"]} htmlFor="inputPort">
              {this.state.portText[this.state.region]}
            </label>
            <input
              id="inputPort"
              className={this.css["input"]}
              onChange={e => this.handleProxySettingChange("port", e)}
              ref={this.inputPort}
              type="text"
            />
          </div>

          <div
            style={{
              display: "inline-block",
              marginTop: "40px",
              float: "left",
              width: "49%"
            }}
          >
            <label className={this.css["form-label"]} htmlFor="inputUsername">
              {this.state.usernameText[this.state.region]}
            </label>
            <input
              id="inputUsername"
              className={this.css["input"]}
              onChange={e => this.handleProxySettingChange("username", e)}
              ref={this.inputUsername}
              type="text"
            />
          </div>

          <div
            style={{
              display: "inline-block",
              marginTop: "40px",
              float: "right",
              width: "49%"
            }}
          >
            <label className={this.css["form-label"]} htmlFor="inputPassword">
              {this.state.passwordText[this.state.region]}
            </label>
            <input
              id="inputPassword"
              className={this.css["input"]}
              onChange={e => this.handleProxySettingChange("password", e)}
              ref={this.inputPassword}
              type="password"
            />
          </div>
        </div>

        <span id={this.css["cb-paste"]}>
          {this.state.pasteText[this.state.region]}
        </span>

        <div className={this.css["form-control-group"]}>
          <div style={{ display: "inline-block", float: "left", width: "74%" }}>
            <label className={this.css["form-label"]} htmlFor="inputDomain">
              {this.state.domainText[this.state.region]}
            </label>
            <input
              id="inputDomain"
              className={this.css["input"]}
              onChange={e => this.handleProxySettingChange("domain", e)}
              type="text"
              ref={this.inputDomain}
              placeholder="kith.com"
            />
          </div>

          <div
            style={{ display: "inline-block", float: "right", width: "24%" }}
          >
            <label className={this.css["form-label"]} htmlFor="inputPing">
              {this.state.pingText[this.state.region]}
            </label>
            <input
              id={this.css["ping"]}
              className={this.css["input"]}
              ref={this.ping}
              type="text"
              value="0 ms"
              disabled
            />
          </div>

          <button
            style={{ marginTop: "15px" }}
            className={[this.css["form-btn"], this.css["blue-btn"]].join(" ")}
            onClick={this.handlePingTest}
            ref={this.testPingBtn}
          >
            {this.state.pingTestText[this.state.region]}
          </button>
          <button
            style={{ marginTop: "16px", marginBottom: "25px" }}
            className={[this.css["form-btn"], this.css["grey-btn"]].join(" ")}
            onClick={this.handleConnectBtnClick}
            ref={this.connectToProxyBtn}
          >
            {this.state.connectText[this.state.region]}
          </button>
        </div>
      </div>
    );
  }
}

export default App;
