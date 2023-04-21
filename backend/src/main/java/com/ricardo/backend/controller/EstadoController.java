package com.ricardo.backend.controller;

import com.ricardo.backend.entity.Estado;
import com.ricardo.backend.service.EstadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estado")
public class EstadoController {
    @Autowired
    private EstadoService estadoService;

    @GetMapping("/")
    public List<Estado> listarTodos() {
        return estadoService.listarTodosEstados();
    }

    @PostMapping("/")
    public Estado inserir(Estado estado) {
        return estadoService.inserirEstado(estado);
    }

    @PutMapping("/")
    public Estado alterar(Estado estado) {
        return estadoService.alterarEstado(estado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        estadoService.excluirEstado(id);
        return ResponseEntity.ok().build();
    }
}
