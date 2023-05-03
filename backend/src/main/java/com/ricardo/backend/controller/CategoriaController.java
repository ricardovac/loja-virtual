package com.ricardo.backend.controller;

import com.ricardo.backend.entity.Categoria;
import com.ricardo.backend.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categoria")
public class CategoriaController {
    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/")
    @CrossOrigin("http://localhost:3000")
    public List<Categoria> listarTodos() {
        return categoriaService.listarTodosCategoria();
    }

    @PostMapping("/")
    @CrossOrigin("http://localhost:3000")
    public Categoria inserir(@RequestBody Categoria categoria) {
        return categoriaService.inserirCategoria(categoria);
    }

    @PutMapping("/")
    @CrossOrigin("http://localhost:3000")
    public Categoria alterar(@RequestBody Categoria categoria) {
        return categoriaService.alterarCategoria(categoria);
    }

    @DeleteMapping("/{id}")
    @CrossOrigin("http://localhost:3000")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        categoriaService.excluirCategoria(id);
        return ResponseEntity.ok().build();
    }
}
