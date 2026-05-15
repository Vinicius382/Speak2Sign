package com.speak2sign.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoritoRequestDTO {
    @NotBlank(message = "O tipo é obrigatório.")
    private String tipo;

    @NotBlank(message = "O texto é obrigatório.")
    private String texto;
}
