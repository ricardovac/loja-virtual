package com.ricardo.backend.controller;

import com.ricardo.backend.entity.Permissao;
import com.ricardo.backend.service.PermissaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissao")
public class PermissaoController {
    @Autowired
    private PermissaoService permissaoService;

    @GetMapping("/")
    public List<Permissao> listarTodos() {
        return permissaoService.listarTodosPermissao();
    }

    @PostMapping("/")
    public Permissao inserir(Permissao permissao) {
        return permissaoService.inserirPermissao(permissao);
    }

    @PutMapping("/")
    public Permissao alterar(Permissao permissao) {
        return permissaoService.alterarPermissao(permissao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        permissaoService.excluirPermissao(id);
        return ResponseEntity.ok().build();
    }
}
