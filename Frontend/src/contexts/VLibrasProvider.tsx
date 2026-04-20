import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useConfiguracoes } from './ConfiguracoesProvider';
import { StyleSheet, View, LayoutRectangle } from 'react-native';
import { WebView } from 'react-native-webview';

// ─── Tipos ───────────────────────────────────────────────
interface VLibrasContextType {
  pronto: boolean;
  visivel: boolean;
  traduzir: (texto: string) => void;
  mostrar: () => void;
  esconder: () => void;
  definirLayout: (layout: LayoutRectangle) => void;
}

// ─── Context ─────────────────────────────────────────────
const VLibrasContext = createContext<VLibrasContextType>({
  pronto: false,
  visivel: false,
  traduzir: () => { },
  mostrar: () => { },
  esconder: () => { },
  definirLayout: () => { },
});

export const useVLibras = () => useContext(VLibrasContext);

// ─── HTML do VLibras (preload sem texto) ─────────────────
const getVLibrasPreloadHTML = () => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>VLibras</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #FFFFFF; overflow: hidden; }
    #loading {
      position: fixed; inset: 0; background: #FFFFFF;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      z-index: 9999; transition: opacity 0.5s;
    }
    #loading.hidden { opacity: 0; pointer-events: none; }
    .spinner {
      width: 50px; height: 50px;
      border: 3px solid rgba(91,164,164,0.15); border-top-color: #5BA4A4;
      border-radius: 50%; animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-text { color: #888; margin-top: 16px; font-size: 14px; }
    #translate-text {
      position: fixed; top: 0; left: 0; right: 0;
      color: #333; font-size: 15px; font-weight: 500; z-index: 2147483646;
      background: #FFFFFF;
      padding: 14px 16px;
      border-bottom: 1px solid #E0E0E0;
      display: flex; align-items: center; gap: 8px;
      cursor: pointer;
      -webkit-user-select: none; user-select: none;
      -webkit-touch-callout: none;
    }
    #translate-text::before {
      content: '';
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #5BA4A4;
      flex-shrink: 0;
    }
    #translate-text::after {
      content: 'Traduzir';
      font-size: 12px; font-weight: 600;
      color: #FFF;
      background: #5BA4A4;
      padding: 6px 12px;
      border-radius: 16px;
      margin-left: auto;
      white-space: nowrap;
    }
    [vw-access-button] { opacity: 0 !important; pointer-events: none !important; }
    div[vw].enabled {
      top: 48px !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100% !important;
      height: calc(100% - 48px) !important;
      margin: 0 !important;
      transform: none !important;
    }
    div[vw].active {
      margin-top: 0 !important;
    }
    [vw-plugin-wrapper].active {
      width: 100% !important;
      height: 100% !important;
      max-width: 100% !important;
      max-height: 100% !important;
      min-height: 100% !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }
    .vpw-settings-btn { display: none !important; }
    .vpw-controls { left: 50% !important; transform: translateX(-50%) !important; }
    .vw-plugin-top-wrapper {
      width: 100% !important;
      height: 100% !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }
    canvas {
      margin: 0 auto !important;
    }
  </style>
</head>
<body>
  <div id="loading"><div class="spinner"></div><div class="loading-text">Carregando avatar...</div></div>
  <div vw class="enabled">
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>
  </div>
  <div id="translate-text"></div>
  <script>
    window.onerror = function() { return true; };
    window.alert = function() {};
    window.confirm = function() { return true; };
  </script>
  <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
  <script>
    new window.VLibras.Widget('https://vlibras.gov.br/app', {position: 'B'});
    var textToTranslate = '';

    function hideLoading() {
      var el = document.getElementById('loading');
      if (el) el.classList.add('hidden');
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
    }

    function isWidgetReady() {
      try {
        return window.plugin && window.plugin.player && 
               document.querySelector('[vw-plugin-wrapper]').classList.contains('active');
      } catch(e) { return false; }
    }

    function doTranslate() {
      var text = textToTranslate.trim();
      if (!text) return;
      var textEl = document.getElementById('translate-text');

      try {
        if (window.plugin && window.plugin.player) {
          window.plugin.player.translate(text);
          return;
        }
      } catch(e) {}

      try {
        if (textEl) {
          textEl.style.webkitUserSelect = 'text';
          textEl.style.userSelect = 'text';
          var range = document.createRange();
          range.selectNodeContents(textEl);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          textEl.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
          setTimeout(function() {
            window.getSelection().removeAllRanges();
            textEl.style.webkitUserSelect = 'none';
            textEl.style.userSelect = 'none';
          }, 200);
        }
      } catch(e) {}
    }

    function startTranslation() {
      var btn = document.querySelector('[vw-access-button]');
      if (btn) {
        btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; btn.click();
        btn.style.opacity = '0'; btn.style.pointerEvents = 'none';
      }
      var attempts = 0;
      var readyCheck = setInterval(function() {
        attempts++;
        if (isWidgetReady()) {
          clearInterval(readyCheck);
          hideLoading();
        } else if (attempts >= 40) {
          clearInterval(readyCheck);
          hideLoading();
        }
      }, 500);
    }

    document.getElementById('translate-text').addEventListener('click', function() {
      doTranslate();
    });

    setTimeout(startTranslation, 2000);
    setTimeout(hideLoading, 25000);
  </script>
</body>
</html>
`;

// ─── Provider ────────────────────────────────────────────
export const VLibrasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [pronto, setPronto] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const { config } = useConfiguracoes();

  const traduzir = useCallback((texto: string) => {
    if (webViewRef.current) {
      const t = texto.replace(/"/g, '\\"').replace(/\n/g, '\\n');
      const js = `
        var textEl = document.getElementById('translate-text');
        if(textEl) textEl.textContent = "${t}";
        textToTranslate = "${t}";
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
    if (pronto && webViewRef.current) {
      let speedValue = 1.0;
      if (config.velocidadeAvatar === 'lenta') speedValue = 0.5;
      else if (config.velocidadeAvatar === 'rapida') speedValue = 1.5;

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
      {/* WebView do VLibras — sempre montada, visibilidade controlada */}
      <View style={webviewPositionStyle} pointerEvents={visivel ? 'auto' : 'none'}>
        <WebView
          ref={webViewRef}
          style={estilos.webview}
          source={{ html: getVLibrasPreloadHTML() }}
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
    </VLibrasContext.Provider>
  );
};

// ─── Estilos ─────────────────────────────────────────────
const estilos = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default VLibrasProvider;
