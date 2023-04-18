package com.ricardo.backend.controller;

import com.ricardo.backend.dto.PessoaClienteRequestDTO;
import com.ricardo.backend.entity.Pessoa;
import com.ricardo.backend.service.PessoaClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cliente")
public class PessoaClienteController {
    @Autowired
    private PessoaClienteService pessoaClienteService;

    @PostMapping("/")
    public Pessoa inserir(@RequestBody PessoaClienteRequestDTO pessoaClienteRequestDTO) {
        return pessoaClienteService.registrar(pessoaClienteRequestDTO);
    }
}
