import { useMemo } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BotaoVoltar from '../../../components/BotaoVoltar';
import type { Cores } from '../../../theme/cores';
import { useCores } from '../../../theme/useCores';
import { VisualizacaoReconhecimentoLibras } from '../camera';

export const TelaReconhecimentoLibras = () => {
  const { cores, estaEscuro, fatorFonte } = useCores();
  const theme = cores;
  const fontScale = fatorFonte;
  const styles = useMemo(
    () => createStyles(theme, fontScale),
    [fontScale, theme],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar
        backgroundColor={theme.fundo}
        barStyle={estaEscuro ? 'light-content' : 'dark-content'}
      />
      <View style={styles.header}>
        <BotaoVoltar comFundo />
        <View style={styles.headerText}>
          <Text style={styles.title}>Reconhecer letras</Text>
          <Text style={styles.subtitle}>Libras em tempo real</Text>
        </View>
      </View>
      <View style={styles.content}>
        <VisualizacaoReconhecimentoLibras fontScale={fontScale} theme={theme} />
      </View>
    </SafeAreaView>
  );
};

const createStyles = (
  theme: Cores,
  fontScale: number,
) => StyleSheet.create({
  container: {
    backgroundColor: theme.fundo,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: theme.textoPrincipal,
    fontSize: Math.round(22 * fontScale),
    fontWeight: '800',
  },
  subtitle: {
    color: theme.textoSecundario,
    fontSize: Math.round(13 * fontScale),
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
