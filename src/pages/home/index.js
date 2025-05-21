import { Text, View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";
import { useFonts } from "expo-font";
import Logo from "@/assets/images/logo.svg";
import { ModalWindow } from "../../components/modal";

export function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeClienteValue, setNomeClienteValue] = useState("");

  const [fontsLoaded] = useFonts({
    "Inter-Bold": require("../../styles/fonts/Inter_24pt-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  function criarProposta() {
    setModalVisible(true);
  }

  function editarProposta() {
    console.log("clique2");
  }

  function apagarProposta() {
    console.log("clique3");
  }

  function imprimirProposta() {
    console.log("clique4");
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
      </View>
      <Text style={styles.title}>Proposta Comercial</Text>
      <TouchableOpacity style={styles.button} onPress={criarProposta}>
        <Text style={styles.buttonText}>Criar Proposta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={editarProposta}>
        <Text style={styles.buttonText}>Editar Proposta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={apagarProposta}>
        <Text style={styles.buttonText}>Apagar Proposta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={imprimirProposta}>
        <Text style={styles.buttonText}>Imprimir Proposta</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalWindow
          nomeCliente={nomeClienteValue}
          setNomeCliente={setNomeClienteValue}
          handleClose={() => setModalVisible(false)}
        />
      </Modal>
      ;
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
    marginBottom: 40,
    marginTop: 30,
  },
  button: {
    backgroundColor: "#00949A",
    width: 240,
    height: 48,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
  },
});
