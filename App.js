import React, { Component } from "react";
import {
  View,
  Platform,
  TouchableOpacity,
  Linking,
  TextInput,
  ScrollView
} from "react-native";
import {
  Root,
  Container,
  Picker,
  Item,
  Form,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Toast
} from "native-base";
import NfcManager, { Ndef } from "react-native-nfc-manager";

const RtdType = {
  URL: 0,
  TEXT: 1
};

const EVENTS_URL = "http://kschoon.me:8000/api/v1/events/";
const ACCOUNTS_URL = "http://kschoon.me:8000/api/v1/accounts/";

function buildUrlPayload(valueToWrite) {
  return Ndef.encodeMessage([Ndef.uriRecord(valueToWrite)]);
}

function buildTextPayload(valueToWrite) {
  return Ndef.encodeMessage([Ndef.textRecord(valueToWrite)]);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supported: true,
      enabled: false,
      isWriting: false,
      urlToWrite: "https://www.google.com",
      selected: 1,
      rtdType: RtdType.URL,
      parsedText: null,
      tag: {},
      events: []
    };
  }

  async componentDidMount() {
    NfcManager.isSupported().then(supported => {
      this.setState({ supported });
      if (supported) {
        this._startNfc();
      }
    });
    this._startDetection();
    let events = await fetch(EVENTS_URL);
    let response = await events.json();
    console.log(response);
    response.sort((a, b) => a.id - b.id);
    this.setState({ events: response });
  }

  componentWillUnmount() {
    if (this._stateChangedSubscription) {
      this._stateChangedSubscription.remove();
    }
  }

  onValueChange2(value) {
    this.setState({
      selected: value
    });
  }

  render() {
    let {
      events,
      supported,
      enabled,
      tag,
      isWriting,
      urlToWrite,
      parsedText,
      rtdType
    } = this.state;
    let picker_items = undefined;
    if (events) {
      picker_items = events.map(m_event => (
        <Picker.Item label={m_event.name} value={m_event.id} key={m_event.id} />
      ));
    } else {
      const data = [{ name: "test1" }, { name: "test2" }];
      picker_items = data.map(d => (
        <Picker.Item value={d.name} label={d.name} key={d.name} />
      ));
    }

    return (
      <Root>
        <Container>
          <Header />
          <Content>
            <Form>
              <Item picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.selected}
                  onValueChange={this.onValueChange2.bind(this)}
                >
                  {picker_items}
                </Picker>
              </Item>
            </Form>
          </Content>
          <Footer />
        </Container>
      </Root>
    );
  }

  _requestFormat = () => {
    let { isWriting } = this.state;
    if (isWriting) {
      return;
    }

    this.setState({ isWriting: true });
    NfcManager.requestNdefWrite(null, { format: true })
      .then(() => console.log("format completed"))
      .catch(err => console.warn(err))
      .then(() => this.setState({ isWriting: false }));
  };

  _requestNdefWrite = () => {
    let { isWriting, urlToWrite, rtdType } = this.state;
    if (isWriting) {
      return;
    }

    let bytes;

    if (rtdType === RtdType.URL) {
      bytes = buildUrlPayload(urlToWrite);
    } else if (rtdType === RtdType.TEXT) {
      bytes = buildTextPayload(urlToWrite);
    }

    this.setState({ isWriting: true });
    NfcManager.requestNdefWrite(bytes)
      .then(() => console.log("write completed"))
      .catch(err => console.warn(err))
      .then(() => this.setState({ isWriting: false }));
  };

  _cancelNdefWrite = () => {
    this.setState({ isWriting: false });
    NfcManager.cancelNdefWrite()
      .then(() => console.log("write cancelled"))
      .catch(err => console.warn(err));
  };

  _requestAndroidBeam = () => {
    let { isWriting, urlToWrite, rtdType } = this.state;
    if (isWriting) {
      return;
    }

    let bytes;

    if (rtdType === RtdType.URL) {
      bytes = buildUrlPayload(urlToWrite);
    } else if (rtdType === RtdType.TEXT) {
      bytes = buildTextPayload(urlToWrite);
    }

    this.setState({ isWriting: true });
    NfcManager.setNdefPushMessage(bytes)
      .then(() => console.log("beam request completed"))
      .catch(err => console.warn(err));
  };

  _cancelAndroidBeam = () => {
    this.setState({ isWriting: false });
    NfcManager.setNdefPushMessage(null)
      .then(() => console.log("beam cancelled"))
      .catch(err => console.warn(err));
  };

  _startNfc() {
    NfcManager.start({
      onSessionClosedIOS: () => {
        console.log("ios session closed");
      }
    })
      .then(result => {
        console.log("start OK", result);
      })
      .catch(error => {
        console.warn("start fail", error);
        this.setState({ supported: false });
      });

    if (Platform.OS === "android") {
      NfcManager.getLaunchTagEvent()
        .then(tag => {
          console.log("launch tag", tag);
          if (tag) {
            this.setState({ tag });
          }
        })
        .catch(err => {
          console.log(err);
        });
      NfcManager.isEnabled()
        .then(enabled => {
          this.setState({ enabled });
        })
        .catch(err => {
          console.log(err);
        });
      NfcManager.onStateChanged(event => {
        if (event.state === "on") {
          this.setState({ enabled: true });
        } else if (event.state === "off") {
          this.setState({ enabled: false });
        } else if (event.state === "turning_on") {
          // do whatever you want
        } else if (event.state === "turning_off") {
          // do whatever you want
        }
      })
        .then(sub => {
          this._stateChangedSubscription = sub;
          // remember to call this._stateChangedSubscription.remove()
          // when you don't want to listen to this anymore
        })
        .catch(err => {
          console.warn(err);
        });
    }
  }

  _onTagDiscovered = async tag => {
    console.log("Tag Discovered", tag);
    this.setState({ tag });
    let url = this._parseUri(tag);
    if (url) {
      Linking.openURL(url).catch(err => {
        console.warn(err);
      });
    }

    let text = this._parseText(tag);
    try {
      let create_account = await fetch(ACCOUNTS_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: text })
      });

      let insert_account = await fetch(
        EVENTS_URL + this.state.selected + "/accounts/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: text })
        }
      );

      Toast.show({
        text: "Added " + text + " to " + this.state.selected,
        duration: 2000
      });
    } catch (e) {
      await Toast.show({
        text: "Error occurred!",
        buttonText: "Okay"
      });
    }
  };

  _startDetection = () => {
    NfcManager.registerTagEvent(this._onTagDiscovered)
      .then(result => {
        console.log("registerTagEvent OK", result);
      })
      .catch(error => {
        console.warn("registerTagEvent fail", error);
      });
  };

  _clearMessages = () => {
    this.setState({ tag: null });
  };

  _goToNfcSetting = () => {
    if (Platform.OS === "android") {
      NfcManager.goToNfcSetting()
        .then(result => {
          console.log("goToNfcSetting OK", result);
        })
        .catch(error => {
          console.warn("goToNfcSetting fail", error);
        });
    }
  };

  _parseUri = tag => {
    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
        return Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  _parseText = tag => {
    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
        return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  };
}

export default App;
