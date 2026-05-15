package com.speak2sign.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RedefinirSenhaRequestDTO {
    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "E-mail inválido.")
    private String email;

    @NotBlank(message = "O código de recuperação é obrigatório.")
    @Pattern(regexp = "\\d{6}", message = "O código de recuperação deve conter 6 dígitos.")
    private String token;

    @NotBlank(message = "A nova senha é obrigatória.")
    @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres.")
    private String novaSenha;
}
