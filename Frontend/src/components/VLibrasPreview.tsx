import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import type {
  AvatarVLibras,
  OpacidadeVLibras,
  PersonalizacaoVLibras,
} from '../contexts/ConfiguracoesProvider';
import { montarUrlPersonalizacaoVLibras } from '../utils/vlibrasPersonalizacao';
import { getVLibrasHTML } from '../utils/vlibrasHtml';

interface VLibrasPreviewProps {
  personalizacao: PersonalizacaoVLibras;
  avatar: AvatarVLibras;
  opacidade: OpacidadeVLibras;
}

const VLibrasPreview: React.FC<VLibrasPreviewProps> = ({
  personalizacao,
  avatar,
  opacidade,
}) => {
  const html = useMemo(() => {
    const personalizacaoUrl = montarUrlPersonalizacaoVLibras(personalizacao);
    return getVLibrasHTML({
      personalizacaoUrl,
      avatar,
      opacidade,
      mostrarBarraTraducao: false,
    });
  }, [avatar, opacidade, personalizacao]);

  return (
    <WebView
      key={`${avatar}-${opacidade}-${JSON.stringify(personalizacao)}`}
      style={estilos.webview}
      source={{ html }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowsInlineMediaPlayback={true}
      mediaPlaybackRequiresUserAction={false}
      scrollEnabled={false}
      bounces={false}
      originWhitelist={['*']}
      allowsFullscreenVideo={true}
      mixedContentMode="always"
    />
  );
};

const estilos = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default VLibrasPreview;
