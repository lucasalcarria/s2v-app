import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import styles from '@/src/styles/AppStyles'; 
import NumericInput from '@/src/components/numericInput';

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
  const [potModulo, setPotModulo] = useState("610");
  const [mObra, setMObra] = useState(() => formatCurrency(calcularMaoDeObra()));
  const [mObraFoiEditadaManualmente, setMObraFoiEditadaManualmente] =
    useState(false);
  const [pKit, setPkit] = useState("");
  const [eEnergia, setEEnergia] = useState("");
  const [aImposto, setAImposto] = useState("");
  const [mCa, setMCa] = useState("800,00");
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

        <NumericInput
          label="Número de Módulos"
          value={nModulos}
          onChangeText={(text) => {
              const somenteNumeros = text.replace(/[^0-9]/g, "");
              if (somenteNumeros === "") {
                setNModulos("");
                return;
              }
              const valorNumerico = parseInt(somenteNumeros, 10);
              if (isNaN(valorNumerico) || valorNumerico > 1000000) {
                return;
              }
              const formatado = valorNumerico
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              setNModulos(formatado);
            }}
            maxLength={10}
          placeholder="0"
        />

        <NumericInput
          label="Potência do Módulo"
          suffix="W"
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
          placeholder="0"
          maxLength={3}
        />

        <NumericInput
          label="Mão de Obra"
          prefix="R$"
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
          maxLength={15}
        />

        <NumericInput
          label="Preço do Kit"
          prefix="R$"
          value={pKit}
          onChangeText={(value) => {
                const somenteNumeros = value.replace(/\D/g, "");
                const valorEmReais = (Number(somenteNumeros) / 100).toFixed(2);
                const [inteiro, decimal] = valorEmReais.split(".");
                const inteiroComPonto = inteiro.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  "."
                );
                const formatado = `${inteiroComPonto},${decimal}`;
                setPkit(formatado);
              }}
          placeholder="0,00"
          maxLength={15}
        />

        <NumericInput
          label="Entrada de Energia"
          prefix="R$"
          value={eEnergia}
          onChangeText={(value) => {
                const somenteNumeros = value.replace(/\D/g, "");
                const valorEmReais = (Number(somenteNumeros) / 100).toFixed(2);
                const [inteiro, decimal] = valorEmReais.split(".");
                const inteiroComPonto = inteiro.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  "."
                );
                const formatado = `${inteiroComPonto},${decimal}`;
                setEEnergia(formatado);
              }}
          placeholder="0,00"
          maxLength={15}
        />

        <NumericInput
          label="Alíquota de Imposto"
          suffix="%"
          value={aImposto}
          onChangeText={(text) => {
                const numeric = text.replace(/\D/g, ""); // remove tudo que não for número
                const formatted = (Number(numeric) / 100)
                  .toFixed(2)
                  .replace(".", ",");
                setAImposto(formatted);
              }}
          placeholder="0,00"
          maxLength={5}
        />

        <NumericInput
          label="Material CA"
          prefix="R$"
          value={mCa}
          onChangeText={(value) => {
                const somenteNumeros = value.replace(/\D/g, "");
                const valorEmReais = (Number(somenteNumeros) / 100).toFixed(2);
                const [inteiro, decimal] = valorEmReais.split(".");
                const inteiroComPonto = inteiro.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  "."
                );
                const formatado = `${inteiroComPonto},${decimal}`;
                setMCa(formatado);
              }}
          placeholder="0,00"
          maxLength={15}
        />

        <NumericInput
          label="Deslocamento"
          prefix="R$"
          value={dTotal}
          onChangeText={(value) => {
                const somenteNumeros = value.replace(/\D/g, "");
                const valorEmReais = (Number(somenteNumeros) / 100).toFixed(2);
                const [inteiro, decimal] = valorEmReais.split(".");
                const inteiroComPonto = inteiro.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  "."
                );
                const formatado = `${inteiroComPonto},${decimal}`;
                setDTotal(formatado);
              }}
          placeholder="0,00"
          maxLength={15}
        />

        <NumericInput
          label="Comissão"
          suffix="%"
          value={pComissao}
          onChangeText={(text) => {
                const numeric = text.replace(/\D/g, ""); // remove tudo que não for número
                const formatted = (Number(numeric) / 100)
                  .toFixed(2)
                  .replace(".", ",");
                setPComissao(formatted);
              }}
          placeholder="0,00"
          maxLength={5}
        />

        <NumericInput
          label="Custos Extras"
          prefix="R$"
          value={vExtra}
          onChangeText={(value) => {
                const somenteNumeros = value.replace(/\D/g, "");
                const valorEmReais = (Number(somenteNumeros) / 100).toFixed(2);
                const [inteiro, decimal] = valorEmReais.split(".");
                const inteiroComPonto = inteiro.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  "."
                );
                const formatado = `${inteiroComPonto},${decimal}`;
                setVExtra(formatado);
              }}
          placeholder="0,00"
          maxLength={15}
        />

        <NumericInput
          label="Margem Desejada"
          suffix="%"
          value={mDesejada}
          onChangeText={(text) => {
                const numeric = text.replace(/\D/g, ""); // remove tudo que não for número
                const formatted = (Number(numeric) / 100)
                  .toFixed(2)
                  .replace(".", ",");
                setMDesejada(formatted);
              }}
          placeholder="0,00"
          maxLength={5}
        />

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
