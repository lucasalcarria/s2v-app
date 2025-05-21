import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal } from "react-native";
import { useUCStore } from "@/src/store/ucStore"; 
import { AddUcModal } from "@/src/components/AddUCmodal"; 
import styles from "@/src/styles/AppStyles"; 

export default function UcsScreen() {
  const { setConsumoTotal, consumoTotal } = useUCStore(); 
  const [modalVisible, setModalVisible] = useState(false);
  const [ucs, setUcs] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

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

  function removerUC(index: number) {
    const novaLista = [...ucs];
    novaLista.splice(index, 1);
    setUcs(novaLista);
  }

  function editarUC(index: number) {
    setEditIndex(index);
    setModalVisible(true);
  }

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

                  const [inteira, decimal] = media.toFixed(2).split(".");

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
