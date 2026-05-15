package com.speak2sign.controller;

import com.speak2sign.dto.AtualizarPerfilDTO;
import com.speak2sign.dto.AlterarSenhaDTO;
import com.speak2sign.dto.CadastroRequestDTO;
import com.speak2sign.dto.EsqueciSenhaRequestDTO;
import com.speak2sign.dto.LoginRequestDTO;
import com.speak2sign.dto.RedefinirSenhaRequestDTO;
import com.speak2sign.dto.UsuarioResponseDTO;
import com.speak2sign.model.Usuario;
import com.speak2sign.service.UsuarioService;
import jakarta.validation.Valid;
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
    public ResponseEntity<UsuarioResponseDTO> cadastrar(@Valid @RequestBody CadastroRequestDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());

        Usuario novoUsuario = usuarioService.cadastrar(usuario);
        return ResponseEntity.ok(UsuarioResponseDTO.fromEntity(novoUsuario));
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        Usuario usuarioLogado = usuarioService.login(dto.getEmail(), dto.getSenha());
        return ResponseEntity.ok(UsuarioResponseDTO.fromEntity(usuarioLogado));
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<Map<String, String>> esqueciSenha(@Valid @RequestBody EsqueciSenhaRequestDTO dto) {
        usuarioService.solicitarRedefinicaoSenha(dto.getEmail());
        return ResponseEntity.ok(Map.of("mensagem", "Código de recuperação enviado para o seu e-mail."));
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<Map<String, String>> redefinirSenha(@Valid @RequestBody RedefinirSenhaRequestDTO dto) {
        usuarioService.redefinirSenha(dto.getEmail(), dto.getToken(), dto.getNovaSenha());
        return ResponseEntity.ok(Map.of("mensagem", "Senha redefinida com sucesso!"));
    }

    @PutMapping("/{id}/atualizar")
    public ResponseEntity<UsuarioResponseDTO> atualizarPerfil(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarPerfilDTO dto) {
        Usuario usuarioAtualizado = usuarioService.atualizarPerfil(id, dto.getNome());
        return ResponseEntity.ok(UsuarioResponseDTO.fromEntity(usuarioAtualizado));
    }

    @PutMapping("/{id}/alterar-senha")
    public ResponseEntity<Map<String, String>> alterarSenha(
            @PathVariable Long id,
            @Valid @RequestBody AlterarSenhaDTO dto) {
        usuarioService.alterarSenha(id, dto.getSenhaAtual(), dto.getNovaSenha());
        return ResponseEntity.ok(Map.of("mensagem", "Senha alterada com sucesso!"));
    }
}
