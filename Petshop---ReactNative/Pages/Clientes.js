import { useEffect, useState, BackHandler } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import firebase from './firebase/config';

function Clientes() {
  const navigation = useNavigation();
  const [carregarPagina, setCarregarPagina] = useState(true);
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [clientes, setClientes] = useState([]);

  const colunas = [
    { nome: ' ', tam: '10%' },
    { nome: 'Nome', tam: '30%' },
    { nome: 'Nome do Animal', tam: '25%' },
    { nome: 'Procedimentos', tam: '35%' },
  ];

  const [direcao, setDirecao] = useState('desc');
  const [colunaSelecionada, setColunaSelecionada] = useState('Email');
  const [regSelecionado, setRegSelecionado] = useState(null);
  const dbRef = firebase.database().ref();

  const obterClientes = async () => {
    try {
      setCarregandoDados(true);
      let lstClientes = [];

      const usuariosSnapshot = await dbRef.child('usuarios').get();

      if (usuariosSnapshot.exists()) {
        const promises = [];

        usuariosSnapshot.forEach((userSnapshot) => {
          const userId = userSnapshot.key;
          const userEmail = userSnapshot.val().email;
          const emailSimplificado = userEmail.split('@')[0];

          const animaisRef = dbRef.child(`usuarios/${userId}/animais`);
          promises.push(
            animaisRef.get().then((animaisSnapshot) => {
              if (animaisSnapshot.exists()) {
                animaisSnapshot.forEach((animalSnapshot) => {
                  const animalNome = animalSnapshot.val().nome || 'Nome não encontrado';
                  const procedimentos = animalSnapshot.val().procedimento;
                  const procedimentosList = procedimentos
                    ? Object.values(procedimentos).join(', ')
                    : 'Nenhum';

                  lstClientes.push({
                    email: emailSimplificado,
                    nomeAnimal: animalNome,
                    procedimentos: procedimentosList,
                  });
                });
              }
            })
          );
        });

        await Promise.all(promises);
        setClientes(lstClientes);
      }
    } catch (error) {
      console.log('Erro ao buscar dados: ', error);
    } finally {
      setCarregandoDados(false);
    }
  };

  const excluirCliente = async () => {
    try {
      if (regSelecionado == null) {
        alert('Nenhum item selecionado para exclusão');
        return;
      }
      setCarregandoDados(true);
      const ref = dbRef.child('usuarios').child(regSelecionado);
      ref.remove((error) => {
        if (error) {
          console.log('Erro ao excluir: ', error);
        } else {
          console.log('Cliente excluído com sucesso');
        }
        obterClientes();
        setRegSelecionado(null);
      });
    } catch (error) {
      console.error('Erro: ', error);
    } finally {
      setCarregandoDados(false);
    }
  };

  const sortTable = (coluna) => {
    const novaDirecao = direcao === 'desc' ? 'asc' : 'desc';
    const sortedData = _.orderBy(clientes, coluna, novaDirecao);
    setColunaSelecionada(coluna);
    setDirecao(novaDirecao);
    setClientes(sortedData);
  };

  useEffect(() => {
    obterClientes();
    navigation.addListener('focus', () => setCarregarPagina(!carregarPagina));
  }, [carregarPagina, navigation]);

  const tableHeader = () => (
    <View style={estilo.tableHeader}>
      {colunas.map((coluna, index) => (
        <TouchableOpacity
          key={index}
          style={{ ...estilo.columnHeader, width: coluna.tam }}
          onPress={() => sortTable(coluna.nome)}>
          <Text style={estilo.columnHeaderTxt}>
            {coluna.nome + ' '}
            {colunaSelecionada === coluna.nome && (
              <MaterialCommunityIcons
                name={
                  direcao === 'desc'
                    ? 'arrow-down-drop-circle'
                    : 'arrow-up-drop-circle'
                }
              />
            )}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={estilo.container}>
      <FlatList
        data={clientes}
        style={estilo.flatlist}
        keyExtractor={(item, index) => index + ''}
        ListHeaderComponent={tableHeader}
        stickyHeaderIndices={[0]}
        renderItem={({ item, index }) => {
          return (
            <View
              style={
                index % 2 === 1 ? estilo.tableRowBlue : estilo.tableRowWhite
              }>
              <RadioButton
                style={{ ...estilo.columnRowTxt, width: '10%' }}
                value={item.email}
                status={regSelecionado === item.email ? 'checked' : 'unchecked'}
                onPress={() => setRegSelecionado(item.email)}
              />
              <Text style={{ ...estilo.columnRowTxt, width: '30%' }}>
                {item.email}
              </Text>
              <Text style={{ ...estilo.columnRowTxt, width: '30%' }}>
                {item.nomeAnimal}
              </Text>
              <Text style={{ ...estilo.columnRowTxt, width: '30%' }}>
                {item.procedimentos}
              </Text>
            </View>
          );
        }}
      />
      {carregandoDados ? <ActivityIndicator /> : ''}
      <StatusBar style={estilo.tableBottom} />
      <TouchableOpacity
        style={estilo.button}
        onPress={() => {
          navigation.navigate('FormDeCliente', { operacao: 'incluir' });
        }}>
        <Text style={estilo.buttonText}>Incluir</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={estilo.button}
        onPress={() => {
          if (regSelecionado == null)
            alert('Nenhum item selecionado para alteração');
          else
            navigation.navigate('FormDeCliente', {
              operacao: 'alterar',
              email: regSelecionado,
            });
        }}>
        <Text style={estilo.buttonText}>Alterar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={estilo.button} onPress={() => excluirCliente()}>
        <Text style={estilo.buttonText}>Excluir</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={estilo.button}
        onPress={() => BackHandler.exitApp()}>
        <Text style={estilo.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilo = {
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F4EBE8', // Fundo bege
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
    backgroundColor: '#E0ACD5', // Cor principal
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  procedureText: {
    color: '#F4EBE8',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF87CF', // Cor dos botões
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0ACD5', // Rosa forte no título das tabelas
    paddingVertical: 10,
  },
  columnHeader: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnHeaderTxt: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  tableRowWhite: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableRowBlue: {
    backgroundColor: '#E6F7FF',
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  columnRowTxt: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  flatlist: {
    marginTop: 20,
  },
  tableBottom: {
    backgroundColor: '#3993DD',
    height: 10,
  },
};

export default Clientes;
