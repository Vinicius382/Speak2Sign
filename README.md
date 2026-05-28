<p align="center">
  <img src="Frontend/assets/icon.png" alt="Logo do Speak2Sign" width="130" />
</p>

<h1 align="center">Speak2Sign</h1>

<p align="center">
  Aplicativo mobile para apoiar a comunicação entre pessoas surdas, pessoas ouvintes e usuários interessados em acessar sinais em Libras a partir de mensagens em português.
</p>

<p align="center">
  <a href="#sobre-o-projeto">Sobre</a> •
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#arquitetura">Arquitetura</a> •
  <a href="#execucao-local">Execução local</a> •
  <a href="#api-backend">API</a> •
  <a href="#qualidade-e-validacao">Qualidade</a>
</p>

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/status-em%20desenvolvimento-555555" />
  <img alt="Frontend" src="https://img.shields.io/badge/frontend-Expo%20%2B%20React%20Native-555555" />
  <img alt="Backend" src="https://img.shields.io/badge/backend-Spring%20Boot-555555" />
  <img alt="Database" src="https://img.shields.io/badge/database-PostgreSQL-555555" />
  <img alt="Language" src="https://img.shields.io/badge/language-TypeScript%20%7C%20Java-555555" />
</p>

---

## Sobre o projeto

O **Speak2Sign** é um aplicativo mobile desenvolvido para facilitar o acesso a sinais em Libras a partir de mensagens em português. O usuário pode digitar uma mensagem, falar uma mensagem para que ela seja transcrita ou selecionar uma palavra no dicionário interno do aplicativo. Em seguida, o texto é encaminhado para uma tela de resultado, onde o avatar do VLibras realiza a sinalização.

O projeto é dividido em duas partes principais:

| Camada | Descrição |
| --- | --- |
| Frontend | Aplicativo mobile desenvolvido com Expo, React Native e TypeScript. |
| Backend | API REST desenvolvida com Java, Spring Boot, JPA e PostgreSQL. |

> [!NOTE]
> Este README descreve o estado atual do projeto e reúne instruções de instalação, execução, configuração, organização de pastas, fluxos principais e pontos de manutenção.

---

## Contextualização do problema

A comunicação entre pessoas surdas e pessoas ouvintes ainda enfrenta barreiras no cotidiano, especialmente em situações em que uma das partes não domina Libras. Essa dificuldade pode aparecer em ambientes educacionais, familiares, profissionais, comerciais e de atendimento ao público.

A ausência de uma forma simples de apoio à comunicação pode causar:

- perda de autonomia para pessoas surdas;
- maior dependência de terceiros para interpretar mensagens;
- dificuldade de acesso a informações básicas;
- redução da inclusão em serviços e interações sociais;
- limitação no aprendizado inicial de sinais comuns.

O Speak2Sign surge como uma proposta de apoio, oferecendo uma interface simples para converter mensagens em português para uma representação visual em Libras por meio do avatar do VLibras.

---

## Objetivos

### Objetivo geral

Desenvolver um aplicativo mobile que permita ao usuário inserir mensagens por texto ou voz e visualizar a sinalização correspondente em Libras, além de consultar palavras organizadas em um dicionário por categorias.

### Objetivos específicos

- Permitir entrada de texto digitado.
- Permitir entrada por fala usando reconhecimento de voz.
- Exibir o resultado em Libras com o widget VLibras incorporado ao aplicativo.
- Registrar traduções no histórico local.
- Permitir favoritar mensagens relevantes.
- Oferecer um dicionário de Libras dividido por categorias.
- Permitir uso com ou sem conta, preservando dados locais no dispositivo.
- Sincronizar histórico e favoritos com o backend quando houver usuário logado e sincronização ativada.
- Disponibilizar recursos de configuração, como tema, tamanho da fonte, velocidade do avatar e sincronização.

---

## Público-alvo

O aplicativo foi pensado para:

| Público | Necessidade atendida |
| --- | --- |
| Pessoas ouvintes | Apoio para se comunicar melhor com pessoas surdas. |
| Pessoas surdas | Apoio visual em interações em que o outro usuário utiliza português escrito ou falado. |
| Estudantes de Libras | Consulta rápida de palavras e sinais básicos. |
| Instituições de ensino | Apoio em contextos introdutórios de acessibilidade e inclusão. |
| Ambientes de atendimento | Apoio em comunicações simples e objetivas. |

> [!IMPORTANT]
> O Speak2Sign é uma ferramenta de apoio à comunicação. Ele não substitui intérpretes profissionais de Libras em contextos formais, técnicos, jurídicos, médicos ou educacionais especializados.

---

## Funcionalidades

### Resumo das funcionalidades

| Funcionalidade | Status | Descrição |
| --- | --- | --- |
| Cadastro de usuário | Implementado | Permite criar uma conta com nome, e-mail e senha. |
| Login | Implementado | Permite autenticar um usuário cadastrado. |
| Recuperação de senha | Implementado | Envia código de recuperação por e-mail e permite redefinir senha. |
| Tradução por texto | Implementado | O usuário digita uma mensagem e envia para a tela de Libras. |
| Tradução por voz | Implementado | O usuário fala, o app transcreve e envia o texto para Libras. |
| Resultado em Libras | Implementado | Exibe o avatar do VLibras dentro de uma WebView. |
| Histórico | Implementado | Armazena traduções realizadas no dispositivo e, quando configurado, no backend. |
| Favoritos | Implementado | Permite salvar mensagens importantes para acesso posterior. |
| Dicionário de Libras | Implementado | Lista palavras por categorias e abre o sinal correspondente no VLibras. |
| Configurações | Implementado | Permite ajustar tema, fonte, velocidade do avatar e sincronização. |
| Sincronização | Implementado | Sincroniza histórico e favoritos quando há usuário logado e opção ativada. |
| API de ping | Implementado | Endpoint simples para verificar se a API está online. |

---

## Arquitetura

O projeto utiliza uma arquitetura separada entre aplicativo mobile, API backend, banco de dados e serviços externos.


### Responsabilidades por camada

| Camada | Responsabilidades |
| --- | --- |
| Aplicativo mobile | Interface do usuário, entrada por texto, entrada por voz, histórico local, favoritos, dicionário, configurações e exibição do VLibras. |
| WebView VLibras | Carregamento do widget VLibras e execução da sinalização do texto recebido. |
| AsyncStorage | Persistência local de usuário, configurações, histórico e favoritos. |
| API backend | Cadastro, login, recuperação de senha, perfil, histórico e favoritos remotos. |
| PostgreSQL | Persistência dos dados de usuários, histórico e favoritos. |
| Gmail API | Envio de e-mails para recuperação de senha. |

---

## Tecnologias utilizadas

### Frontend

| Tecnologia | Uso no projeto |
| --- | --- |
| Expo | Base de execução e configuração do app mobile. |
| React Native | Construção das telas e componentes nativos. |
| TypeScript | Tipagem estática do frontend. |
| React Navigation | Navegação entre telas. |
| Axios | Comunicação HTTP com a API backend. |
| AsyncStorage | Persistência local de usuário, configurações, histórico e favoritos. |
| React Native WebView | Renderização do widget VLibras dentro do app. |
| expo-speech-recognition | Reconhecimento de fala em português brasileiro. |
| Expo Vector Icons | Ícones das telas, cards, botões e dicionário. |
| Expo Google Fonts | Carregamento de fontes usadas na interface. |

### Backend

| Tecnologia | Uso no projeto |
| --- | --- |
| Java 17 | Linguagem base do backend. |
| Spring Boot | Estrutura principal da API. |
| Spring Web MVC | Criação dos controllers REST. |
| Spring Data JPA | Persistência e acesso ao banco de dados. |
| Bean Validation | Validação de dados recebidos nos DTOs. |
| PostgreSQL Driver | Integração com banco PostgreSQL. |
| BCrypt | Hash de senhas. |
| Springdoc OpenAPI | Documentação da API. |
| Jakarta Mail e Angus Mail | Base para envio de e-mail. |
| Gmail API | Envio de códigos de recuperação de senha. |
| Thymeleaf | Suporte a templates no backend. |
| Maven | Gerenciamento de dependências e build. |

### Versões principais

| Área | Versão identificada |
| --- | --- |
| Expo | 55.0.15 |
| React | 19.2.0 |
| React Native | 0.83.4 |
| TypeScript | 5.9.2 |
| Spring Boot | 4.0.3 |
| Java | 17 |

> [!NOTE]
> As versões acima refletem as dependências declaradas no projeto. Ao atualizar qualquer uma delas, valide o app em dispositivo físico ou emulador, principalmente por causa do uso de WebView e reconhecimento de fala.

---

## Organização do repositório

Estrutura principal do projeto:

```text
Speak2Sign/
├── Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/speak2sign/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── exception/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   └── Speak2SignApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── Frontend/
    ├── App.tsx
    ├── app.json
    ├── eas.json
    ├── index.ts
    ├── package.json
    ├── scripts/
    │   └── start-expo-dev.js
    └── src/
        ├── components/
        ├── contexts/
        ├── data/
        │   └── dicionario.ts
        ├── navigation/
        ├── screens/
        ├── services/
        │   └── api.ts
        └── theme/
```

### Pastas importantes do frontend

| Pasta | Função |
| --- | --- |
| `src/screens` | Telas principais do aplicativo. |
| `src/components` | Componentes reutilizáveis da interface. |
| `src/contexts` | Providers de autenticação, configurações, VLibras, histórico e favoritos. |
| `src/data` | Dados estáticos do aplicativo, como o dicionário de Libras. |
| `src/navigation` | Configuração da navegação principal. |
| `src/services` | Serviços de comunicação com a API. |
| `src/theme` | Cores, temas e regras visuais compartilhadas. |

### Pastas importantes do backend

| Pasta | Função |
| --- | --- |
| `controller` | Endpoints REST da aplicação. |
| `dto` | Objetos de entrada e saída da API. |
| `exception` | Tratamento padronizado de erros. |
| `model` | Entidades persistidas no banco. |
| `repository` | Interfaces de acesso ao banco via JPA. |
| `service` | Regras de negócio da aplicação. |

---

## Módulos do aplicativo

### Autenticação e conta

O aplicativo permite cadastro, login, atualização de perfil, alteração de senha e recuperação de senha por e-mail.

Dados mantidos localmente:

| Chave local | Conteúdo |
| --- | --- |
| `@speak2sign_usuario` | Dados básicos do usuário logado. |
| `@speak2sign_configuracoes` | Preferências do aplicativo. |
| `@speak2sign_historico` | Histórico local de traduções. |
| `@speak2sign_favoritos` | Lista local de favoritos. |

### Tradução por texto

O usuário digita uma mensagem em português. A mensagem é enviada para a tela de resultado, registrada no histórico e encaminhada ao VLibras para sinalização.

Características do fluxo:

- entrada manual de texto;
- navegação para a tela de resultado;
- registro no histórico como tipo `texto`;
- possibilidade de favoritar o resultado.

### Tradução por voz

A tela de fala utiliza reconhecimento de voz em português brasileiro. O texto reconhecido é exibido na tela e pode ser convertido para Libras.

Características do fluxo:

- solicitação de permissão de microfone;
- idioma configurado como `pt-BR`;
- suporte a resultados parciais;
- opção de limpar transcrição;
- registro no histórico como tipo `voz`;
- envio da transcrição final para o VLibras.

> [!IMPORTANT]
> O reconhecimento de fala depende dos recursos disponíveis no dispositivo e dos serviços configurados no sistema operacional. Em Android, o projeto configura o pacote `com.google.android.googlequicksearchbox` como serviço de reconhecimento.

### Resultado em Libras

A tela de resultado posiciona uma área visual para exibir o avatar do VLibras. O `VLibrasProvider` mantém a WebView montada e controla sua visibilidade conforme a tela ativa.

Características do módulo:

- carregamento do script do VLibras dentro de uma WebView;
- controle de exibição do avatar;
- envio de texto para o player do VLibras;
- ajuste de velocidade do avatar com base nas configurações;
- integração com favoritos.

> [!CAUTION]
> Na implementação atual, o widget VLibras é carregado a partir de `https://vlibras.gov.br/app`. Por isso, a sinalização depende da disponibilidade dos recursos do VLibras e da conectividade necessária para carregar esses arquivos.

### Dicionário de Libras

O dicionário permite navegar por categorias e abrir rapidamente uma palavra na tela de resultado em Libras.

Categorias atuais:

| Categoria | Quantidade de sinais |
| --- | ---: |
| Saudações | 9 |
| Sentimentos | 8 |
| Transporte | 7 |
| Esportes e Lazer | 6 |
| Casa e Móveis | 8 |
| Escola e Tecnologia | 8 |
| Vestuário | 7 |
| Alimentos e Bebidas | 8 |
| Animais | 8 |
| Total | 69 |

> [!NOTE]
> O dicionário não possui vídeos próprios nem sinais armazenados localmente. Ele reutiliza o mesmo fluxo de resultado em Libras do restante do aplicativo.

### Histórico

O histórico armazena traduções realizadas pelo usuário.

Cada item possui:

| Campo | Descrição |
| --- | --- |
| `id` | Identificador local do item. |
| `idRemoto` | Identificador do item no backend, quando sincronizado. |
| `tipo` | Origem da tradução: `voz`, `texto` ou `libras`. |
| `texto` | Conteúdo enviado para tradução. |
| `data` | Data formatada para exibição. |

Comportamentos importantes:

- novos itens são salvos localmente imediatamente;
- se houver usuário logado e sincronização ativa, o item também é enviado ao backend;
- quando o backend retorna sucesso, o app salva o `idRemoto` no item local;
- em caso de falha de rede, o item local é preservado;
- ao sincronizar, o app mescla dados locais e remotos.

### Favoritos

Os favoritos permitem salvar mensagens importantes para acesso posterior.

Comportamentos importantes:

- favoritos são identificados por tipo e texto;
- ao adicionar um favorito já existente, o app remove duplicações locais;
- se houver sincronização ativa, o favorito é enviado para a API;
- remoções locais e remotas respeitam a existência de `idRemoto`.

### Configurações

O app possui configurações persistidas no dispositivo.

| Configuração | Valores ou comportamento |
| --- | --- |
| Tema escuro | Ativado ou desativado. |
| Tamanho da fonte | `pequeno`, `medio` ou `grande`. |
| Velocidade do avatar | `lenta`, `normal` ou `rapida`. |
| Sincronização | Controla envio e leitura remota de histórico e favoritos. |

---

## API backend

A API segue o padrão REST e utiliza o prefixo `/api`.

### Endpoints de saúde

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/api/ping` | Verifica se a API está online. |

Resposta esperada:

```text
Speak2Sign API está online
```

### Endpoints de usuário

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/api/usuarios/cadastrar` | Cadastra um novo usuário. |
| `POST` | `/api/usuarios/login` | Realiza login. |
| `POST` | `/api/usuarios/esqueci-senha` | Solicita código de recuperação de senha. |
| `POST` | `/api/usuarios/redefinir-senha` | Redefine a senha usando o código recebido. |
| `PUT` | `/api/usuarios/{id}/atualizar` | Atualiza o nome do usuário. |
| `PUT` | `/api/usuarios/{id}/alterar-senha` | Altera a senha do usuário. |

Exemplo de cadastro:

```http
POST /api/usuarios/cadastrar
Content-Type: application/json

{
  "nome": "Nome do Usuário",
  "email": "usuario@email.com",
  "senha": "senhaSegura"
}
```

Exemplo de resposta:

```json
{
  "id": 1,
  "nome": "Nome do Usuário",
  "email": "usuario@email.com"
}
```

Exemplo de login:

```http
POST /api/usuarios/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "senha": "senhaSegura"
}
```

### Endpoints de histórico

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/api/usuarios/{usuarioId}/historico` | Lista o histórico do usuário. |
| `POST` | `/api/usuarios/{usuarioId}/historico` | Adiciona item ao histórico. |
| `DELETE` | `/api/usuarios/{usuarioId}/historico/{itemId}` | Remove um item do histórico. |
| `DELETE` | `/api/usuarios/{usuarioId}/historico` | Limpa o histórico do usuário. |

Exemplo de criação de histórico:

```http
POST /api/usuarios/1/historico
Content-Type: application/json

{
  "tipo": "texto",
  "texto": "Bom dia"
}
```

### Endpoints de favoritos

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/api/usuarios/{usuarioId}/favoritos` | Lista favoritos do usuário. |
| `POST` | `/api/usuarios/{usuarioId}/favoritos` | Adiciona favorito. |
| `DELETE` | `/api/usuarios/{usuarioId}/favoritos/{itemId}` | Remove favorito. |

Exemplo de criação de favorito:

```http
POST /api/usuarios/1/favoritos
Content-Type: application/json

{
  "tipo": "texto",
  "texto": "Obrigado"
}
```

---

## Execução local

### Pré-requisitos

Antes de executar o projeto, instale:

| Ferramenta | Uso |
| --- | --- |
| Git | Clonar o repositório. |
| Node.js | Executar o frontend. |
| npm | Instalar dependências do frontend. |
| Java 17 | Executar o backend. |
| Maven | Instalar dependências e executar o backend. |
| PostgreSQL | Banco de dados local. |
| Android Studio | Executar em emulador ou dispositivo Android. |
| ADB | Configuração e comunicação com dispositivo Android em desenvolvimento. |

> [!TIP]
> Para desenvolvimento mobile, recomenda-se testar em dispositivo físico ou emulador Android. Algumas funções, como reconhecimento de fala, permissões e WebView, podem se comportar de forma diferente no navegador.

### Clonar o repositório

```bash
git clone https://github.com/Vinicius382/Speak2Sign.git
cd Speak2Sign
```

---

## Configuração do backend

### Criar banco PostgreSQL

Exemplo usando `psql`:

```sql
CREATE DATABASE speak2sign;
```

### Variáveis de ambiente

O backend lê as configurações sensíveis por variáveis de ambiente.

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `DB_URL` | URL JDBC do PostgreSQL. | `jdbc:postgresql://localhost:5432/speak2sign` |
| `DB_USER` | Usuário do banco. | `postgres` |
| `DB_PASSWORD` | Senha do banco. | `postgres` |
| `GMAIL_FROM` | E-mail remetente usado na recuperação de senha. | `seu-email@gmail.com` |
| `GMAIL_CLIENT_ID` | Client ID da aplicação no Google Cloud. | `valor-do-client-id` |
| `GMAIL_CLIENT_SECRET` | Client Secret da aplicação no Google Cloud. | `valor-do-client-secret` |
| `GMAIL_REFRESH_TOKEN` | Refresh token para envio via Gmail API. | `valor-do-refresh-token` |

Exemplo em Linux/macOS:

```bash
export DB_URL="jdbc:postgresql://localhost:5432/speak2sign"
export DB_USER="postgres"
export DB_PASSWORD="postgres"
export GMAIL_FROM="seu-email@gmail.com"
export GMAIL_CLIENT_ID="seu-client-id"
export GMAIL_CLIENT_SECRET="seu-client-secret"
export GMAIL_REFRESH_TOKEN="seu-refresh-token"
```

Exemplo em PowerShell:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/speak2sign"
$env:DB_USER="postgres"
$env:DB_PASSWORD="postgres"
$env:GMAIL_FROM="seu-email@gmail.com"
$env:GMAIL_CLIENT_ID="seu-client-id"
$env:GMAIL_CLIENT_SECRET="seu-client-secret"
$env:GMAIL_REFRESH_TOKEN="seu-refresh-token"
```

> [!WARNING]
> Não versionar senhas, tokens ou credenciais reais. Use variáveis de ambiente ou mecanismos seguros de configuração do ambiente de deploy.

### Instalar dependências e executar

```bash
cd Backend
mvn clean install
mvn spring-boot:run
```

Se o Maven Wrapper estiver disponível no ambiente:

```bash
cd Backend
./mvnw spring-boot:run
```

No Windows:

```powershell
cd Backend
.\mvnw.cmd spring-boot:run
```

### Validar API online

Com o backend rodando:

```bash
curl http://localhost:8080/api/ping
```

Resposta esperada:

```text
Speak2Sign API está online
```

---

## Configuração do frontend

### Instalar dependências

```bash
cd Frontend
npm install
```

### Configurar URL da API

A comunicação com o backend é centralizada em:

```text
Frontend/src/services/api.ts
```

Na configuração atual, a API aponta para:

```ts
baseURL: 'https://speak2sign.onrender.com'
```

Para testar com backend local, altere temporariamente para o endereço local da API.

Exemplo para emulador Android:

```ts
baseURL: 'http://10.0.2.2:8080'
```

Exemplo para dispositivo físico na mesma rede:

```ts
baseURL: 'http://SEU_IP_LOCAL:8080'
```

> [!IMPORTANT]
> Em dispositivo físico, `localhost` aponta para o próprio celular. Use o IP da máquina onde o backend está rodando.

### Executar em modo padrão do Expo

```bash
cd Frontend
npm run start:default
```

### Executar com dev client

O projeto possui script próprio para iniciar o Expo em modo dev client:

```bash
cd Frontend
npm start
```

Esse script usa as variáveis abaixo quando necessário:

| Variável | Descrição | Valor padrão |
| --- | --- | --- |
| `SPEAK2SIGN_DEV_HOST` | IP usado pelo Metro Bundler. | `192.168.15.5` |
| `SPEAK2SIGN_DEV_PORT` | Porta usada pelo Metro Bundler. | `8081` |

Exemplo:

```bash
SPEAK2SIGN_DEV_HOST=192.168.0.20 npm start
```

No PowerShell:

```powershell
$env:SPEAK2SIGN_DEV_HOST="192.168.0.20"
npm start
```

### Executar no Android

```bash
cd Frontend
npm run android
```

### Executar no iOS

```bash
cd Frontend
npm run ios
```

### Executar no navegador

```bash
cd Frontend
npm run web
```

> [!CAUTION]
> A execução web pode não representar fielmente o comportamento final do app, principalmente para reconhecimento de fala, permissões do dispositivo e integração com WebView.

---

## Build mobile

O projeto possui configuração EAS com perfis de desenvolvimento, preview e produção.

### Build Android de preview

```bash
cd Frontend
npx eas build -p android --profile preview
```

O perfil `preview` gera APK para distribuição interna.

### Build de desenvolvimento

```bash
cd Frontend
npx eas build -p android --profile development
```

### Build de produção

```bash
cd Frontend
npx eas build -p android --profile production
```

> [!NOTE]
> Antes de gerar build, confirme se a URL da API está apontando para o ambiente correto e se as permissões de microfone e reconhecimento de fala estão adequadas no `app.json`.

---

## Qualidade e validação

### Frontend

Executar verificação de tipos:

```bash
cd Frontend
npm run typecheck
```

Listar dependências instaladas no nível principal:

```bash
cd Frontend
npm ls --depth=0
```

### Backend

Executar testes:

```bash
cd Backend
mvn test
```

Gerar build:

```bash
cd Backend
mvn clean package
```

### Checklist manual recomendado

Antes de considerar uma entrega estável, validar:

1. Criar conta.
2. Fazer login.
3. Encerrar sessão.
4. Recuperar senha por e-mail.
5. Alterar nome do perfil.
6. Alterar senha.
7. Digitar mensagem e converter para Libras.
8. Falar mensagem e converter para Libras.
9. Validar permissão de microfone negada e concedida.
10. Visualizar resultado no VLibras.
11. Favoritar uma mensagem.
12. Remover favorito.
13. Consultar histórico.
14. Remover item do histórico.
15. Limpar histórico.
16. Abrir dicionário.
17. Trocar categoria no dicionário.
18. Abrir palavra do dicionário no VLibras.
19. Alterar tema.
20. Alterar tamanho da fonte.
21. Alterar velocidade do avatar.
22. Desativar sincronização e confirmar que o app mantém dados locais.
23. Reativar sincronização e confirmar mesclagem de dados.
24. Testar falha de rede sem perda de dados locais.
25. Testar em dispositivo físico Android.

---

## Validações de acessibilidade

O projeto tem foco em acessibilidade comunicacional. Além disso, a interface deve ser validada com atenção a:

| Critério | O que verificar |
| --- | --- |
| Legibilidade | Textos com bom contraste e tamanho ajustável. |
| Navegação | Botões principais visíveis e com área de toque adequada. |
| Feedback visual | Estados de carregamento, erro e sucesso compreensíveis. |
| Permissões | Mensagens claras para uso do microfone. |
| Tema | Funcionamento adequado em tema claro e escuro. |
| Fonte | Interface sem quebra em fonte pequena, média e grande. |
| Libras | Avatar visível, sem cortes e com espaço suficiente na tela. |

> [!TIP]
> Ao ajustar telas, teste sempre com o maior tamanho de fonte disponível nas configurações do app.

---

## Segurança e privacidade

### Dados armazenados

O app pode armazenar no dispositivo:

- dados básicos do usuário logado;
- preferências de configuração;
- histórico de mensagens traduzidas;
- favoritos.

O backend armazena:

- dados de cadastro;
- senha com hash;
- histórico sincronizado;
- favoritos sincronizados;
- tokens ou códigos necessários ao fluxo de recuperação de senha, conforme implementação do backend.

### Boas práticas necessárias

- Não versionar credenciais.
- Não expor tokens em logs.
- Evitar mensagens de erro que revelem detalhes internos.
- Validar dados no backend mesmo que o frontend já valide.
- Revisar permissões de CORS antes de produção.
- Revisar regras de autorização para impedir acesso cruzado entre usuários.
- Garantir que e-mails de recuperação não exponham se uma conta existe ou não.

> [!WARNING]
> Antes de uso em ambiente real, revise autenticação, autorização, CORS, tratamento de erros e configuração de produção. Esses pontos são críticos para proteger dados de usuários.

---

## VLibras

A integração com o VLibras é feita pelo frontend por meio de uma WebView. O app carrega o widget, mantém a WebView controlada por um provider e injeta o texto a ser sinalizado.

### Funcionamento geral


### Pontos de atenção

- O widget é carregado remotamente.
- A WebView precisa permanecer montada para reduzir recarregamentos desnecessários.
- O layout da área do avatar é medido na tela de resultado.
- A velocidade do avatar é ajustada de acordo com a configuração escolhida pelo usuário.
- Textos com caracteres especiais devem ser tratados com cuidado antes de serem injetados no JavaScript da WebView.

> [!IMPORTANT]
> Sempre valide o VLibras com textos contendo acentos, aspas, quebras de linha e caracteres especiais. Esse é um ponto sensível porque o texto é enviado para o contexto JavaScript da WebView.

---

## Dicionário

O dicionário é definido no frontend em:

```text
Frontend/src/data/dicionario.ts
```

Cada categoria possui:

```ts
type CategoriaDicionario = {
  id: CategoriaDicionarioId;
  titulo: string;
  itens: PalavraDicionario[];
};
```

Cada palavra possui:

```ts
type PalavraDicionario = {
  id: string;
  texto: string;
  icone: NomeIconeDicionario;
};
```

### Como adicionar uma nova palavra

1. Abrir `Frontend/src/data/dicionario.ts`.
2. Escolher a categoria correta.
3. Adicionar um novo item no array `itens`.
4. Usar um `id` único.
5. Definir o texto que será enviado ao VLibras.
6. Escolher um ícone válido do MaterialCommunityIcons.

Exemplo:

```ts
{
  id: 'nova-palavra',
  texto: 'Nova palavra',
  icone: 'book-open'
}
```

### Como adicionar uma nova categoria

1. Adicionar o novo identificador em `CategoriaDicionarioId`.
2. Criar um novo objeto dentro de `categoriasDicionario`.
3. Definir `id`, `titulo` e `itens`.
4. Testar a tela do dicionário em fonte normal e grande.

Exemplo:

```ts
{
  id: 'nova-categoria',
  titulo: 'Nova Categoria',
  itens: [
    { id: 'exemplo', texto: 'Exemplo', icone: 'book-open' }
  ]
}
```

---

## Convenções de desenvolvimento

### Nomes de arquivos

- Telas usam o prefixo `Tela`, como `TelaDicionario.tsx`.
- Providers ficam em `src/contexts`.
- Serviços externos ficam em `src/services`.
- Dados estáticos ficam em `src/data`.
- Tipos globais de navegação devem ficar centralizados na navegação principal.

### Organização de commits

Sugestão de formato:

```text
tipo: descrição objetiva da alteração
```

Exemplos:

```text
feat: adiciona categoria de sinais ao dicionário
fix: corrige sincronização de favoritos
refactor: centraliza tipos de navegação
chore: atualiza configuração do Expo
```

Tipos recomendados:

| Tipo | Uso |
| --- | --- |
| `feat` | Nova funcionalidade. |
| `fix` | Correção de erro. |
| `refactor` | Reestruturação sem mudança de comportamento. |
| `style` | Ajustes visuais ou formatação. |
| `docs` | Alterações em documentação. |
| `test` | Testes. |
| `chore` | Tarefas de manutenção. |

---

## Deploy

### Backend

O backend pode ser publicado em serviços compatíveis com aplicações Java/Spring Boot, como Render, Railway, Fly.io, VPS ou serviços equivalentes.

Para produção, configurar:

- `DB_URL`;
- `DB_USER`;
- `DB_PASSWORD`;
- `GMAIL_FROM`;
- `GMAIL_CLIENT_ID`;
- `GMAIL_CLIENT_SECRET`;
- `GMAIL_REFRESH_TOKEN`.

Também é recomendado revisar:

- CORS;
- perfil de produção;
- logs SQL;
- estratégia de migração de banco;
- limites de requisição;
- tempo de expiração de códigos de recuperação;
- tratamento de erros.

### Frontend

Para builds mobile, usar EAS Build.

Perfis disponíveis:

| Perfil | Uso |
| --- | --- |
| `development` | Build com dev client. |
| `preview` | APK interno para testes. |
| `production` | Build de produção. |

Comando de preview:

```bash
cd Frontend
npx eas build -p android --profile preview
```

---

## Roadmap técnico

Esta lista registra melhorias recomendadas para evolução do projeto.

### Segurança

- Substituir sessão baseada apenas em dados locais por autenticação com token.
- Incluir cabeçalho `Authorization` nas rotas protegidas.
- Bloquear acesso cruzado entre usuários.
- Revisar endpoints que recebem `usuarioId` na URL.
- Padronizar respostas de erro sem expor detalhes sensíveis.
- Revisar CORS por ambiente.

### Backend

- Criar perfis separados para `dev`, `test` e `prod`.
- Usar banco de teste isolado.
- Evitar `ddl-auto=update` como padrão de produção.
- Introduzir migrações com ferramenta apropriada.
- Expandir testes de serviço e controller.
- Padronizar logs.

### Frontend

- Remover URL da API hard-coded e usar configuração por ambiente.
- Centralizar tipos de navegação.
- Revisar logs de debug.
- Fortalecer tratamento de caracteres especiais na integração com VLibras.
- Melhorar estados de carregamento e erro nas telas de rede.

### Produto

- Expandir o dicionário com novas categorias.
- Adicionar busca no dicionário, caso o volume de palavras aumente.
- Melhorar feedback visual quando o VLibras estiver carregando.
- Adicionar testes manuais documentados por fluxo.
- Avaliar recursos adicionais de acessibilidade visual.

---

## Solução de problemas

<details>
<summary>O app não conecta ao backend local</summary>

Verifique:

1. Se o backend está rodando.
2. Se `/api/ping` responde no navegador ou via `curl`.
3. Se a `baseURL` em `Frontend/src/services/api.ts` aponta para o endereço correto.
4. Se o celular e o computador estão na mesma rede.
5. Se o firewall permite conexões na porta `8080`.
6. Se, no emulador Android, foi usado `10.0.2.2` em vez de `localhost`.

</details>

<details>
<summary>O reconhecimento de fala não inicia</summary>

Verifique:

1. Se a permissão de microfone foi concedida.
2. Se o dispositivo possui serviço de reconhecimento de fala instalado.
3. Se o idioma do reconhecimento está disponível.
4. Se o app foi executado em ambiente compatível com recursos nativos.
5. Se está sendo usado dispositivo físico ou emulador com suporte adequado.

</details>

<details>
<summary>O VLibras não aparece</summary>

Verifique:

1. Se o dispositivo tem conexão para carregar o script do VLibras.
2. Se a WebView está funcionando corretamente no dispositivo.
3. Se a tela de resultado chamou `mostrar()` no provider.
4. Se o layout do card foi medido corretamente.
5. Se o widget terminou o carregamento antes da tradução.

</details>

<details>
<summary>O histórico ou favoritos não sincronizam</summary>

Verifique:

1. Se há usuário logado.
2. Se a sincronização está ativada nas configurações.
3. Se a API está online.
4. Se os endpoints de histórico e favoritos respondem corretamente.
5. Se o item possui `idRemoto` após ser enviado ao backend.

</details>

<details>
<summary>O backend não inicia por erro de banco</summary>

Verifique:

1. Se o PostgreSQL está rodando.
2. Se o banco foi criado.
3. Se `DB_URL`, `DB_USER` e `DB_PASSWORD` estão corretos.
4. Se o usuário do banco tem permissão no schema.
5. Se a porta do PostgreSQL está acessível.

</details>

<details>
<summary>O envio de e-mail de recuperação falha</summary>

Verifique:

1. Se as variáveis do Gmail estão configuradas.
2. Se o refresh token é válido.
3. Se a aplicação no Google Cloud possui acesso à Gmail API.
4. Se o remetente configurado em `GMAIL_FROM` corresponde à conta autorizada.
5. Se o ambiente de deploy permite requisições externas para a API do Google.

</details>

---

## Contribuição

Para contribuir com o projeto:

1. Criar uma branch a partir da `main`.
2. Implementar uma alteração pequena e bem delimitada.
3. Executar as validações necessárias.
4. Revisar arquivos modificados.
5. Abrir pull request descrevendo objetivo, alterações e testes realizados.

Exemplo:

```bash
git checkout -b feat/nova-categoria-dicionario
```

Antes de abrir pull request, executar:

```bash
cd Frontend
npm run typecheck
```

```bash
cd Backend
mvn test
```

> [!IMPORTANT]
> Evite misturar correções de backend, frontend, layout e refatoração ampla no mesmo pull request. Mudanças menores são mais fáceis de revisar e reduzem risco de regressão.

---

## Equipe

| Nome |
| --- |
| Felipe Magnani Lobo Alvarez Perez |
| Guilerme Oliveira da Silva |
| Juan Pablo Mandarino Riquelme |
| Péterson Libório de Jesus Rocha |
| Vinicius Oliveira Santos |

---
