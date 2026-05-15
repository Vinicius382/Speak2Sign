package com.speak2sign.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AtualizarPerfilDTO {
    @NotBlank(message = "O nome é obrigatório.")
    private String nome;
}
