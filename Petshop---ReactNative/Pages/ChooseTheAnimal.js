import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import firebase from './firebase/config';
import { useNavigation } from '@react-navigation/native';

const ChooseTheAnimal = () => {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [idade, setIdade] = useState('');
  const [raca, setRaca] = useState('');
  const [animais, setAnimais] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingAnimalId, setEditingAnimalId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigation = useNavigation();

  const handleSaveAnimal = async () => {
    try {
      const userId = firebase.auth().currentUser?.uid;
      if (!userId) {
        alert("Usuário não autenticado");
        return;
      }
      const db = firebase.database();

      if (editingAnimalId) {
        await db.ref(`usuarios/${userId}/animais/${editingAnimalId}`).update({
          nome,
          especie,
          idade,
          raca,
        });
        alert('Animal editado com sucesso!');
      } else {
        const newAnimalRef = db.ref(`usuarios/${userId}/animais`).push();
        await newAnimalRef.set({
          nome,
          especie,
          idade,
          raca,
        });
        alert('Animal cadastrado com sucesso!');
      }

      setNome('');
      setEspecie('');
      setIdade('');
      setRaca('');
      fetchAnimais();
      setFormVisible(false);
      setEditingAnimalId(null);
    } catch (error) {
      console.error("Erro ao salvar o animal: ", error);
      alert("Erro ao salvar o animal. Tente novamente.");
    }
  };

  const fetchAnimais = async () => {
    try {
      const userId = firebase.auth().currentUser?.uid;
      if (!userId) {
        alert("Usuário não autenticado");
        return;
      }
      const db = firebase.database();
      const snapshot = await db.ref(`usuarios/${userId}/animais`).once('value');

      const animaisData = [];
      snapshot.forEach((childSnapshot) => {
        animaisData.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      setAnimais(animaisData);
    } catch (error) {
      console.error("Erro ao buscar os animais: ", error);
      alert("Erro ao buscar os animais. Tente novamente.");
    }
  };

  const handleDeleteAnimal = (animalId) => {
    if (confirm('Você quer mesmo deletar esse animal?')) {
      try {
        const userId = firebase.auth().currentUser?.uid;
        if (!userId) {
          alert("Usuário não autenticado");
          return;
        }

        const db = firebase.database();
        const animalRef = db.ref(`usuarios/${userId}/animais/${animalId}`);
        animalRef.remove();

        fetchAnimais();
        alert("Animal excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir o animal: ", error);
        alert("Erro ao excluir o animal. Tente novamente." + error);
      }
    }
  };

  const handleEditAnimal = (animal) => {
    setNome(animal.nome);
    setEspecie(animal.especie);
    setIdade(animal.idade);
    setRaca(animal.raca);
    setEditingAnimalId(animal.id);
    setFormVisible(true);
  };

  const handleSelectAnimal = (animal) => {
    const userEmail = firebase.auth().currentUser?.email;
  
    navigation.navigate('ChooseTheProcedure', { 
      animalId: animal.id, 
      animalName: animal.nome, 
      animalSpecies: animal.especie, 
      animalAge: animal.idade, 
      animalBreed: animal.raca,
      userEmail
    });
  };

  const filteredAnimais = animais.filter((animal) => {
    return (
      animal.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.raca.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    fetchAnimais();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animais</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setFormVisible(!formVisible)} 
      >
        <Text style={styles.buttonText}>
          {formVisible ? "Fechar Formulário" : "Cadastro de Animal"}
        </Text>
      </TouchableOpacity>

      {formVisible && (
        <>
          <Text style={styles.label}>Cadastro de Animal</Text>
          <TextInput
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
          <TextInput
            placeholder="Espécie (ex: Cachorro, Gato, etc.)"
            value={especie}
            onChangeText={setEspecie}
            style={styles.input}
          />
          <TextInput
            placeholder="Idade"
            value={idade}
            onChangeText={setIdade}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Raça"
            value={raca}
            onChangeText={setRaca}
            style={styles.input}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveAnimal}>
            <Text style={styles.saveButtonText}>{editingAnimalId ? "Editar Animal" : "Salvar Animal"}</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.subtitle}>Meus animais</Text>

      <TextInput
        placeholder="Buscar animal"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredAnimais}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectAnimal(item)} style={styles.animalItem}>
            <Text style={styles.animalText}>Nome: {item.nome}</Text>
            <Text style={styles.animalText}>Espécie: {item.especie}</Text>
            <Text style={styles.animalText}>Idade: {item.idade}</Text>
            <Text style={styles.animalText}>Raça: {item.raca}</Text>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEditAnimal(item)} style={styles.editButton}>
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteAnimal(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={styles.button}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
    color: '#3993DD',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3993DD',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: '#3993DD',
  },
  input: {
    borderWidth: 1,
    borderColor: '#29E7CD',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#F4EBE8',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#29E7CD',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#F4EBE8',
  },
  button: {
    backgroundColor: '#E0ACD5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#F4EBE8',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#E0ACD5',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#F4EBE8',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  animalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#29E7CD',
    marginBottom: 10,
    backgroundColor: '#F4EBE8',
    borderRadius: 5,
  },
  animalText: {
    color: '#30332F',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#E0ACD5',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#30332F',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF5C5C',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#F4EBE8',
    fontWeight: 'bold',
  },
});

export default ChooseTheAnimal;
