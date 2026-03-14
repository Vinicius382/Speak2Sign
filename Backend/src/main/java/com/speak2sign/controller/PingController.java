package com.speak2sign.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PingController {
    
    @GetMapping("/ping")
    public ResponseEntity<String> manterAcordado() {
        return ResponseEntity.ok("Speak2Sign API está online");
    }
}