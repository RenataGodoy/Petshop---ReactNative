import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import firebase from './firebase/config'; 

const ChooseTheProcedure = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { animalId, animalName, animalSpecies, animalAge, animalBreed,  userEmail} = route.params; // Agora recebendo também a idade do animal

  // Função para navegação para a tela de confirmação
  const handleProcedureSelect = async (procedureType) => {
    const userId = firebase.auth().currentUser?.uid;
    console.log('User ID:', userId); // Depuração do userId

    if (!userId) {
      alert("Usuário não autenticado");
      return;
    }

    const db = firebase.database();

    if (animalId) {
      // Atualizar procedimento de um animal existente
      const animalRef = db.ref(`usuarios/${userId}/animais/${animalId}`);

      // Obter os procedimentos atuais
      animalRef.once('value', async (snapshot) => {
        const currentProcedures = snapshot.val()?.procedimento || [];

        // Verificar se o procedimento já foi adicionado para evitar duplicação
        if (!currentProcedures.includes(procedureType)) {
          // Adiciona o novo procedimento ao array existente
          const updatedProcedures = [...currentProcedures, procedureType];

          // Atualiza o animal com o novo array de procedimentos
          await animalRef.update({
            procedimento: updatedProcedures,
          });
          alert('Procedimento selecionado com sucesso!');
        } else {
          alert('Este procedimento já foi adicionado.');
        }
      });
    } else {
      // Adicionar procedimento a um novo animal (caso não exista)
      const newAnimalRef = db.ref(`usuarios/${userId}/animais`).push();
      await newAnimalRef.set({
        procedimento: [procedureType], // Cria o array com o primeiro procedimento
      });
      alert('Procedimento adicionado com sucesso!');
    }

    // Navegar para a tela de confirmação com os dados atualizados
    navigation.navigate('ConfirmationPage', {
      animalId,
      animalName,
      animalSpecies,
      animalAge,
      animalBreed,
      userEmail,
      procedureType, 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha o Procedimento para o Animal</Text>

      {/* Seção de Cuidados de Petshop */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuidados de Petshop</Text>
        <TouchableOpacity 
          style={styles.procedureButton} 
          onPress={() => handleProcedureSelect('Limpeza de Ouvido')}>
          <Text style={styles.procedureText}>Limpeza de Ouvido</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.procedureButton} 
          onPress={() => handleProcedureSelect('Tosa Higienica')}>
          <Text style={styles.procedureText}>Tosa Higiênica</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.procedureButton} 
          onPress={() => handleProcedureSelect('Hidratação')}>
          <Text style={styles.procedureText}>Hidratação</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.procedureButton} 
          onPress={() => handleProcedureSelect('Banho')}>
          <Text style={styles.procedureText}>Banho</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.procedureButton} 
          onPress={() => handleProcedureSelect('Corte de Unha')}>
          <Text style={styles.procedureText}>Corte de Unha</Text>
        </TouchableOpacity>
      </View>

      {/* Seção de Cuidados Veterinários */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuidados Veterinários</Text>
        <TouchableOpacity 
          style={styles.procedureButton} 
          onPress={() => handleProcedureSelect('Castracao')}>
          <Text style={styles.procedureText}>Castração</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.procedureButton} 
          onPress={() => handleProcedureSelect('Cirurgia')}>
          <Text style={styles.procedureText}>Cirurgia</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.procedureButton} 
          onPress={() => handleProcedureSelect('Limpeza')}>
          <Text style={styles.procedureText}>Limpeza</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.procedureButton} 
          onPress={() => handleProcedureSelect('RaioX')}>
          <Text style={styles.procedureText}>Raio X</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.procedureButton} 
          onPress={() => handleProcedureSelect('Vacinação')}>
          <Text style={styles.procedureText}>Vacinação</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4EBE8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3993DD',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3993DD',
    textAlign: 'center',
    marginBottom: 10,
  },
  procedureButton: {
    backgroundColor: '#E0ACD5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  procedureText: {
    color: '#F4EBE8',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ChooseTheProcedure;
