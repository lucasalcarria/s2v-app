import { StyleSheet } from "react-native";
import { Colors } from "./Colors";

const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 50,
  }, 
  totalContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  resultadosBox: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.backgroundSecondary,
    marginTop: 10,
  },
  consolidatedCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.backgroundSecondary,
    marginTop: 20,
  },
  quadroModulos: {
    backgroundColor: Colors.backgroundInput,
    borderColor: Colors.accent,
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },

  // Titles & Headings
  title: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontFamily: "Inter-Bold",
    marginBottom: 20,
    marginTop: 50,
    textAlign: "center",
  },
  quadroTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontFamily: "Inter-Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  totalText: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },

  // Cards & Boxes
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.backgroundSecondary,
  },
  ucCard: {
    backgroundColor: Colors.backgroundInput,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },

  // Labels & Texts
  label: {
    color: Colors.textSecondary,
    fontFamily: "Inter",
    fontSize: 14,
    marginBottom: 8,
  },
  labelQuadro: {
    color: Colors.textSecondary,
    fontFamily: "Inter",
    fontSize: 16,
    marginBottom: 8,
  },
  ucText: {
    color: Colors.textPrimary,
    marginBottom: 4,
    fontFamily: "Inter",
  },
  emptyText: {
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 30,
    fontFamily: "Inter",
  },
  resultadoItem: {
    marginBottom: 8,
  },
  resultadoLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter",
    marginBottom: 4,
  },
  resultadoValor: {
    color: Colors.accent,
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
  modulosTexto: {
    color: Colors.accent,
    fontSize: 32,
    fontFamily: "Inter-Bold",
  },
  cellTitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter",
  },
  cell: {
    color: Colors.accent,
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },

  // Inputs & Wrappers
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.backgroundInput,
    color: Colors.textPrimary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.backgroundSecondary,
    marginBottom: 10,
  },
  inputWithAffix: {
    flex: 1,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontFamily: "Inter",
    textAlign: "left",
    fontSize: 16,
  },
  affix: {
    color: Colors.textPrimary,
    fontFamily: "Inter",
    marginRight: 4,
    fontSize: 16,
  },

  // Buttons
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  botao: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  botaoTexto: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  removeButton: {
    backgroundColor: Colors.danger,
    marginTop: 8,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  removeText: {
    color: Colors.textPrimary,
    fontFamily: "Inter-Bold",
  },

  // Layout Helpers
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  webviewContainer: {
    width: '90%',
    aspectRatio: 210 / 297,
    alignSelf: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundSecondary,
  },

  webview: {
    flex: 1,
  },


  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderColor: Colors.borderDark,
  },
});

export default styles;