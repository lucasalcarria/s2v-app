import React, { useState } from 'react';
import { View, StyleSheet, Button, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

export default function PrintTab() {
  const [isProcessing, setIsProcessing] = useState(false);

  // Dimensões A4 em pixels (96dpi)
  const a4WidthPx = 794;

  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            background-color: white !important;
          }
          .a4-page {
            width: 210mm;
            height: 297mm;
            padding: 15mm;
            box-sizing: border-box;
            margin: 0 auto;
            position: relative;
            overflow: hidden;
          }
          .page-content {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .main-content {
            flex: 1;
            border: 12px solid #000000;
          }
          h1 {
            color: #2c3e50;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
            margin-top: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #7f8c8d;
            padding-top: 20px;
          }
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body {
              background: white;
            }
            .a4-page {
              width: 210mm;
              height: 297mm;
              padding: 15mm;
              box-shadow: none;
              margin: 0 auto;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="a4-page">
          <div class="page-content">
            <div class="main-content">
              
              <h1>Relatório Financeiro</h1>
              <p><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>

              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Serviço de Consultoria</td>
                    <td>R$ 1.200,00</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Desenvolvimento de Software</td>
                    <td>R$ 5.400,00</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Manutenção Mensal</td>
                    <td>R$ 800,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="footer">
              <p>Página 1 de 1</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;

  const handlePrint = async () => {
    setIsProcessing(true);
    try {
      await Print.printAsync({
        html: htmlContent,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGeneratePDF = async () => {
    setIsProcessing(true);
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Cálculo de escala para ajustar ao dispositivo
  const windowWidth = Dimensions.get('window').width;
  const scale = (windowWidth - 40) / a4WidthPx; // 20 de padding de cada lado

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        centerContent={true}
      >
        <View style={[styles.previewWrapper, { transform: [{ scale }] }]}>
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            scalesPageToFit={false}
            style={styles.webview}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <Button
          title="Imprimir"
          onPress={handlePrint}
          disabled={isProcessing}
          color="#2E86C1"
        />
        <Button
          title="Gerar PDF"
          onPress={handleGeneratePDF}
          disabled={isProcessing}
          color="#28B463"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewWrapper: {
    width: 794, // Largura A4 em pixels
    height: 1123, // Altura A4 em pixels
    transformOrigin: 'top center',
  },
  webview: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});