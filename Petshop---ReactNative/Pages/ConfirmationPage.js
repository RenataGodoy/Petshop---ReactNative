import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ConfirmationPage = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { animalId, animalName, animalSpecies, animalAge, userEmail, procedureType } = route.params; // Recebendo todos os dados

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Confirmação do Agendamento</Text>

        <Text style={styles.detail}>Nome do Animal: {animalName}</Text>
        <Text style={styles.detail}>Espécie: {animalSpecies}</Text>
        <Text style={styles.detail}>Idade: {animalAge}</Text>
        <Text style={styles.detail}>E-mail do Cliente: {userEmail}</Text>
        <Text style={styles.detail}>Procedimento: {procedureType}</Text>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            alert("Agendamento confirmado!");
            navigation.navigate('ChooseTheAnimal'); 
          }}
        >
          <Text style={styles.buttonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4EBE8', // Cor de fundo
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff', // Fundo branco para o card
    padding: 20,
    borderRadius: 10, // Bordas arredondadas
    shadowColor: '#000', // Sombra para dar destaque ao card
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Para funcionar no Android
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3993DD', // Azul escuro
    textAlign: 'center',
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    color: '#30332F', // Cor cinza escuro para o texto
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#E0ACD5', // Rosa claro
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  goBackButton: {
    backgroundColor: '#E0ACD5', // Rosa claro
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#F4EBE8', // Texto branco
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ConfirmationPage;
