package com.speak2sign.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EsqueciSenhaRequestDTO {
    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "E-mail inválido.")
    private String email;
}
