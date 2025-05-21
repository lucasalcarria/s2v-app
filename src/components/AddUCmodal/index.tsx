 import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { TarifaModal } from "../tarifaModal";
import { useUCStore } from "../../store/ucStore"; // Importando o store
import uuid from 'react-native-uuid';

export function AddUcModal({ handleClose, onSave, initialData }: any) {
  const addUC = useUCStore((state) => state.addUC);
  const updateUC = useUCStore((state) => state.updateUC);
  const id = uuid.v4();
  const [modalVisible, setModalVisible] = useState(false);
  const [numeroUC, setNumeroUC] = useState("");
  const [tipoUc, setTipoUc] = useState("Geradora");
  const [fornecimento, setFornecimento] = useState("Monofásico");
  const [consumoNoturno, setConsumoNoturno] = useState("");
  const [iluminacao, setIluminacao] = useState("");
  const [consumos, setConsumos] = useState(Array(12).fill(""));
  const [tarifaFinal, setTarifaFinal] = useState("");

  useEffect(() => {
    if (initialData) {
      setNumeroUC(initialData.numeroUC || "");
      setTipoUc(initialData.tipoUc || "Geradora");
      setFornecimento(initialData.fornecimento || "Monofásico");
      setConsumoNoturno(initialData.consumoNoturno || "");
      setIluminacao(initialData.iluminacao || "");
      setConsumos(initialData.consumos || Array(12).fill(""));
      setTarifaFinal(initialData.tarifaFinal || "");
    }
  }, [initialData]);

  const replicarConsumo = () => {
    const valor = consumos[0];
    setConsumos(Array(12).fill(valor));
  };

  const limparConsumos = () => {
    setConsumos(Array(12).fill(""));
  };

  const salvar = () => {
    const ucData = {
      id: initialData?.id || uuid.v4(), // Mantém o id existente ou gera novo
      numeroUC,
      tipoUc,
      fornecimento,
      consumoNoturno,
      iluminacao,
      consumos,
      tarifaFinal,
    };

    if (initialData) {
      updateUC(ucData.id, ucData);
    } else {
      addUC(ucData);
    }

    handleClose();
    onSave?.(ucData);
  };

  const renderizarCamposConsumo = () => {
    return [...Array(3)].map((_, linha) => (
      <View key={linha} style={styles.consumoRow}>
        {[...Array(4)].map((_, coluna) => {
          const index = linha * 4 + coluna;
          return (
            <View key={index} style={styles.consumoItem}>
              <Text style={styles.mesLabel}>Mês {index + 1}</Text>
              <TextInput
                style={styles.inputConsumo}
                keyboardType="numeric"
                value={consumos[index]}
                onChangeText={(value) => {
                  const somenteNumeros = value.replace(/\D/g, ""); // remove tudo que não for número
                  const comPonto = somenteNumeros.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    "."
                  ); // adiciona pontos a cada 3 dígitos
                  const novos = [...consumos];
                  novos[index] = comPonto;
                  setConsumos(novos);
                }}
              />
            </View>
          );
        })}
      </View>
    ));
  };

  const Seletores = ({
    label,
    options,
    selected,
    onSelect,
  }: {
    label: string;
    options: string[];
    selected: string;
    onSelect: (val: string) => void;
  }) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.selectorRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.selectorButton,
              selected === opt && styles.selectorSelected,
            ]}
            onPress={() => onSelect(opt)}
          >
            <Text style={styles.selectorText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.modalContent}>
        <ScrollView>
          <TextInput
            style={[styles.input, styles.leftAlign]}
            placeholder="Número da UC"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            maxLength={9}
            value={numeroUC}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, "");
              setNumeroUC(onlyNumbers);
            }}
          />

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Tipo de UC</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}>
                {["Geradora", "Beneficiária"].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.selectorButton,
                      tipoUc === opt && styles.selectorSelected,
                      { marginRight: 8, marginBottom: 8 },
                    ]}
                    onPress={() => setTipoUc(opt)}
                  >
                    <Text style={styles.selectorText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ alignItems: "flex-end" }}>
              <TouchableOpacity
                style={[styles.utilBtn, { backgroundColor: "#70a1d7" }]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.utilBtnText}>Calcular Tarifa</Text>
              </TouchableOpacity>

              {tarifaFinal !== "" && (
                <Text style={[styles.label, { marginTop: 6 }, { fontSize: 12 }]}>
                  Tarifa Final: R$ {parseFloat(tarifaFinal).toFixed(2)}
                </Text>
              )}
              </View>
            </View>
          </View>

          <Seletores
            label="Fornecimento"
            options={["Monofásico", "Bifásico", "Trifásico"]}
            selected={fornecimento}
            onSelect={setFornecimento}
          />

          {tipoUc === "Geradora" && (
            <>
              <Text style={styles.label}>Consumo Noturno</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputWithSuffix}
                  keyboardType="numeric"
                  value={consumoNoturno}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, "");
                    const value = parseInt(cleaned, 10);
                    if (!isNaN(value) && value <= 100) {
                      setConsumoNoturno(value.toString());
                    } else if (cleaned === "") {
                      setConsumoNoturno("");
                    }
                  }}
                  maxLength={3}
                />
                <Text style={styles.suffix}>%</Text>
              </View>
            </>
          )}

          <Text style={styles.label}>Iluminação Pública</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.prefix}>R$</Text>
            <TextInput
              style={styles.inputWithPrefix}
              keyboardType="numeric"
              value={iluminacao}
              onChangeText={(text) => {
                const numeric = text.replace(/\D/g, ""); // remove tudo que não for número
                const formatted = (Number(numeric) / 100)
                  .toFixed(2)
                  .replace(".", ",");
                setIluminacao(formatted);
              }}
              maxLength={6}
            />
          </View>

          <Text style={styles.label}>Consumo Mensal (kWh)</Text>

          <View style={styles.replicarLimparRow}>
            <TouchableOpacity
              style={[styles.utilBtn, styles.btnAzul]}
              onPress={replicarConsumo}
            >
              <Text style={styles.utilBtnAzulText}>Replicar Valor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.utilBtn, styles.btnVermelho]}
              onPress={limparConsumos}
            >
              <Text style={styles.utilBtnVermelhoText}>Limpar Tudo</Text>
            </TouchableOpacity>
          </View>

          {renderizarCamposConsumo()}

          <View style={styles.botoesFooter}>
            <TouchableOpacity style={styles.cancelarBtn} onPress={handleClose}>
              <Text style={styles.utilBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.salvarBtn} onPress={salvar}>
              <Text style={styles.utilBtnText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <TarifaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onTarifaCalculated={(valor) => {
          setTarifaFinal(valor);
          setModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(24,24,24,0.6)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#242424",
    padding: 16,
    borderRadius: 10,
    width: "92%",
    maxHeight: "92%",
  },
  input: {
    backgroundColor: "#323232",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: "#fff",
    marginBottom: 10,
    fontFamily: "Inter",
    textAlign: "center",
  },
  leftAlign: {
    textAlign: "left",
  },
  label: {
    color: "#fff",
    fontFamily: "Inter",
    marginBottom: 6,
  },
  mesLabel: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 4,
    fontSize: 12,
  },
  consumoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  consumoItem: {
    flex: 1,
    marginHorizontal: 2,
    alignItems: "center",
  },
  inputConsumo: {
    backgroundColor: "#323232",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 6,
    color: "#fff",
    fontSize: 13,
    width: "100%",
    textAlign: "center",
    fontFamily: "Inter",
  },
  replicarLimparRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  utilBtn: {
    backgroundColor: "#3a3a3a",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  utilBtnText: {
    color: "#fff",
    fontFamily: "Inter-Bold",
    fontSize: 12,
  },
  botoesFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  cancelarBtn: {
    backgroundColor: "#555",
    flex: 1,
    marginRight: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  salvarBtn: {
    backgroundColor: "#00949A",
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  selectorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectorButton: {
    backgroundColor: "#333",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  selectorSelected: {
    backgroundColor: "#00949A",
  },
  selectorText: {
    color: "#fff",
    fontFamily: "Inter",
    fontSize: 13,
  },
  btnAzul: {
    backgroundColor: "none",
  },
  utilBtnAzulText: {
    color: "#70a1d7",
  },
  btnVermelho: {
    backgroundColor: "none",
  },
  utilBtnVermelhoText: {
    color: "#e74c3c",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#323232",
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  prefix: {
    color: "#ffffff",
    fontFamily: "Inter",
    marginRight: 4,
  },
  suffix: {
    color: "#ffffff",
    fontFamily: "Inter",
    marginLeft: 4,
  },
  inputWithPrefix: {
    flex: 1,
    paddingVertical: 10,
    color: "#fff",
    fontFamily: "Inter",
    textAlign: "left",
  },
  inputWithSuffix: {
    flex: 1,
    paddingVertical: 10,
    color: "#fff",
    fontFamily: "Inter",
    textAlign: "left",
  },
});