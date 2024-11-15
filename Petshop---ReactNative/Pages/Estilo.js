import { StyleSheet } from 'react-native';

const estilo = StyleSheet.create({
  flatlist: {
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: '#ff97cf', // Rosa claro
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: "100%",
  },
  tableHeader: {
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#cc97cf", // Cor principal (tom de rosa suave)
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: 50,
  },
  tableBottom: {
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#cc97cf", // Cor principal para a parte inferior da tabela
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    height: 20,
    alignSelf: 'stretch',
    paddingTop: 10,
  },
  columnHeader: {
    textAlign: "center",
    alignItems: "center",
  },
  columnHeaderTxt: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  tableRowBlue: {
    textAlign: "center",
    backgroundColor: "#ffcbdb", // Azul claro para as linhas alternadas
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  tableRowWhite: {
    textAlign: "center",
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    backgroundColor: "#fff", // Branco para as linhas alternadas
  },
  columnRowTxt: {
    textAlign: "center",
    justifyContent: "center",
    fontSize: 14,
    color: "#4f2a47", // Cor de texto escuro para contraste
  },
  button: {
    marginTop: 5,
    height: 40,
    width: 250,
    borderRadius: 5,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  containerForm: {
    alignItems: 'center',
  },
  topImage: {
    margin: 5,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#4f2a47", // Cor do título em tom escuro de rosa
  },
  input: {
    marginTop: 10,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    fontSize: 16,
    padding: 10,
    width: 300,
    borderWidth: 1,
    borderColor: '#d1a8d3', // Cor de borda suave rosa
  },
});

export default estilo;
