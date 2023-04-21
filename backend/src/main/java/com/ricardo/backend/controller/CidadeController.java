package com.ricardo.backend.controller;

import com.ricardo.backend.entity.Cidade;
import com.ricardo.backend.service.CidadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cidade")
public class CidadeController {
    @Autowired
    private CidadeService cidadeService;

    @GetMapping("/")
    public List<Cidade> listarTodos() {
        return cidadeService.listarTodosEstados();
    }

    @PostMapping("/")
    public Cidade inserir(Cidade cidade) {
        return cidadeService.inserirCidade(cidade);
    }

    @PutMapping("/")
    public Cidade alterar(Cidade cidade) {
        return cidadeService.alterarCidade(cidade);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        cidadeService.excluirCidade(id);
        return ResponseEntity.ok().build();
    }

}
