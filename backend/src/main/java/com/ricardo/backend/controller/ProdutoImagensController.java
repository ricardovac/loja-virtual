package com.ricardo.backend.controller;

import com.ricardo.backend.entity.ProdutoImagens;
import com.ricardo.backend.service.ProdutoImagensService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/produtoImagens")
public class ProdutoImagensController {
    @Autowired
    private ProdutoImagensService produtoImagensService;

    @GetMapping("/")
    @CrossOrigin("http://localhost:3000")
    public List<ProdutoImagens> listarTodos() {
        return produtoImagensService.listarTodosProdutoImagens();
    }

    @GetMapping("/produto/{id}")
    @CrossOrigin("http://localhost:3000")
    public List<ProdutoImagens> buscarPorProduto(@PathVariable("id") Long idProduto) {
        return produtoImagensService.buscarPorProduto(idProduto);
    }

    @PostMapping("/")
    @CrossOrigin("http://localhost:3000")
    public ProdutoImagens inserir(@RequestParam("idProduto") Long idProduto, @RequestParam MultipartFile file) {
        return produtoImagensService.inserirProdutoImagens(idProduto, file);
    }

    @PutMapping("/")
    @CrossOrigin("http://localhost:3000")
    public ProdutoImagens alterar(ProdutoImagens produtoImagens) {
        return produtoImagensService.alterarProdutoImagens(produtoImagens);
    }

    @DeleteMapping("/{id}")
    @CrossOrigin("http://localhost:3000")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        produtoImagensService.excluirProdutoImagens(id);
        return ResponseEntity.ok().build();
    }
}
