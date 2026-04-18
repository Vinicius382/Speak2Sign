package com.speak2sign.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.UserCredentials;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Properties;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${gmail.from}")
    private String emailRemetente;

    @Value("${gmail.client-id}")
    private String clientId;

    @Value("${gmail.client-secret}")
    private String clientSecret;

    @Value("${gmail.refresh-token}")
    private String refreshToken;

    
     //Cria uma instância autenticada do cliente Gmail usando OAuth 2.0.
    private Gmail criarClienteGmail() throws Exception {
        UserCredentials credentials = UserCredentials.newBuilder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRefreshToken(refreshToken)
                .build();

        return new Gmail.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials))
                .setApplicationName("Speak2Sign")
                .build();
    }

    /**
     * Método central de envio de e-mail via Gmail REST API.
     *
     *
     * 1. Monta um MimeMessage via Jakarta Mail (sem conexão SMTP)
     * 2. Codifica a mensagem em Base64 URL-safe
     * 3. Envia via POST HTTPS para a API do Gmail
     */
    private void enviarEmailTemplate(String destinatario, String assunto, String nomeTemplate, Context contexto) throws Exception {
        log.info("Preparando e-mail '{}' para: {} (remetente: {})", assunto, destinatario, emailRemetente);

      
        String conteudoHtml = templateEngine.process(nomeTemplate, contexto);

        Session session = Session.getDefaultInstance(new Properties());
        MimeMessage mimeMessage = new MimeMessage(session);
        mimeMessage.setFrom(new InternetAddress(emailRemetente));
        mimeMessage.setRecipient(jakarta.mail.Message.RecipientType.TO, new InternetAddress(destinatario));
        mimeMessage.setSubject(assunto, "UTF-8");
        mimeMessage.setContent(conteudoHtml, "text/html; charset=UTF-8");

        //Codificar em Base64 URL-safe
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        mimeMessage.writeTo(buffer);
        String encodedEmail = Base64.getUrlEncoder().encodeToString(buffer.toByteArray());

        Message message = new Message();
        message.setRaw(encodedEmail);

        Gmail gmail = criarClienteGmail();
        gmail.users().messages().send("me", message).execute();

        log.info("E-mail '{}' enviado com SUCESSO para: {}", assunto, destinatario);
    }

    @Async
    public void enviarEmailCadastro(String destinatario, String nome) {
        try {
            String assunto = "Bem Vindo(a) ao Speak2Sign";

            Context contexto = new Context();
            contexto.setVariable("nome", nome);
            enviarEmailTemplate(destinatario, assunto, "boas-vindas", contexto);
        } catch (Exception e) {
            log.error("Falha ao enviar e-mail de cadastro para {}: {}", destinatario, e.getMessage(), e);
        }
    }

    @Async
    public void enviarEmailRedefinirSenha(String destinatario, String nome, String token) {
        try {
            String assunto = "Redefinição de Senha";

            Context contexto = new Context();
            contexto.setVariable("nome", nome);
            contexto.setVariable("token", token);
            enviarEmailTemplate(destinatario, assunto, "recuperacao-senha", contexto);
        } catch (Exception e) {
            log.error("Falha ao enviar e-mail de redefinição para {}: {}", destinatario, e.getMessage(), e);
        }
    }
}
