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
    @CrossOrigin("http://localhost:3000")
    public List<Cidade> listarTodos() {
        return cidadeService.listarTodosEstados();
    }

    @PostMapping("/")
    @CrossOrigin("http://localhost:3000")
    public Cidade inserir(@RequestBody Cidade cidade) {
        return cidadeService.inserirCidade(cidade);
    }

    @PutMapping("/")
    @CrossOrigin("http://localhost:3000")
    public Cidade alterar(@RequestBody Cidade cidade) {
        return cidadeService.alterarCidade(cidade);
    }

    @DeleteMapping("/{id}")
    @CrossOrigin("http://localhost:3000")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        cidadeService.excluirCidade(id);
        return ResponseEntity.ok().build();
    }

}
