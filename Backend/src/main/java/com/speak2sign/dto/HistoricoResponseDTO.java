package com.speak2sign.dto;

import com.speak2sign.model.Historico;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoResponseDTO {
    private Long id;
    private String tipo;
    private String texto;
    private LocalDateTime dataCriacao;

    public static HistoricoResponseDTO fromEntity(Historico historico) {
        return new HistoricoResponseDTO(
            historico.getId(),
            historico.getTipo(),
            historico.getTexto(),
            historico.getDataCriacao()
        );
    }
}
