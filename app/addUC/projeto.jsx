import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// (importações e início do componente continuam iguais...)

export default function ProjetoTab() {
  const parseNumber = (value: string): number => {
    const parsed = parseFloat(value.replace(",", "."));
    return isNaN(parsed) ? 0 : parsed;
  };

  const calcularMaoDeObra = (): number => {
    const n = parseInt(nModulos.replace(/\./g, ""), 10) || 0;
    if (n === 0) return 0;
    return n < 10 ? 800 : n * 80;
  };

  const formatCurrency = (valor: number | string) => {
    const numero =
      typeof valor === "string"
        ? parseFloat(valor.replace(/\./g, "").replace(",", "."))
        : valor;
    if (isNaN(numero)) return "0,00";
    const partes = numero.toFixed(2).split(".");
    const inteiroComPonto = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${inteiroComPonto},${partes[1]}`;
  };

  const [nModulos, setNModulos] = useState("");
  const [potModulo, setPotModulo] = useState("");
  const [mObra, setMObra] = useState(() => formatCurrency(calcularMaoDeObra()));
  const [mObraFoiEditadaManualmente, setMObraFoiEditadaManualmente] =
    useState(false);
  const [pKit, setPkit] = useState("");
  const [eEnergia, setEEnergia] = useState("");
  const [aImposto, setAImposto] = useState("");
  const [mCa, setMCa] = useState("");
  const [dTotal, setDTotal] = useState("");
  const [pComissao, setPComissao] = useState("");
  const [vExtra, setVExtra] = useState("");
  const [mDesejada, setMDesejada] = useState("");
  const [precoWpManual, setPrecoWpManual] = useState(1);

  useEffect(() => {
    if (!mObraFoiEditadaManualmente) {
      setMObra(formatCurrency(calcularMaoDeObra()));
    }
  }, [nModulos]);

  const [resultado, setResultado] = useState({
    pFotovoltaica: 0,
    pWp: 0,
    pVenda: 0,
    vComissao: 0,
    iTotal: 0,
    cTotal: 0,
    mTotal: 0,
  });

  const calcularPrecoIdealWp = () => {
    const nMod = parseInt(nModulos.replace(/\./g, ""), 10) || 0;
    const pMod = parseNumber(potModulo);
    const maoDeObraNumerico =
      parseFloat(mObra.replace(/\./g, "").replace(",", ".")) || 0;
    const kit = parseFloat(pKit.replace(/\./g, "").replace(",", "."));
    const energia = parseNumber(eEnergia);
    const impostoPerc = parseNumber(aImposto) / 100;
    const ca = parseNumber(mCa);
    const d = parseNumber(dTotal);
    const comissaoPerc = parseNumber(pComissao) / 100;
    const extra = parseNumber(vExtra);
    const margemPerc = parseNumber(mDesejada) / 100;

    const pFotovoltaica = (nMod * pMod) / 1000;
    const pFotovoltaicaW = pFotovoltaica * 1000;
    const custosFixos = kit + maoDeObraNumerico + energia + ca + d + extra;

    if (pFotovoltaicaW === 0) return;

    let pWp = 1;
    let margemObtida = 0;
    let maxIteracoes = 10000;
    let iteracoes = 0;

    while (true) {
      const pVenda = pWp * pFotovoltaicaW;
      const vComissao = comissaoPerc * pVenda;
      const iTotal = impostoPerc * (pVenda - kit);
      const cTotal = custosFixos + vComissao + iTotal;
      margemObtida = (pVenda - cTotal) / pVenda;

      const erro = margemObtida - margemPerc;

      if (Math.abs(erro) < 0.000001 || iteracoes > maxIteracoes) {
        const resultadoFinal = {
          pFotovoltaica,
          pWp,
          pVenda,
          vComissao,
          iTotal,
          cTotal,
          mTotal: margemObtida,
        };

        setResultado(resultadoFinal);
        setPrecoWpManual(pWp);
        break;
      }

      pWp -= erro * 5;
      iteracoes++;
    }
  };

  const maoDeObraCalculada = calcularMaoDeObra();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ justifyContent: "flex-start" }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Simulador de Projeto</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Número de Módulos</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={nModulos}
            onChangeText={(text) => {
              // Remove tudo que não é número
              const somenteNumeros = text.replace(/[^0-9]/g, "");
              // Se vazio, limpa o campo
              if (somenteNumeros === "") {
                setNModulos("");
                return;
              }
              // Limita a 10000 (sem ponto)
              const valorNumerico = parseInt(somenteNumeros, 10);
              if (isNaN(valorNumerico) || valorNumerico > 1000000) {
                return;
              }
              // Formata com ponto como separador de milhar
              const formatado = valorNumerico
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              setNModulos(formatado);
            }}
            maxLength={10}
          />

          <Text style={styles.label}>Potência do Módulo</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputWithSuffix}
              keyboardType="numeric"
              value={potModulo}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, "");
                const value = parseInt(cleaned, 10);
                if (!isNaN(value) && value <= 1000) {
                  setPotModulo(value.toString());
                } else if (cleaned === "") {
                  setPotModulo("");
                }
              }}
              placeholderTextColor="#aaa"
              maxLength={3}
            />
            <Text style={styles.suffix}>W</Text>
          </View>
          
          <Text style={styles.label}>Mão de Obra</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.prefix}>R$</Text>
            <TextInput
              style={styles.inputWithPrefix}
              keyboardType="numeric"
              value={mObra}
              onChangeText={(value) => {
                setMObraFoiEditadaManualmente(true);
                const somenteNumeros = value.replace(/\D/g, "");
                const valorEmReais = (Number(somenteNumeros) / 100).toFixed(2);
                const [inteiro, decimal] = valorEmReais.split(".");
                const inteiroComPonto = inteiro.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  "."
                );
                const formatado = `${inteiroComPonto},${decimal}`;
                setMObra(formatado);
              }}
              placeholder="0,00"
              placeholderTextColor="#aaa"
              maxLength={15}
            />
          </View>

          <Text style={styles.label}>Preço do Kit (R$)</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.prefix}>R$</Text>
            <TextInput
              style={styles.inputWithPrefix}
              keyboardType="numeric"
              value={pKit}
              onChangeText={(value) => {
                const somenteNumeros = value.replace(/\D/g, ""); // remove tudo que não for número
                const valorEmReais = (Number(somenteNumeros) / 100).toFixed(2); // divide por 100 para ter duas casas decimais
                const [inteiro, decimal] = valorEmReais.split(".");

                // adiciona ponto como separador de milhar
                const inteiroComPonto = inteiro.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  "."
                );

                const formatado = `${inteiroComPonto},${decimal}`;
                setPkit(formatado);
              }}
              placeholderTextColor="#aaa"
              maxLength={15}
            />
          </View>

          <Text style={styles.label}>Entrada de Energia (R$)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={eEnergia}
            onChangeText={setEEnergia}
          />

          <Text style={styles.label}>Alíquota de Imposto (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={aImposto}
            onChangeText={setAImposto}
          />

          <Text style={styles.label}>Material CA (R$)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={mCa}
            onChangeText={setMCa}
          />

          <Text style={styles.label}>Deslocamento (R$)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={dTotal}
            onChangeText={setDTotal}
          />

          <Text style={styles.label}>Comissão (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={pComissao}
            onChangeText={setPComissao}
          />

          <Text style={styles.label}>Custos Extras (R$)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={vExtra}
            onChangeText={setVExtra}
          />

          <Text style={styles.label}>Margem Desejada (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={mDesejada}
            onChangeText={setMDesejada}
          />
        </View>

        <TouchableOpacity style={styles.botao} onPress={calcularPrecoIdealWp}>
          <Text style={styles.botaoTexto}>Calcular Preço de Venda</Text>
        </TouchableOpacity>

        <View style={styles.resultadosBox}>
          <Text style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>Potência Fotovoltaica: </Text>
            <Text style={styles.resultadoValor}>
              {resultado.pFotovoltaica.toFixed(2)} kWp
            </Text>
          </Text>

          <Text style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>Preço por Wp: </Text>
            <Text style={styles.resultadoValor}>
              {resultado.pWp.toFixed(6)} R$/Wp
            </Text>
          </Text>

          <Text style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>Valor da Comissão: </Text>
            <Text style={styles.resultadoValor}>
              R$ {resultado.vComissao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </Text>

          <Text style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>Imposto Total: </Text>
            <Text style={styles.resultadoValor}>
              R$ {resultado.iTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </Text>

          <Text style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>Custo Total: </Text>
            <Text style={styles.resultadoValor}>
              R$ {resultado.cTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </Text>

          <Text style={styles.resultadoItem}>
            <Text style={styles.resultadoLabel}>Margem Obtida: </Text>
            <Text style={styles.resultadoValor}>
              {(resultado.mTotal * 100).toFixed(2)}%
            </Text>
          </Text>

          <Text style={[styles.resultadoItem, { textAlign: 'center', marginTop: 8}]}>
            <Text style={[styles.resultadoLabel, { fontSize: 20, fontWeight: 'bold'}]}>Preço de Venda: </Text>
            <Text style={[styles.resultadoValor, { fontSize: 20, fontWeight: 'bold', color: '#07c400' }]}>
              R$ {resultado.pVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
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
  resultadosBox: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 10,
  },
  resultadoItem: {
    marginBottom: 5,
  },
  resultadoLabel: {
    color: "#ccc",
    fontSize: 14,
    fontFamily: "Inter",
  },
  resultadoValor: {
    color: "#00d2ff",
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
  inputWithPrefix: {
    flex: 1,
    paddingVertical: 10,
    color: "#fff",
    fontFamily: "Inter",
    textAlign: "left",
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#444",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#444",
    marginBottom: 12,
  },
  prefix: {
    color: "#ffffff",
    fontFamily: "Inter",
    marginRight: 4,
    fontSize: 16,
  },
  botao: {
    backgroundColor: "#00949A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
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
});
