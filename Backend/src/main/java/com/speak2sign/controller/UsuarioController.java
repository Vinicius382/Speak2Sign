package com.speak2sign.controller;

import com.speak2sign.dto.CadastroRequestDTO;
import com.speak2sign.dto.EsqueciSenhaRequestDTO;
import com.speak2sign.dto.LoginRequestDTO;
import com.speak2sign.dto.RedefinirSenhaRequestDTO;
import com.speak2sign.dto.UsuarioResponseDTO;
import com.speak2sign.model.Usuario;
import com.speak2sign.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@RequestBody CadastroRequestDTO dto) {
        try {
            Usuario usuario = new Usuario();
            usuario.setNome(dto.getNome());
            usuario.setEmail(dto.getEmail());
            usuario.setSenha(dto.getSenha());

            Usuario novoUsuario = usuarioService.cadastrar(usuario);
            return ResponseEntity.ok(UsuarioResponseDTO.fromEntity(novoUsuario));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        try {
            Usuario usuarioLogado = usuarioService.login(dto.getEmail(), dto.getSenha());
            return ResponseEntity.ok(UsuarioResponseDTO.fromEntity(usuarioLogado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<?> esqueciSenha(@RequestBody EsqueciSenhaRequestDTO dto) {
        try {
            usuarioService.solicitarRedefinicaoSenha(dto.getEmail());
            return ResponseEntity.ok(Map.of("mensagem", "Código de recuperação enviado para o seu e-mail."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody RedefinirSenhaRequestDTO dto) {
        try {
            usuarioService.redefinirSenha(dto.getEmail(), dto.getToken(), dto.getNovaSenha());
            return ResponseEntity.ok(Map.of("mensagem", "Senha redefinida com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
