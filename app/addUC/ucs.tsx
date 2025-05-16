import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { AddUcModal } from "../../src/components/AddUCmodal"; // ajuste o caminho se necessário
import { useUCStore } from "../../src/store/ucStore"; // hook do store

export default function UcsScreen() {
  const { setConsumoTotal, consumoTotal } = useUCStore(); // Agora pegando também o valor atual
  const [modalVisible, setModalVisible] = useState(false);
  const [ucs, setUcs] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Função para salvar UC
  function salvarUC(data: any) {
    if (editIndex !== null) {
      const novas = [...ucs];
      novas[editIndex] = data;
      setUcs(novas);
    } else {
      setUcs((prev) => [...prev, data]);
    }
    setEditIndex(null);
  }

  // Função para remover UC
  function removerUC(index: number) {
    const novaLista = [...ucs];
    novaLista.splice(index, 1);
    setUcs(novaLista);
  }

  // Função para editar UC
  function editarUC(index: number) {
    setEditIndex(index);
    setModalVisible(true);
  }

  // Efeito para recalcular o consumo total sempre que a lista de UCs mudar
  useEffect(() => {
    const total = ucs.reduce((acc, uc) => {
      const consumosValidos =
        uc.consumos?.filter((val: string) => val !== "") || [];

      const soma = consumosValidos.reduce(
        (acc: number, val: string) => acc + Number(val.replace(/\./g, "")),
        0
      );

      const media =
        consumosValidos.length > 0 ? soma / consumosValidos.length : 0;

      return acc + media;
    }, 0);

    setConsumoTotal(total);
  }, [ucs, setConsumoTotal]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unidades Consumidoras</Text>

      <FlatList
        data={ucs}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => editarUC(index)}>
            <View style={styles.ucCard}>
              <Text style={styles.ucText}>UC: {item.numeroUC}</Text>
              <Text style={styles.ucText}>Tipo: {item.tipoUc}</Text>
              <Text style={styles.ucText}>
                Fornecimento: {item.fornecimento}
              </Text>
              {item.tipoUc === "Geradora" && (
                <Text style={styles.ucText}>
                  Consumo Noturno: {item.consumoNoturno}%
                </Text>
              )}
              <Text style={styles.ucText}>
                Iluminação: R$ {item.iluminacao}
              </Text>
              <Text style={styles.ucText}>
                Consumo Médio:{" "}
                {(() => {
                  const consumosValidos =
                    item.consumos?.filter((val: string) => val !== "") || [];

                  const soma = consumosValidos.reduce(
                    (acc: number, val: string) =>
                      acc + Number(val.replace(/\./g, "")),
                    0
                  );

                  const media =
                    consumosValidos.length > 0
                      ? soma / consumosValidos.length
                      : 0;

                  // Quebra em parte inteira e decimal
                  const [inteira, decimal] = media
                    .toFixed(2) // fixa 2 casas
                    .split(".");

                  // Formata parte inteira com pontos
                  const inteiraFormatada = inteira.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    "."
                  );

                  return `${inteiraFormatada},${decimal}`;
                })()}{" "}
                kWh
              </Text>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removerUC(index)}
              >
                <Text style={styles.removeText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma UC adicionada.</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditIndex(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>Adicionar UC</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <AddUcModal
          handleClose={() => {
            setModalVisible(false);
            setEditIndex(null);
          }}
          onSave={salvarUC}
          initialData={editIndex !== null ? ucs[editIndex] : null}
        />
      </Modal>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Consumo Total:{" "}
          {(() => {
            const [inteira, decimal] = consumoTotal.toFixed(2).split(".");

            const inteiraFormatada = inteira.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              "."
            );

            return `${inteiraFormatada},${decimal}`;
          })()}{" "}
          kWh
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Inter-Bold",
    marginBottom: 20,
    marginTop: 50,
    textAlign: "center",
  },
  ucCard: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  ucText: {
    color: "#fff",
    marginBottom: 4,
    fontFamily: "Inter",
  },
  removeButton: {
    backgroundColor: "#c0392b",
    marginTop: 8,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  removeText: {
    color: "#fff",
    fontFamily: "Inter-Bold",
  },
  addButton: {
    backgroundColor: "#00949A",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 30,
    fontFamily: "Inter",
  },
  totalContainer: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  totalText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
});
