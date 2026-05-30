import React, { useCallback, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ActivityIndicator, Linking, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import NavegacaoPrincipal from './src/navigation/NavegacaoPrincipal';
import type { RootStackParamList } from './src/navigation/NavegacaoPrincipal';
import { cores } from './src/theme/cores';
import { VLibrasProvider } from './src/contexts/VLibrasProvider';
import { HistoricoFavoritosProvider } from './src/contexts/HistoricoFavoritosProvider';
import { AuthProvider } from './src/contexts/AuthProvider';
import { ConfiguracoesProvider } from './src/contexts/ConfiguracoesProvider';

const navigationRef = createNavigationContainerRef<RootStackParamList>();
const PROCESS_TEXT_URL_PREFIX = 'speak2sign://process-text';

const decodificarParametro = (valor: string) => {
  try {
    return decodeURIComponent(valor.replace(/\+/g, ' '));
  } catch {
    return '';
  }
};

const obterTextoProcessado = (url: string) => {
  if (!url.toLowerCase().startsWith(PROCESS_TEXT_URL_PREFIX)) {
    return null;
  }

  const query = url.split('?')[1];
  if (!query) {
    return null;
  }

  const parametros = query.split('&');

  for (const parametro of parametros) {
    const [chave, ...partesValor] = parametro.split('=');

    if (decodificarParametro(chave) === 'text') {
      const texto = decodificarParametro(partesValor.join('=')).trim();
      return texto || null;
    }
  }

  return null;
};

export default function App() {
  const [fontesCarregadas] = useFonts({
    PlayfairDisplay_700Bold,
  });
  const urlPendenteRef = useRef<string | null>(null);

  const abrirTextoProcessado = useCallback((url: string) => {
    const texto = obterTextoProcessado(url);

    if (!texto) {
      return;
    }

    if (!navigationRef.isReady()) {
      urlPendenteRef.current = url;
      return;
    }

    navigationRef.navigate('ResultadoLibras', {
      texto,
      registrarHistorico: true,
    });
  }, []);

  const abrirUrlPendente = useCallback(() => {
    if (!urlPendenteRef.current) {
      return;
    }

    const url = urlPendenteRef.current;
    urlPendenteRef.current = null;
    abrirTextoProcessado(url);
  }, [abrirTextoProcessado]);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) {
        abrirTextoProcessado(url);
      }
    });

    const assinatura = Linking.addEventListener('url', ({ url }) => {
      abrirTextoProcessado(url);
    });

    return () => {
      assinatura.remove();
    };
  }, [abrirTextoProcessado]);

  if (!fontesCarregadas) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo }}>
        <ActivityIndicator size="large" color={cores.destaque} />
      </View>
    );
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AuthProvider>
        <ConfiguracoesProvider>
          <HistoricoFavoritosProvider>
            <VLibrasProvider>
              <NavigationContainer
                ref={navigationRef}
                onReady={abrirUrlPendente}
                onStateChange={abrirUrlPendente}
              >
                <StatusBar style="dark" />
                <NavegacaoPrincipal />
              </NavigationContainer>
            </VLibrasProvider>
          </HistoricoFavoritosProvider>
        </ConfiguracoesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
