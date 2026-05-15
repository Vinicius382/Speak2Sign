package com.speak2sign.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record ErroResponseDTO(
        int status,
        String mensagem,
        Map<String, String> campos,
        LocalDateTime timestamp) {
}
