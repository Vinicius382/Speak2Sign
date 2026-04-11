package com.speak2sign.dto;

import com.speak2sign.model.Favorito;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoritoResponseDTO {
    private Long id;
    private String tipo;
    private String texto;
    private LocalDateTime dataCriacao;

    public static FavoritoResponseDTO fromEntity(Favorito favorito) {
        return new FavoritoResponseDTO(
            favorito.getId(),
            favorito.getTipo(),
            favorito.getTexto(),
            favorito.getDataCriacao()
        );
    }
}
