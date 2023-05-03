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
    @CrossOrigin("http://localhost:3000")
    public List<Produto> listarTodos() {
        return produtoService.listarTodosProdutos();
    }

    @GetMapping("/{id}")
    @CrossOrigin("http://localhost:3000")
    public Produto buscarPorId(@PathVariable("id") Long id) {
        return produtoService.buscarPorId(id);
    }

    @PostMapping("/")
    @CrossOrigin("http://localhost:3000")
    public Produto inserir(@RequestBody Produto produto) {
        return produtoService.inserirProduto(produto);
    }

    @PutMapping("/")
    @CrossOrigin("http://localhost:3000")
    public Produto alterar(@RequestBody Produto produto) {
        return produtoService.inserirProduto(produto);
    }

    @DeleteMapping("/{id}")
    @CrossOrigin("http://localhost:3000")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        produtoService.excluirProduto(id);
        return ResponseEntity.ok().build();
    }

}
