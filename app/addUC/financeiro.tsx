import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTarifa } from "../../src/contexts/TarifaContext";

export default function Financeiro() {
  const { state } = useTarifa();
  const { teRaw, tusdRaw, pis, cofins, icms, tarifaFinal } = state;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalhes da Tarifa</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Valores Base</Text>
        <View style={styles.row}>
          <Text style={styles.label}>TE:</Text>
          <Text style={styles.value}>R$ {teRaw}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>TUSD:</Text>
          <Text style={styles.value}>R$ {tusdRaw}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Impostos</Text>
        <View style={styles.row}>
          <Text style={styles.label}>PIS:</Text>
          <Text style={styles.value}>{pis}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>COFINS:</Text>
          <Text style={styles.value}>{cofins}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ICMS:</Text>
          <Text style={styles.value}>{icms}%</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resultado</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Tarifa Final:</Text>
          <Text style={[styles.value, styles.tarifaFinal]}>R$ {tarifaFinal}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  tarifaFinal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00949A",
  },
}); 