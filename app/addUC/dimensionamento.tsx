import { useState, useEffect } from "react";
import { View, Text, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useUCStore } from "@/src/store/ucStore";
import styles from '@/src/styles/AppStyles'; 
import NumericInput from '@/src/components/numericInput';

export default function Dimensionamento() {
  const { consumoTotal } = useUCStore();
  const [potenciaModulo, setPotenciaModulo] = useState("610");
  const [HSP, setHSP] = useState("4,0"); // Valor inicial com decimal para indicar que aceita decimais
  const [numModulos, setNumModulos] = useState(0);
  const [geracaoEstimativa, setGeracaoEstimativa] = useState(0);
  const [percentualAbatimento, setPercentualAbatimento] = useState(0);
  const [potenciaFV, setPotenciaFV] = useState(0);

  useEffect(() => {
    // Converter HSP para número, substituindo vírgula por ponto se necessário
    const hspNum = parseFloat(HSP.replace(',', '.'));
    const potenciaModuloNum = parseFloat(potenciaModulo.replace(',', '.'));

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

  const handleHSPChange = (value: string) => {
  // Verifica se o valor é um número válido (incluindo decimais com ponto ou vírgula)
  const isValid = /^[0-9]*[,.]?[0-9]*$/.test(value);
  if (isValid) {
    setHSP(value);
  }
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Dimensionamento do Sistema</Text>

        <View style={styles.totalContainer}>
          <Text style={styles.label}>Soma do Consumo Médio das UC's:</Text>
          <Text style={styles.totalText}>
            {formatarNumero(consumoTotal)} kWh
          </Text>
        </View>

        <NumericInput
          label="Potência do Módulo"
          suffix="W"
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
          placeholder="0"
          maxLength={3}
        />

        <NumericInput
          label="HSP (Horas de Sol Pleno):"
          value={HSP}
          onChangeText={(text) => {
            const somenteNumeros = text.replace(/\D/g, "");
            const formatted = (Number(somenteNumeros)/10).toFixed(1);
            const [inteiro, decimal] = formatted.split(".");
            const formatado = `${inteiro},${decimal}`;
            handleHSPChange(formatado);
          }}
          maxLength={4}
          placeholder="0,0"
        />

        <View style={styles.quadroModulos}>
          <Text style={styles.labelQuadro}>Número estimado de módulos:</Text>
          <Text style={styles.modulosTexto}>{numModulos}</Text>
        </View>

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

