import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

export interface VLibrasWidgetRef {
  traduzir: (texto: string) => void;
}

export interface VLibrasWidgetProps {
  textoInicial: string;
  onCarregado?: () => void;
  style?: StyleProp<ViewStyle>;
}

const getVLibrasHTML = (textToTranslate: string) => `
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
    #translate-text:active::after {
      opacity: 0.8;
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
    }
  </style>
</head>
<body>
  <div id="loading"><div class="spinner"></div><div class="loading-text">Carregando avatar...</div></div>
  <div vw class="enabled">
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>
  </div>
  <div id="translate-text">${textToTranslate}</div>
  <script>
    window.onerror = function() { return true; };
    window.alert = function() {};
    window.confirm = function() { return true; };
  </script>
  <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
  <script>
    new window.VLibras.Widget('https://vlibras.gov.br/app', {position: 'B'});
    var textToTranslate = document.getElementById('translate-text').textContent;

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
          setTimeout(doTranslate, 2000);
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

const VLibrasWidget = forwardRef<VLibrasWidgetRef, VLibrasWidgetProps>(
  ({ textoInicial, onCarregado, style }, ref) => {
    const webViewRef = useRef<WebView>(null);
    const [webViewReady, setWebViewReady] = useState(false);

    useImperativeHandle(ref, () => ({
      traduzir: (texto: string) => {
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
      }
    }));

    const handleWebViewMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'ready') {
          setWebViewReady(true);
          if (onCarregado) onCarregado();
        }
      } catch (e) {}
    };

    return (
      <View style={[estilos.container, style]}>
        <WebView
          ref={webViewRef}
          style={estilos.webview}
          source={{ html: getVLibrasHTML(textoInicial) }}
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
    );
  }
);

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default VLibrasWidget;
