package com.speak2sign.controller;

import com.speak2sign.dto.FavoritoRequestDTO;
import com.speak2sign.dto.FavoritoResponseDTO;
import com.speak2sign.dto.HistoricoRequestDTO;
import com.speak2sign.dto.HistoricoResponseDTO;
import com.speak2sign.model.Favorito;
import com.speak2sign.model.Historico;
import com.speak2sign.service.TraducaoService;
import jakarta.validation.Valid;
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
    public ResponseEntity<List<HistoricoResponseDTO>> listarHistorico(@PathVariable Long usuarioId) {
        List<Historico> historico = traducaoService.listarHistorico(usuarioId);
        List<HistoricoResponseDTO> resposta = historico.stream()
                .map(HistoricoResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/historico")
    public ResponseEntity<HistoricoResponseDTO> adicionarAoHistorico(
            @PathVariable Long usuarioId,
            @Valid @RequestBody HistoricoRequestDTO dto) {
        Historico historico = traducaoService.adicionarAoHistorico(
                usuarioId, dto.getTipo(), dto.getTexto());
        return ResponseEntity.ok(HistoricoResponseDTO.fromEntity(historico));
    }

    @DeleteMapping("/historico/{itemId}")
    public ResponseEntity<Map<String, String>> removerDoHistorico(
            @PathVariable Long usuarioId,
            @PathVariable Long itemId) {
        traducaoService.removerDoHistorico(usuarioId, itemId);
        return ResponseEntity.ok(Map.of("mensagem", "Item removido do histórico."));
    }

    @DeleteMapping("/historico")
    public ResponseEntity<Map<String, String>> limparHistorico(@PathVariable Long usuarioId) {
        traducaoService.limparHistorico(usuarioId);
        return ResponseEntity.ok(Map.of("mensagem", "Histórico limpo com sucesso."));
    }

    //FAVORITOS 

    @GetMapping("/favoritos")
    public ResponseEntity<List<FavoritoResponseDTO>> listarFavoritos(@PathVariable Long usuarioId) {
        List<Favorito> favoritos = traducaoService.listarFavoritos(usuarioId);
        List<FavoritoResponseDTO> resposta = favoritos.stream()
                .map(FavoritoResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/favoritos")
    public ResponseEntity<FavoritoResponseDTO> adicionarFavorito(
            @PathVariable Long usuarioId,
            @Valid @RequestBody FavoritoRequestDTO dto) {
        Favorito favorito = traducaoService.adicionarFavorito(
                usuarioId, dto.getTipo(), dto.getTexto());
        return ResponseEntity.ok(FavoritoResponseDTO.fromEntity(favorito));
    }

    @DeleteMapping("/favoritos/{itemId}")
    public ResponseEntity<Map<String, String>> removerFavorito(
            @PathVariable Long usuarioId,
            @PathVariable Long itemId) {
        traducaoService.removerFavorito(usuarioId, itemId);
        return ResponseEntity.ok(Map.of("mensagem", "Favorito removido com sucesso."));
    }
}
