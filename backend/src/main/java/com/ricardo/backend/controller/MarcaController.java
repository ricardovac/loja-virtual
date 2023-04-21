package com.ricardo.backend.controller;

import com.ricardo.backend.entity.Marca;
import com.ricardo.backend.service.MarcaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marca")
public class MarcaController {
    @Autowired
    private MarcaService marcaService;

    @GetMapping("/")
    public List<Marca> listarTodos() {
        return marcaService.listarTodosMarca();
    }

    @PostMapping("/")
    public Marca inserir(Marca marca) {
        return marcaService.inserirMarca(marca);
    }

    @PutMapping("/")
    public Marca alterar(Marca marca) {
        return marcaService.alterarMarca(marca);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        marcaService.excluirMarca(id);
        return ResponseEntity.ok().build();
    }
}
