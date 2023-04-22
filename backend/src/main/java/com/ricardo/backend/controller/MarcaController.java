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
    @CrossOrigin("http://localhost:3000")
    public List<Marca> listarTodos() {
        return marcaService.listarTodosMarca();
    }

    @PostMapping("/")
    @CrossOrigin("http://localhost:3000")
    public Marca inserir(@RequestBody Marca marca) {
        return marcaService.inserirMarca(marca);
    }

    @PutMapping("/")
    @CrossOrigin("http://localhost:3000")
    public Marca alterar(@RequestBody Marca marca) {
        return marcaService.alterarMarca(marca);
    }

    @DeleteMapping("/{id}")
    @CrossOrigin("http://localhost:3000")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        marcaService.excluirMarca(id);
        return ResponseEntity.ok().build();
    }
}
