package com.speak2sign.service;

import com.speak2sign.model.Usuario;
import com.speak2sign.repository.UsuarioRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository, EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    public Usuario cadastrar(Usuario usuario) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(usuario.getEmail());
        if (usuarioExistente.isPresent()) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        // Hash da senha com BCrypt antes de salvar
        String senhaHash = BCrypt.hashpw(usuario.getSenha(), BCrypt.gensalt());
        usuario.setSenha(senhaHash);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        try {
            emailService.enviarEmailCadastro(usuarioSalvo.getEmail(), usuarioSalvo.getNome());
        } catch (Exception e) {
            System.err.println("Falha ao enviar email: " + e.getMessage());
        }

        return usuarioSalvo;
    }

    public Usuario login(String email, String senha) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);

        if (usuario.isPresent() && BCrypt.checkpw(senha, usuario.get().getSenha())) {
            return usuario.get();
        }

        throw new RuntimeException("Credenciais inválidas.");
    }

    public void solicitarRedefinicaoSenha(String email) {
        Optional<Usuario> optUsuario = usuarioRepository.findByEmail(email);
        if (optUsuario.isEmpty()) {
            throw new RuntimeException("E-mail não encontrado.");
        }

        Usuario usuario = optUsuario.get();

        // Gera token numérico de 6 dígitos
        String token = String.format("%06d", secureRandom.nextInt(1_000_000));
        usuario.setResetToken(token);
        usuario.setResetTokenExpiration(LocalDateTime.now().plusMinutes(15));
        usuarioRepository.save(usuario);

        try {
            emailService.enviarEmailRedefinirSenha(usuario.getEmail(), usuario.getNome(), token);
        } catch (Exception e) {
            System.err.println("Falha ao enviar email de redefinição: " + e.getMessage());
            throw new RuntimeException("Erro ao enviar o e-mail de recuperação. Tente novamente.");
        }
    }

    public void redefinirSenha(String email, String token, String novaSenha) {
        Optional<Usuario> optUsuario = usuarioRepository.findByEmail(email);
        if (optUsuario.isEmpty()) {
            throw new RuntimeException("E-mail não encontrado.");
        }

        Usuario usuario = optUsuario.get();

        if (usuario.getResetToken() == null || !usuario.getResetToken().equals(token)) {
            throw new RuntimeException("Código inválido.");
        }

        if (usuario.getResetTokenExpiration() == null || LocalDateTime.now().isAfter(usuario.getResetTokenExpiration())) {
            usuario.setResetToken(null);
            usuario.setResetTokenExpiration(null);
            usuarioRepository.save(usuario);
            throw new RuntimeException("Código expirado. Solicite um novo.");
        }

        String senhaHash = BCrypt.hashpw(novaSenha, BCrypt.gensalt());
        usuario.setSenha(senhaHash);
        usuario.setResetToken(null);
        usuario.setResetTokenExpiration(null);
        usuarioRepository.save(usuario);
    }

    public Usuario atualizarPerfil(Long id, String nome) {
        Optional<Usuario> optUsuario = usuarioRepository.findById(id);
        if (optUsuario.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado.");
        }

        Usuario usuario = optUsuario.get();
        usuario.setNome(nome);
        return usuarioRepository.save(usuario);
    }

    public void alterarSenha(Long id, String senhaAtual, String novaSenha) {
        Optional<Usuario> optUsuario = usuarioRepository.findById(id);
        if (optUsuario.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado.");
        }

        Usuario usuario = optUsuario.get();

        if (!BCrypt.checkpw(senhaAtual, usuario.getSenha())) {
            throw new RuntimeException("Senha atual incorreta.");
        }

        String senhaHash = BCrypt.hashpw(novaSenha, BCrypt.gensalt());
        usuario.setSenha(senhaHash);
        usuarioRepository.save(usuario);
    }
}
