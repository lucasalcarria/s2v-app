import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTarifaStore } from "@/src/store/tarifaStore";
import { apiFetch } from "../../utils/api";

interface TarifaModalProps {
  visible: boolean;
  onClose: () => void;
  onTarifaCalculated: (valor: string) => void;
}

export function TarifaModal({
  visible,
  onClose,
  onTarifaCalculated,
}: TarifaModalProps) {
  const [tarifaFinal, setTarifaFinal] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    teRaw,
    tusdRaw,
    pis,
    cofins,
    icms,
    setTeRaw,
    setTusdRaw,
    setPis,
    setCofins,
    setIcms,
  } = useTarifaStore();

  const calcularTarifa = async () => {
    setLoading(true);
    try {
      const payload = {
        teNoTax: parseFloat(teRaw.replace(",", ".")) || 0,
        tusdNoTax: parseFloat(tusdRaw.replace(",", ".")) || 0,
        pis: parseFloat(pis.replace(",", ".")) / 100 || 0,
        cofins: parseFloat(cofins.replace(",", ".")) / 100 || 0,
        icms: parseFloat(icms.replace(",", ".")) / 100 || 0,
      };

      const result = await apiFetch<number>("/tariff", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setTarifaFinal(result.toFixed(6));
      onTarifaCalculated(result.toFixed(6));
    } catch (e: any) {
      Alert.alert("Erro", e.message || "Erro ao calcular tarifa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Calcular Tarifa</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>TE sem imposto</Text>
              <View style={styles.currencyInputContainer}>
                <Text style={styles.currencyPrefix}>R$</Text>
                <TextInput
                  style={styles.inputWithPrefix}
                  keyboardType="numeric"
                  placeholder="0,000000"
                  placeholderTextColor="#777"
                  value={teRaw}
                  onChangeText={(text) => {
                    const numeric = text.replace(/\D/g, "");
                    const formatted = (Number(numeric) / 1_000_000)
                      .toFixed(6)
                      .replace(".", ",");
                    setTeRaw(formatted);
                  }}
                  maxLength={9}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>TUSD sem imposto</Text>
              <View style={styles.currencyInputContainer}>
                <Text style={styles.currencyPrefix}>R$</Text>
                <TextInput
                  style={styles.inputWithPrefix}
                  keyboardType="numeric"
                  placeholder="0,000000"
                  placeholderTextColor="#777"
                  value={tusdRaw}
                  onChangeText={(text) => {
                    const numeric = text.replace(/\D/g, "");
                    const formatted = (Number(numeric) / 1_000_000)
                      .toFixed(6)
                      .replace(".", ",");
                    setTusdRaw(formatted);
                  }}
                  maxLength={9}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PIS</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputWithSuffix}
                  keyboardType="numeric"
                  placeholder="00,0000"
                  placeholderTextColor="#777"
                  value={pis}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, "");
                    const valorFormatado = (Number(cleaned) / 10000)
                      .toFixed(4)
                      .replace(".", ",");
                    setPis(cleaned === "" ? "" : valorFormatado);
                  }}
                  maxLength={7}
                />
                <Text style={styles.suffix}>%</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>COFINS</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputWithSuffix}
                  keyboardType="numeric"
                  placeholder="00,0000"
                  placeholderTextColor="#777"
                  value={cofins}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, "");
                    const valorFormatado = (Number(cleaned) / 10000)
                      .toFixed(4)
                      .replace(".", ",");
                    setCofins(cleaned === "" ? "" : valorFormatado);
                  }}
                  maxLength={7}
                />
                <Text style={styles.suffix}>%</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ICMS</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputWithSuffix}
                  keyboardType="numeric"
                  placeholder="00"
                  placeholderTextColor="#777"
                  value={icms}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, ""); // remove não numéricos
                    const value = parseInt(cleaned, 10);
                    if (!isNaN(value) && value <= 100) {
                      setIcms(value.toString());
                    } else if (cleaned === "") {
                      setIcms("");
                    }
                  }}
                  maxLength={3}
                />
                <Text style={styles.suffix}>%</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.calcBtn} onPress={calcularTarifa} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Calcular</Text>
                )}
              </TouchableOpacity>
            </View>

            {tarifaFinal !== "" && (
              <Text style={styles.tarifaText}>
                Tarifa final: R$ {tarifaFinal}
              </Text>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cancelBtn: {
    backgroundColor: "#444",
    flex: 1,
    marginRight: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  calcBtn: {
    backgroundColor: "#00949A",
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 10,
  },
  currencyPrefix: {
    color: "#ccc",
    fontSize: 16,
    marginRight: 6,
  },
  inputWithPrefix: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    paddingVertical: 10,
  },
  tarifaText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 10,
  },
  inputWithSuffix: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    paddingVertical: 10,
  },
  suffix: {
    fontSize: 16,
    color: "#ccc",
    marginLeft: 6,
  },
});