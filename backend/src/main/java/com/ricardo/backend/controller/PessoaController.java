package com.ricardo.backend.controller;

import com.ricardo.backend.entity.Pessoa;
import com.ricardo.backend.service.PessoaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pessoa")
public class PessoaController {
    @Autowired
    private PessoaService pessoaService;

    @GetMapping("/")
    public List<Pessoa> listarTodos() {
        return pessoaService.listarTodosPessoa();
    }

    @PostMapping("/")
    public Pessoa inserir(@RequestBody Pessoa pessoa) {
        return pessoaService.inserirPessoa(pessoa);
    }

    @PutMapping("/")
    public Pessoa alterar(@RequestBody Pessoa pessoa) {
        return pessoaService.alterarPessoa(pessoa);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        pessoaService.excluirPessoa(id);
        return ResponseEntity.ok().build();
    }
}
