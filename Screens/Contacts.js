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



export default class Contacts extends React.Component{
   
    constructor(props){
        super(props)
        this.state = {
            modal : this.props.navigation.getParam('modal')
        }
    }

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
                    <TouchableOpacity style={style.sign} onPress={()=>{
                firebase.auth().signOut()
                this.props.navigation.navigate('Open')
            }}>
                <Text>Logout</Text>
            </TouchableOpacity>
                  </View>
                  <View></View>
                </KeyboardAvoidingView>
              </ScrollView>
            </View>
          </Modal>
        );
      };

    render(){
        return(
            <View>
            <Text style ={{marginTop:100}}>Contacts</Text>
            
            {this.showModal()}
            </View>
        )
    }
}

const style = StyleSheet.create({
    modalcontainer: {
        marginTop: 20,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#9cc2ff",
      },

      sign: {
        marginHorizontal: 20,
        backgroundColor: "#4285F4",
        height: 30,
        width: 75,
        alignItems: "center",
        borderRadius: 5,
      },
})