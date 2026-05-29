package com.speak2sign.controller;

import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/vlibras")
public class VlibrasPersonalizacaoController {

    private static final Pattern HEX_PATTERN = Pattern.compile("^#?[0-9A-Fa-f]{6}$");
    private static final String CAMPO_SOMBRANCELHAS = "sombrancelhas";
    private static final String CAMPO_SOBRANCELHAS_LEGADO = "sobrancelhas";

    private static final Map<String, String> CORES_PADRAO = Map.of(
            "calca", "#201E62",
            "camisa", "#1A1A1A",
            "cabelo", "#000000",
            "corpo", "#C18471",
            "iris", "#000000",
            "olhos", "#FFFFFF",
            CAMPO_SOMBRANCELHAS, "#000000"
    );

    @GetMapping(value = "/personalizacao", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> obterPersonalizacao(
            @RequestParam Map<String, String> parametros) {
        Map<String, String> resposta = new LinkedHashMap<>();

        resposta.put("calca", normalizarHex(parametros.get("calca"), CORES_PADRAO.get("calca")));
        resposta.put("camisa", normalizarHex(parametros.get("camisa"), CORES_PADRAO.get("camisa")));
        resposta.put("cabelo", normalizarHex(parametros.get("cabelo"), CORES_PADRAO.get("cabelo")));
        resposta.put("corpo", normalizarHex(parametros.get("corpo"), CORES_PADRAO.get("corpo")));
        resposta.put("iris", normalizarHex(parametros.get("iris"), CORES_PADRAO.get("iris")));
        resposta.put("olhos", normalizarHex(parametros.get("olhos"), CORES_PADRAO.get("olhos")));
        resposta.put(
                CAMPO_SOMBRANCELHAS,
                normalizarHex(
                        obterParametroSobrancelhas(parametros),
                        CORES_PADRAO.get(CAMPO_SOMBRANCELHAS)
                )
        );
        resposta.put("pos", "center");

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .contentType(MediaType.APPLICATION_JSON)
                .body(resposta);
    }

    private String normalizarHex(String valor, String padrao) {
        if (valor == null || !HEX_PATTERN.matcher(valor).matches()) {
            return padrao;
        }

        String semHash = valor.replace("#", "");
        return "#" + semHash.toUpperCase();
    }

    private String obterParametroSobrancelhas(Map<String, String> parametros) {
        String valor = parametros.get(CAMPO_SOMBRANCELHAS);
        if (valor != null) {
            return valor;
        }

        return parametros.get(CAMPO_SOBRANCELHAS_LEGADO);
    }
}
