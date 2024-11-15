import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Modal, Pressable, Text, TextInput, Button, StyleSheet } from 'react-native';
import MeuCompHeader from '../components/MeuCompHeader';
import firebase from './firebase/config';

function Auth() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('renata.godoy@soulasalle.com.br');
  const [password, setPassword] = useState('123456');
  const [textoModal, setTextoModal] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);

  const criarConta = async () => {
    console.log('criarConta')
    navigation.navigate('CriarConta');
  }

  const efetuarLogin = async () => {
    let app = firebase.auth();
    
    let userCredentials = app
      .signInWithEmailAndPassword(username.toString(), password.toString())
      .then( (userCredential) => {
        var user = userCredential.user;
        if(!user.emailVerified) {
          setTextoModal("Email não não verificado. Veja sua caixa e confirme sua conta.");
          setModalVisivel(true);
          return;
        }

        const dbRef = firebase.database().ref();
          
        dbRef.child("usuarios").child(user.uid).get().then((snapshot) => {
          if(snapshot.exists() && snapshot.val().funcao != 'ADMIN') {
            navigation.navigate('ChooseTheAnimal');
          } else {
            setTextoModal("Sua conta ainda não foi liberada por um administrador.");
            setModalVisivel(true);
            dbRef.child("usuarios").child(user.uid).set(
              {"uid" : user.uid, 
              "email": user.email,
              "funcao" : "CLIENTE"}).then((msg) => console.log(msg)); 
          }
        });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setTextoModal("Conta ainda não criada.");
        setModalVisivel(true);
        console.log("#------->" + errorMessage + " " + errorCode);
      }); 
  };

  return (
    <View style={styles.container}>
      <MeuCompHeader title="Login" />
      <Text style={styles.negrito}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Text> </Text>
      <Text style={styles.negrito}>Senha:</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text> </Text>
      <Button
        title="Efetuar Login"
        onPress={() => efetuarLogin()}
        color="#E0ACD5"
      />
      <Text> </Text>
      <Button
        title="Criar Nova Conta"
        onPress={() => criarConta()}
        color="#E0ACD5"
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => {
          setModalVisivel(false);
        }} >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{textoModal}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {setModalVisivel(false); navigation.navigate('Auth');}} >
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
    backgroundColor: '#F4EBE8',
  },
  negrito: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3993DD',
  },
  input: {
    height: 40,
    borderColor: '#29E7CD',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#F4EBE8',
    color: '#30332F',
    fontSize: 16,
  },
  button: {
    borderRadius: 5,
    padding: 15,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: '#F4EBE8',
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

export default Auth;
