package com.speak2sign.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlterarSenhaDTO {
    @NotBlank(message = "A senha atual é obrigatória.")
    private String senhaAtual;

    @NotBlank(message = "A nova senha é obrigatória.")
    @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres.")
    private String novaSenha;
}
