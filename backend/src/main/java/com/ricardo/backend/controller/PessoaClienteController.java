package com.ricardo.backend.controller;

import com.ricardo.backend.dto.PessoaClienteRequestDTO;
import com.ricardo.backend.service.PessoaClienteService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cliente")
@CrossOrigin
public class PessoaClienteController {
    @Autowired
    private PessoaClienteService pessoaClienteService;

    @PostMapping("/")
    public ResponseEntity<?> inserir(@Valid @RequestBody PessoaClienteRequestDTO pessoaClienteRequestDTO)
            throws MessagingException {
        pessoaClienteService.registrar(pessoaClienteRequestDTO);
        return ResponseEntity.ok("Usuário criado!");
    }
}
