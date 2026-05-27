package com.speak2sign.controller;

import com.speak2sign.dto.AlterarSenhaDTO;
import com.speak2sign.dto.AtualizarPerfilDTO;
import com.speak2sign.dto.FavoritoRequestDTO;
import com.speak2sign.dto.FavoritoResponseDTO;
import com.speak2sign.dto.HistoricoRequestDTO;
import com.speak2sign.dto.HistoricoResponseDTO;
import com.speak2sign.dto.UsuarioResponseDTO;
import com.speak2sign.model.Favorito;
import com.speak2sign.model.Historico;
import com.speak2sign.model.Usuario;
import com.speak2sign.security.UsuarioAutenticado;
import com.speak2sign.service.TraducaoService;
import com.speak2sign.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioAutenticadoController {

    private final UsuarioService usuarioService;
    private final TraducaoService traducaoService;

    public UsuarioAutenticadoController(UsuarioService usuarioService, TraducaoService traducaoService) {
        this.usuarioService = usuarioService;
        this.traducaoService = traducaoService;
    }

    @PutMapping("/perfil")
    public ResponseEntity<UsuarioResponseDTO> atualizarPerfil(
            @AuthenticationPrincipal UsuarioAutenticado usuarioAutenticado,
            @Valid @RequestBody AtualizarPerfilDTO dto) {
        Usuario usuarioAtualizado = usuarioService.atualizarPerfil(usuarioAutenticado.getId(), dto.getNome());
        return ResponseEntity.ok(UsuarioResponseDTO.fromEntity(usuarioAtualizado));
    }

    @PutMapping("/senha")
    public ResponseEntity<Map<String, String>> alterarSenha(
            @AuthenticationPrincipal UsuarioAutenticado usuarioAutenticado,
            @Valid @RequestBody AlterarSenhaDTO dto) {
        usuarioService.alterarSenha(usuarioAutenticado.getId(), dto.getSenhaAtual(), dto.getNovaSenha());
        return ResponseEntity.ok(Map.of("mensagem", "Senha alterada com sucesso!"));
    }

    @GetMapping("/historico")
    public ResponseEntity<List<HistoricoResponseDTO>> listarHistorico(
            @AuthenticationPrincipal UsuarioAutenticado usuarioAutenticado) {
        List<Historico> historico = traducaoService.listarHistorico(usuarioAutenticado.getId());
        List<HistoricoResponseDTO> resposta = historico.stream()
                .map(HistoricoResponseDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/historico")
    public ResponseEntity<HistoricoResponseDTO> adicionarAoHistorico(
            @AuthenticationPrincipal UsuarioAutenticado usuarioAutenticado,
            @Valid @RequestBody HistoricoRequestDTO dto) {
        Historico historico = traducaoService.adicionarAoHistorico(
                usuarioAutenticado.getId(), dto.getTipo(), dto.getTexto());
        return ResponseEntity.ok(HistoricoResponseDTO.fromEntity(historico));
    }

    @DeleteMapping("/historico/{itemId}")
    public ResponseEntity<Map<String, String>> removerDoHistorico(
            @AuthenticationPrincipal UsuarioAutenticado usuarioAutenticado,
            @PathVariable Long itemId) {
        traducaoService.removerDoHistorico(usuarioAutenticado.getId(), itemId);
        return ResponseEntity.ok(Map.of("mensagem", "Item removido do histórico."));
    }

    @DeleteMapping("/historico")
    public ResponseEntity<Map<String, String>> limparHistorico(
            @AuthenticationPrincipal UsuarioAutenticado usuarioAutenticado) {
        traducaoService.limparHistorico(usuarioAutenticado.getId());
        return ResponseEntity.ok(Map.of("mensagem", "Histórico limpo com sucesso."));
    }

    @GetMapping("/favoritos")
    public ResponseEntity<List<FavoritoResponseDTO>> listarFavoritos(
            @AuthenticationPrincipal UsuarioAutenticado usuarioAutenticado) {
        List<Favorito> favoritos = traducaoService.listarFavoritos(usuarioAutenticado.getId());
        List<FavoritoResponseDTO> resposta = favoritos.stream()
                .map(FavoritoResponseDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/favoritos")
    public ResponseEntity<FavoritoResponseDTO> adicionarFavorito(
            @AuthenticationPrincipal UsuarioAutenticado usuarioAutenticado,
            @Valid @RequestBody FavoritoRequestDTO dto) {
        Favorito favorito = traducaoService.adicionarFavorito(
                usuarioAutenticado.getId(), dto.getTipo(), dto.getTexto());
        return ResponseEntity.ok(FavoritoResponseDTO.fromEntity(favorito));
    }

    @DeleteMapping("/favoritos/{itemId}")
    public ResponseEntity<Map<String, String>> removerFavorito(
            @AuthenticationPrincipal UsuarioAutenticado usuarioAutenticado,
            @PathVariable Long itemId) {
        traducaoService.removerFavorito(usuarioAutenticado.getId(), itemId);
        return ResponseEntity.ok(Map.of("mensagem", "Favorito removido com sucesso."));
    }
}
