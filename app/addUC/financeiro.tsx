import { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { useUCStore } from "@/src/store/ucStore";
import styles from '@/src/styles/AppStyles';

export default function FaturaSolarScreen() {
  const ucs = useUCStore((state) => state.ucs); // 💡 SEMPRE assim para manter reatividade
  const [escalonamento, setEscalonamento] = useState("45");
  const [valorFioB, setValorFioB] = useState("153,09");

  useEffect(() => {
    console.log("UCs atualizadas:", ucs);
  }, [ucs]);

  const calcularDisponibilidade = (fornecimento: string) => {
    switch (fornecimento) {
      case "Monofásico":
        return 30;
      case "Bifásico":
        return 50;
      case "Trifásico":
        return 100;
      default:
        return 30;
    }
  };

  const calcularMediaConsumo = (uc: any) => {
    const consumosValidos = uc.consumos?.filter((val: string) => val !== "") || [];
    const soma = consumosValidos.reduce(
      (acc: number, val: string) => acc + Number(val.replace(/\./g, "")),
      0
    );
    return consumosValidos.length > 0 ? soma / consumosValidos.length : 0;
  };

  const resultadosGlobais = ucs.reduce(
    (acc, uc) => {
      const mediaConsumo = calcularMediaConsumo(uc);
      const disponibilidade = calcularDisponibilidade(uc.fornecimento);
      const iluminacaoValor = parseFloat(uc.iluminacao);
      const consumoNoturno = uc.consumoNoturno
        ? parseFloat(uc.consumoNoturno) / 100
        : 1;
      const novaMedia = mediaConsumo * consumoNoturno;
      const compensado = novaMedia - disponibilidade 

      const percEscalonamento = parseFloat(escalonamento) / 100;
      const fioBValor = parseFloat(valorFioB.replace(",", ".")) || 0;
      const tarifaFinal = parseFloat(uc.tarifaFinal.replace(",", ".") || "0");

      const valorSemSolar = mediaConsumo * tarifaFinal + iluminacaoValor;
      const valorComSolar = disponibilidade * fioBValor * percEscalonamento;

      const economiaMensal = valorSemSolar - valorComSolar;

      acc.valorMensalSemSolar += valorSemSolar;
      acc.valorMensalComSolar += valorComSolar;
      acc.economiaMensal += economiaMensal;

      return acc;
    },
    { valorMensalSemSolar: 0, valorMensalComSolar: 0, economiaMensal: 0 }
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Cálculo Financeiro</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>% Escalonamento</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={escalonamento}
            onChangeText={(text) => setEscalonamento(text.replace(/[^0-9]/g, ""))}
            placeholder="100"
            maxLength={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Valor Fio B (R$/kWh)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={valorFioB}
            onChangeText={(text) => {
              setValorFioB(text.replace(/[^0-9,]/g, ""));
            }}
            placeholder="0,000"
            maxLength={6}
          />
        </View>

        <View style={styles.consolidatedCard}>
          <Text style={styles.quadroTitle}>Resumo Global</Text>
          <Text style={styles.row}>
            Fatura Mensal SEM Solar: R$ {resultadosGlobais.valorMensalSemSolar.toFixed(2)}
          </Text>
          <Text style={styles.row}>
            Fatura Mensal COM Solar: R$ {resultadosGlobais.valorMensalComSolar.toFixed(2)}
          </Text>
          <Text style={styles.row}>
            Economia Mensal COM Solar: R$ {resultadosGlobais.economiaMensal.toFixed(2)}
          </Text>
          <Text style={styles.row}>
            Fatura Anual SEM Solar: R$ {(resultadosGlobais.valorMensalSemSolar * 12).toFixed(2)}
          </Text>
          <Text style={styles.row}>
            Fatura Anual COM Solar: R$ {(resultadosGlobais.valorMensalComSolar * 12).toFixed(2)}
          </Text>
          <Text style={styles.row}>
            Economia Anual COM Solar: R$ {(resultadosGlobais.economiaMensal * 12).toFixed(2)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}