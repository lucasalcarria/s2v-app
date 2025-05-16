import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";

export function ModalWindow({ setNomeCliente, nomeCliente, handleClose }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Nome do Cliente</Text>
        <TextInput
          style={styles.input}
          value={nomeCliente}
          onChangeText={setNomeCliente}
          placeholder="Digite o nome..."
          placeholderTextColor="#AAA"
        />
        <View style={styles.buttonArea}>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSave]}
            onPress={() => {
              handleClose();
              router.push("/addUC");
            }}
          >
            <Text style={styles.buttonText}>Avançar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(24,24,24,0.6)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    backgroundColor: "#242424",
    width: "85%",
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    marginBottom: 24,
    color: "#FFFFFF",
    fontFamily: "Inter-Bold",
  },
  input: {
    backgroundColor: "#323232",
    width: "90%",
    padding: 14,
    borderRadius: 8,
    color: "#FFFFFF",
    fontFamily: "Inter",
  },
  buttonArea: {
    flexDirection: "row",
    width: "90%",
    marginTop: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
    padding: 12,
  },
  buttonSave: {
    backgroundColor: "#00949A",
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "Inter-Bold",
  },
});
