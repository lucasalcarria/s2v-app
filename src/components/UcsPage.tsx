import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

interface Uc {
  numero: string;
}

interface Props {
  ucs: Uc[];
  onSelectUc: (uc: Uc) => void;
  onAddNew: () => void;
}

export default function UcsPage({ ucs, onSelectUc, onAddNew }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unidades Consumidoras</Text>

      <FlatList
        data={ucs}
        keyExtractor={(item, index) => `${item.numero}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.ucItem}
            onPress={() => onSelectUc(item)}
          >
            <Text style={styles.ucText}>UC: {item.numero}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma UC cadastrada</Text>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={onAddNew}>
        <Text style={styles.addButtonText}>Adicionar UC</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#111111",
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  ucItem: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  ucText: {
    color: "#fff",
    fontSize: 16,
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#00949A",
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
