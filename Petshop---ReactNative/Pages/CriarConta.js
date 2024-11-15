import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Modal, Pressable, Text, TextInput, Button, StyleSheet } from 'react-native';
import firebase from './firebase/config';
import MeuCompHeader from '../components/MeuCompHeader';

function CriarConta() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisivel, setModalVisivel] = useState(false);

  const login = () => {
    navigation.navigate('Auth');
  }

  const criarConta = async () => {
    console.log("criarConta");
    let app = firebase.auth();
    
    app.createUserWithEmailAndPassword(username.toString(), password.toString())
      .then(async (userCred) => {
        var user = userCred.user;
        await user.sendEmailVerification();
        setModalVisivel(true);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("$$------>" + errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <MeuCompHeader title="Criar Nova Conta" />
      <Text style={styles.negrito}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Preencha o email"
        value={username}
        onChangeText={setUsername}
      />
      <Text> </Text>
      <Text style={styles.negrito}>Senha:</Text>
      <TextInput
        style={styles.input}
        placeholder="Preencha a senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text> </Text>
      <Button
        title="Criar Conta"
        onPress={() => criarConta()}
        color="#ff97cf"
      />
      <Text> </Text>
      <Button
        title="Login"
        onPress={() => login()}
        color="#ff97cf"
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => {
          setModalVisivel(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Solicitação de criação de conta solicitada. Veja seu email.</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {setModalVisivel(false); navigation.navigate('Auth');}}>
              <Text style={styles.textStyle}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ff97cf',
  },
  negrito: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#000',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CriarConta;
