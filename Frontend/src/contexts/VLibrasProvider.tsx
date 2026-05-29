import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useConfiguracoes } from './ConfiguracoesProvider';
import { StyleSheet, View, LayoutRectangle } from 'react-native';
import { WebView } from 'react-native-webview';
import { montarUrlPersonalizacaoVLibras } from '../utils/vlibrasPersonalizacao';
import { getVLibrasHTML, obterValorVelocidadeVLibras } from '../utils/vlibrasHtml';

interface VLibrasContextType {
  pronto: boolean;
  visivel: boolean;
  traduzir: (texto: string) => void;
  mostrar: () => void;
  esconder: () => void;
  definirLayout: (layout: LayoutRectangle) => void;
}

const VLibrasContext = createContext<VLibrasContextType>({
  pronto: false,
  visivel: false,
  traduzir: () => { },
  mostrar: () => { },
  esconder: () => { },
  definirLayout: () => { },
});

export const useVLibras = () => useContext(VLibrasContext);

// ─── Provider ────────────────────────────────────────────
export const VLibrasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [pronto, setPronto] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const { config, configuracoesCarregadas } = useConfiguracoes();
  const personalizacaoUrl = useMemo(
    () => montarUrlPersonalizacaoVLibras(config.personalizacaoVLibras),
    [config.revisaoVLibras, configuracoesCarregadas]
  );
  const htmlVLibras = useMemo(
    () => getVLibrasHTML({
      personalizacaoUrl,
      avatar: config.avatarVLibras,
      opacidade: config.opacidadeVLibras,
    }),
    [config.revisaoVLibras, configuracoesCarregadas, personalizacaoUrl]
  );

  const traduzir = useCallback((texto: string) => {
    if (webViewRef.current) {
      const textoJson = JSON.stringify(texto);
      const js = `
        var textEl = document.getElementById('translate-text');
        var novoTexto = ${textoJson};
        if (textEl) textEl.textContent = novoTexto;
        textToTranslate = novoTexto;
        doTranslate();
        true;
      `;
      webViewRef.current.injectJavaScript(js);
    }
  }, []);

  const mostrar = useCallback(() => {
    setVisivel(true);
  }, []);

  const esconder = useCallback(() => {
    setVisivel(false);
    setLayout(null);
  }, []);

  const definirLayout = useCallback((newLayout: LayoutRectangle) => {
    setLayout(newLayout);
  }, []);

  const handleWebViewMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ready') {
        setPronto(true);
      }
      if (data.type === 'log') {
        console.log('[VLibras Webview]:', data.message);
      }
    } catch (e) { }
  }, []);

  useEffect(() => {
    if (configuracoesCarregadas) {
      setPronto(false);
    }
  }, [config.revisaoVLibras, configuracoesCarregadas]);

  useEffect(() => {
    if (pronto && webViewRef.current) {
      const speedValue = obterValorVelocidadeVLibras(config.velocidadeAvatar);

      const js = `
        try {
          if (window.plugin && window.plugin.player) {
            // Algumas versões do VLibras expõem setAvatarSpeed, outras setSpeed no manager.
            // Mandando a mensagem de velocidade para a Unity
            if (typeof window.plugin.player.setAvatarSpeed === 'function') {
              window.plugin.player.setAvatarSpeed(${speedValue});
            } else if (typeof window.plugin.player.setSpeed === 'function') {
              window.plugin.player.setSpeed(${speedValue});
            } else if (window.plugin.player.videoPlayer) {
              window.plugin.player.videoPlayer.playbackRate = ${speedValue};
            }
          }
        } catch (e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', message: 'Erro setSpeed: ' + e.message }));
        }
        true;
      `;
      webViewRef.current.injectJavaScript(js);
    }
  }, [config.velocidadeAvatar, pronto]);

  // Calcula o estilo de posição da WebView baseado no layout informado
  const webviewPositionStyle = visivel && layout
    ? {
      position: 'absolute' as const,
      top: layout.y,
      left: layout.x,
      width: layout.width,
      height: layout.height,
      opacity: 1,
      zIndex: 9999,
      borderRadius: 16,
      overflow: 'hidden' as const,
    }
    : {
      // Escondido mas ativo — fora da tela
      position: 'absolute' as const,
      width: 1,
      height: 1,
      top: -10,
      left: -10,
      opacity: 0,
      zIndex: -1,
    };

  return (
    <VLibrasContext.Provider
      value={{ pronto, visivel, traduzir, mostrar, esconder, definirLayout }}
    >
      {children}
      {configuracoesCarregadas && (
        <View style={webviewPositionStyle} pointerEvents={visivel ? 'auto' : 'none'}>
          <WebView
            key={`vlibras-${config.revisaoVLibras}`}
            ref={webViewRef}
            style={estilos.webview}
            source={{ html: htmlVLibras }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            onMessage={handleWebViewMessage}
            scrollEnabled={false}
            bounces={false}
            originWhitelist={['*']}
            allowsFullscreenVideo={true}
            mixedContentMode="always"
          />
        </View>
      )}
    </VLibrasContext.Provider>
  );
};

const estilos = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default VLibrasProvider;
