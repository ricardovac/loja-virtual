package com.ricardo.backend.controller;

import com.ricardo.backend.entity.Produto;
import com.ricardo.backend.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produto")
public class ProdutoController {
    @Autowired
    private ProdutoService produtoService;

    @GetMapping("/")
    public List<Produto> listarTodos() {
        return produtoService.listarTodosProdutos();
    }

    @PostMapping("/")
    public Produto inserir(Produto produto) {
        return produtoService.inserirProduto(produto);
    }

    @PutMapping("/")
    public Produto alterar(Produto produto) {
        return produtoService.inserirProduto(produto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        produtoService.excluirProduto(id);
        return ResponseEntity.ok().build();
    }
}
