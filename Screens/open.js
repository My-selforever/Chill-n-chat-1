import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { Header, Input, Icon } from "react-native-elements";
import DB from "../config";
import firebase from "firebase";
import { RFPercentage } from "react-native-responsive-fontsize";
import { FontAwesome } from "react-native-vector-icons";
import * as Google from "expo-google-app-auth";

export default class Open extends React.Component {
  constructor() {
    super();
    this.state = {
      mail: "",
      password: "",
      cpassword: "",
      username: "",
      modal: false,
    };
  }

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "503403263904-v56cuknlsga34tks9236sea2a09dc7r4.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };
  isUserEqual = (googleUser, firebaseUser) => {
    console.log("in");
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.user.id
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  userExistance = async (gu)=>{
    var ref = await DB.collection('Users').where("user","==",gu.user.email).get()
    if(ref.docs.length !== 0 ){
      this.props.navigation.navigate("Contact",{modal : false});
    }
   else{
    this.props.navigation.navigate("Contact",{modal : true});
   }

  }

  onSignIn = (googleUser) => {
    console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(() => {
            this.userExistance(googleUser)
          })
          .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };

  signup = () => {
    const { mail } = this.state;
    const { password } = this.state;
    const { cpassword } = this.state;
    if (password !== cpassword) {
      Alert.alert("The Passwords do not match");
    } else if (mail && pass) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(mail, pass)
        .then((response) => {
          DB.collection("Users").add({
            mailID: this.state.mail,
            User: this.state.username,
          });
          Alert.alert("Signing you up", "", [
            {
              text: "Great!",
              onPress: () => {
                this.setState({ modal: false, mail: "", password: "" });
              },
            },
          ]);
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    }
  };

  showModal = () => {
    return (
      <Modal visible={this.state.modal} animationType="fade">
        <View style={style.modalcontainer}>
          <Header
            centerComponent={{
              text: "Sign Up",
              style: {
                fontSize: 20,
                color: "#ffffff",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          />
          <ScrollView style={{ width: "100%" }}>
            <KeyboardAvoidingView style={style.modalcontainer}>
              <Input
                placeholder="Email"
                onChangeText={(txt) => {
                  this.setState({
                    mail: txt,
                  });
                }}
                value={this.state.mail}
                keyboardType="email-address"
                style={style.input}
                placeholderTextColor="#878787"
                leftIcon={
                  <Icon
                    name="user"
                    type="font-awesome"
                    color="#000000"
                    size={30}
                  ></Icon>
                }
              ></Input>

              <Input
                placeholder="Display Name"
                onChangeText={(txt) => {
                  this.setState({
                    phone: txt,
                  });
                }}
                value={this.state.phone}
                style={style.input}
                placeholderTextColor="#878787"
                leftIcon={
                  <Icon
                    name="user"
                    type="font-awesome"
                    color="#000000"
                    size={30}
                  ></Icon>
                }
              ></Input>

              <Input
                placeholder="Password"
                onChangeText={(txt) => {
                  this.setState({
                    pass: txt,
                  });
                }}
                value={this.state.pass}
                secureTextEntry={true}
                style={style.input}
                placeholderTextColor="#878787"
                leftIcon={
                  <Icon
                    name="lock-open"
                    type="font-awesome"
                    color="#000000"
                    size={30}
                  ></Icon>
                }
              ></Input>

              <Input
                placeholder="Confirm Password"
                onChangeText={(txt) => {
                  this.setState({
                    cpass: txt,
                  });
                }}
                value={this.state.cpass}
                secureTextEntry={true}
                style={style.input}
                placeholderTextColor="#878787"
                leftIcon={
                  <Icon
                    name="lock"
                    type="font-awesome"
                    color="#000000"
                    size={30}
                  ></Icon>
                }
              ></Input>

              <View style={style.buttons}>
                <TouchableOpacity
                  style={style.sign}
                  onPress={() => {
                    this.signup();
                  }}
                >
                  <Text>Signup</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={style.sign}
                  onPress={() => {
                    this.setState({
                      mail: "",
                      password: "",
                      modalvis: false,
                    });
                  }}
                >
                  <Text>Cancle</Text>
                </TouchableOpacity>
              </View>
              <View></View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  signIn = () => {
    const { mail } = this.state;
    const { password } = this.state;

    if (mail && pass) {
      firebase
        .auth()
        .signInWithEmailAndPassword(mail, pass)
        .then((response) => {
          Alert.alert("Logging you in");
          this.props.navigation.navigate("Contacts", { modal: false });
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    }
  };

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(user!=null){
        console.log(user+"  hhii")
        this.props.navigation.navigate('Contacts',{modal:false})
      }
    })
  }

  render() {
    return (
      <View style={{ backgroundColor: "#9cc2ff", height: "100%" }}>
        <Header
          centerComponent={{
            text: "Welcome",
            style: {
              fontSize: 20,
              color: "#ffffff",
            },
          }}
        />
        <View style={[style.Container, { marginTop: 60 }]}>
          {this.showModal()}

          <Input
            placeholder="Email ID"
            onChangeText={(txt) => {
              this.setState({ mail: txt });
            }}
            leftIcon={
              <Icon
                name="user"
                type="font-awesome"
                color="#000000"
                size={30}
              ></Icon>
            }
            value={this.state.mail}
            style={style.input}
            secureTextEntry={false}
            keyboardType="email-address"
            placeholderTextColor="#878787"
          ></Input>

          <Input
            placeholder="   Password"
            onChangeText={(txt) => {
              this.setState({ pass: txt });
            }}
            leftIcon={
              <Icon
                name="lock"
                type="font-awesome"
                color="#000000"
                size={30}
              ></Icon>
            }
            value={this.state.pass}
            style={style.input}
            secureTextEntry={true}
            placeholderTextColor="#878787"
          ></Input>
          <View style={style.buttons}>
            <TouchableOpacity
              style={style.sign}
              onPress={() => {
                this.signIn();
              }}
            >
              <Text>Signin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={style.sign}
              onPress={() => {
                this.setState({ modalvis: true });
              }}
            >
              <Text>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={style.buttons}>
          <TouchableOpacity
            style={[
              style.sign,
              {
                width: 150,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginTop: 30,
                justifyContent: "center",
                height: 50,
                backgroundColor: "#fb7a27",
              },
            ]}
            onPress={() => {
              this.signInWithGoogleAsync();
            }}
          >
            <FontAwesome
              name="google"
              style={{ marginTop: 0, marginRight: 50, color: "red" }}
              size={30}
            ></FontAwesome>
            <Text style={{ color: "#ffffff" }}>Login With Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  input: {
    width: 200,
    textAlign: "center",
    borderRadius: 5,
  },

  Container: {
    marginTop: 200,
  },

  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  sign: {
    marginHorizontal: 20,
    backgroundColor: "#4285F4",
    height: 30,
    width: 75,
    alignItems: "center",
    borderRadius: 5,
  },

  modalcontainer: {
    marginTop: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9cc2ff",
  },

  santaContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});
