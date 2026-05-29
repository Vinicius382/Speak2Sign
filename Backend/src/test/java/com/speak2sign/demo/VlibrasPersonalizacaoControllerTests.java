package com.speak2sign.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.hasKey;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class VlibrasPersonalizacaoControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void deveRetornarDefaultsSemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/vlibras/personalizacao"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("application/json"))
                .andExpect(header().string("Cache-Control", "no-store"))
                .andExpect(jsonPath("$.calca").value("#201E62"))
                .andExpect(jsonPath("$.camisa").value("#1A1A1A"))
                .andExpect(jsonPath("$.cabelo").value("#000000"))
                .andExpect(jsonPath("$.corpo").value("#C18471"))
                .andExpect(jsonPath("$.iris").value("#000000"))
                .andExpect(jsonPath("$.olhos").value("#FFFFFF"))
                .andExpect(jsonPath("$.sombrancelhas").value("#000000"))
                .andExpect(jsonPath("$", not(hasKey("sobrancelhas"))))
                .andExpect(jsonPath("$.pos").value("center"));
    }

    @Test
    void deveNormalizarHexComOuSemHashEIgnorarValoresInvalidos() throws Exception {
        mockMvc.perform(get("/api/vlibras/personalizacao")
                        .param("calca", "abcdef")
                        .param("camisa", "#123456")
                        .param("cabelo", "invalido")
                        .param("corpo", "C18471")
                        .param("sombrancelhas", "654321"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.calca").value("#ABCDEF"))
                .andExpect(jsonPath("$.camisa").value("#123456"))
                .andExpect(jsonPath("$.cabelo").value("#000000"))
                .andExpect(jsonPath("$.corpo").value("#C18471"))
                .andExpect(jsonPath("$.sombrancelhas").value("#654321"));
    }

    @Test
    void deveAceitarSobrancelhasComoAliasLegadoDeEntrada() throws Exception {
        mockMvc.perform(get("/api/vlibras/personalizacao")
                        .param("sobrancelhas", "fedcba"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sombrancelhas").value("#FEDCBA"))
                .andExpect(jsonPath("$", not(hasKey("sobrancelhas"))));
    }

    @Test
    void naoDeveRefletirCamposExtrasRecebidosNaQuery() throws Exception {
        mockMvc.perform(get("/api/vlibras/personalizacao")
                        .param("urlImagem", "https://malicioso.example/imagem.png")
                        .param("campoExtra", "FFFFFF")
                        .param("logo", "https://malicioso.example/logo.png"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(hasKey("urlImagem"))))
                .andExpect(jsonPath("$", not(hasKey("campoExtra"))))
                .andExpect(jsonPath("$", not(hasKey("logo"))));
    }
}
