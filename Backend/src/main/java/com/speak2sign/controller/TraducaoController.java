package com.speak2sign.controller;

import com.speak2sign.dto.FavoritoRequestDTO;
import com.speak2sign.dto.FavoritoResponseDTO;
import com.speak2sign.dto.HistoricoRequestDTO;
import com.speak2sign.dto.HistoricoResponseDTO;
import com.speak2sign.model.Favorito;
import com.speak2sign.model.Historico;
import com.speak2sign.service.TraducaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios/{usuarioId}")
public class TraducaoController {

    private final TraducaoService traducaoService;

    @Autowired
    public TraducaoController(TraducaoService traducaoService) {
        this.traducaoService = traducaoService;
    }

    //HISTÓRICO 

    @GetMapping("/historico")
    public ResponseEntity<?> listarHistorico(@PathVariable Long usuarioId) {
        try {
            List<Historico> historico = traducaoService.listarHistorico(usuarioId);
            List<HistoricoResponseDTO> resposta = historico.stream()
                    .map(HistoricoResponseDTO::fromEntity)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(resposta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/historico")
    public ResponseEntity<?> adicionarAoHistorico(
            @PathVariable Long usuarioId,
            @RequestBody HistoricoRequestDTO dto) {
        try {
            Historico historico = traducaoService.adicionarAoHistorico(
                    usuarioId, dto.getTipo(), dto.getTexto());
            return ResponseEntity.ok(HistoricoResponseDTO.fromEntity(historico));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/historico/{itemId}")
    public ResponseEntity<?> removerDoHistorico(
            @PathVariable Long usuarioId,
            @PathVariable Long itemId) {
        try {
            traducaoService.removerDoHistorico(usuarioId, itemId);
            return ResponseEntity.ok(Map.of("mensagem", "Item removido do histórico."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/historico")
    public ResponseEntity<?> limparHistorico(@PathVariable Long usuarioId) {
        try {
            traducaoService.limparHistorico(usuarioId);
            return ResponseEntity.ok(Map.of("mensagem", "Histórico limpo com sucesso."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //FAVORITOS 

    @GetMapping("/favoritos")
    public ResponseEntity<?> listarFavoritos(@PathVariable Long usuarioId) {
        try {
            List<Favorito> favoritos = traducaoService.listarFavoritos(usuarioId);
            List<FavoritoResponseDTO> resposta = favoritos.stream()
                    .map(FavoritoResponseDTO::fromEntity)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(resposta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/favoritos")
    public ResponseEntity<?> adicionarFavorito(
            @PathVariable Long usuarioId,
            @RequestBody FavoritoRequestDTO dto) {
        try {
            Favorito favorito = traducaoService.adicionarFavorito(
                    usuarioId, dto.getTipo(), dto.getTexto());
            return ResponseEntity.ok(FavoritoResponseDTO.fromEntity(favorito));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/favoritos/{itemId}")
    public ResponseEntity<?> removerFavorito(
            @PathVariable Long usuarioId,
            @PathVariable Long itemId) {
        try {
            traducaoService.removerFavorito(usuarioId, itemId);
            return ResponseEntity.ok(Map.of("mensagem", "Favorito removido com sucesso."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
