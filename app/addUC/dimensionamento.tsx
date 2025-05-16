import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useUCStore } from "../../src/store/ucStore";

export default function Dimensionamento() {
  const { consumoTotal } = useUCStore();
  const [potenciaModulo, setPotenciaModulo] = useState("610");
  const [HSP, setHSP] = useState("4");
  const [numModulos, setNumModulos] = useState(0);
  const [geracaoEstimativa, setGeracaoEstimativa] = useState(0);
  const [percentualAbatimento, setPercentualAbatimento] = useState(0);
  const [potenciaFV, setPotenciaFV] = useState(0);

  useEffect(() => {
    const hspNum = parseFloat(HSP);
    const potenciaModuloNum = parseFloat(potenciaModulo);

    if (
      !consumoTotal ||
      consumoTotal === 0 ||
      isNaN(hspNum) ||
      hspNum <= 0 ||
      isNaN(potenciaModuloNum) ||
      potenciaModuloNum <= 0
    ) {
      setNumModulos(0);
      setGeracaoEstimativa(0);
      setPercentualAbatimento(0);
      setPotenciaFV(0);
      return;
    }

    const potenciaSistema = consumoTotal / (hspNum * 30);
    const num = (potenciaSistema * 1000) / potenciaModuloNum;
    const numModulosCalculado = Math.round(num);

    const potenciaFVCalculada =
      (numModulosCalculado * potenciaModuloNum) / 1000;
    const geracao = potenciaFVCalculada * hspNum * 30;
    const percentual = (geracao / consumoTotal) * 100;

    setNumModulos(numModulosCalculado);
    setPotenciaFV(potenciaFVCalculada);
    setGeracaoEstimativa(geracao);
    setPercentualAbatimento(percentual);
  }, [potenciaModulo, HSP, consumoTotal]);

  const formatarNumero = (valor: number) => {
    const [inteira, decimal] = valor.toFixed(2).split(".");
    const inteiraFormatada = inteira.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${inteiraFormatada},${decimal}`;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Dimensionamento do Sistema</Text>

        {/* Soma do Consumo Médio */}
        <View style={styles.totalContainer}>
          <Text style={styles.label}>Soma do Consumo Médio das UC's:</Text>
          <Text style={styles.totalText}>
            {formatarNumero(consumoTotal)} kWh
          </Text>
        </View>

        <Text style={styles.label}>Potência de cada Módulo</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputWithSuffix}
            keyboardType="numeric"
            value={potenciaModulo}
            onChangeText={(text) => {
              const cleaned = text.replace(/[^0-9]/g, "");
              const value = parseInt(cleaned, 10);
              if (!isNaN(value) && value <= 1000) {
                setPotenciaModulo(value.toString());
              } else if (cleaned === "") {
                setPotenciaModulo("");
              }
            }}
            placeholderTextColor="#aaa"
            maxLength={3}
          />
          <Text style={styles.suffix}>W</Text>
        </View>

        {/* Entrada de Horas de Sol Pleno */}
        <View style={styles.card}>
          <Text style={styles.label}>HSP (Horas de Sol Pleno):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={HSP}
            onChangeText={setHSP}
          />
        </View>

        {/* Número de Módulos */}
        <View style={styles.quadroModulos}>
          <Text style={styles.labelQuadro}>Número estimado de módulos:</Text>
          <Text style={styles.modulosTexto}>{numModulos}</Text>
        </View>

        {/* Resultados */}
        <View style={styles.resultadosBox}>
          <View style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>
              Potência Fotovoltaica estimada:
            </Text>
            <Text style={styles.resultadoValor}>
              {formatarNumero(potenciaFV)} kWp
            </Text>
          </View>

          <View style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>Geração estimada mensal:</Text>
            <Text style={styles.resultadoValor}>
              {formatarNumero(geracaoEstimativa)} kWh
            </Text>
          </View>

          <View style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>Percentual de abatimento:</Text>
            <Text style={styles.resultadoValor}>
              {percentualAbatimento.toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: "flex-start",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Inter-Bold",
    marginBottom: 20,
    marginTop: 50,
    textAlign: "center",
  },
  totalContainer: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  totalText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  label: {
    color: "#ccc",
    fontFamily: "Inter",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#444",
  },
  quadroModulos: {
    backgroundColor: "#222",
    borderColor: "#00d2ff",
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  labelQuadro: {
    color: "#ccc",
    fontFamily: "Inter",
    fontSize: 16,
    marginBottom: 8,
  },
  modulosTexto: {
    color: "#00d2ff",
    fontSize: 32,
    fontFamily: "Inter-Bold",
  },
  resultadosBox: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 10,
  },
  resultadoItem: {
    marginBottom: 8,
  },
  resultadoLabel: {
    color: "#ccc",
    fontSize: 14,
    fontFamily: "Inter",
    marginBottom: 4,
  },
  resultadoValor: {
    color: "#00d2ff",
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
  inputWithSuffix: {
    flex: 1,
    paddingVertical: 10,
    color: "#fff",
    fontFamily: "Inter",
    textAlign: "left",
    fontSize: 16,
  },
  suffix: {
    color: "#ffffff",
    fontFamily: "Inter",
    marginLeft: 4,
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 10,
  },
});
