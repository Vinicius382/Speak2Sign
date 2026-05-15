package com.speak2sign.exception;

import com.speak2sign.dto.ErroResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponseDTO> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> campos = new LinkedHashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(error ->
                campos.putIfAbsent(error.getField(), error.getDefaultMessage()));

        return buildResponse(HttpStatus.BAD_REQUEST, "Dados inválidos.", campos);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResponseDTO> handleUnreadableBody() {
        return buildResponse(HttpStatus.BAD_REQUEST, "Payload inválido ou incompleto.", Map.of());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErroResponseDTO> handleBusinessException(RuntimeException exception) {
        return buildResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), Map.of());
    }

    private ResponseEntity<ErroResponseDTO> buildResponse(
            HttpStatus status,
            String mensagem,
            Map<String, String> campos) {
        ErroResponseDTO erro = new ErroResponseDTO(
                status.value(),
                mensagem,
                campos,
                LocalDateTime.now());

        return ResponseEntity.status(status).body(erro);
    }
}
