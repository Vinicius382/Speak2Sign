package com.speak2sign.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String emailRemetente;

    private void enviarEmailTemplate(String destinatario, String assunto, String nomeTemplate, Context contexto) throws MessagingException {
        log.info("Preparando e-mail '{}' para: {} (remetente: {})", assunto, destinatario, emailRemetente);

        String conteudoHtml = templateEngine.process(nomeTemplate, contexto);

        MimeMessage mensagem = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

        helper.setFrom(emailRemetente);
        helper.setTo(destinatario);
        helper.setSubject(assunto);
        helper.setText(conteudoHtml, true);

        mailSender.send(mensagem);
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
            log.error("FALHA ao enviar e-mail de cadastro para {}: {}", destinatario, e.getMessage(), e);
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
            log.error("FALHA ao enviar e-mail de redefinição para {}: {}", destinatario, e.getMessage(), e);
        }
    }
}
