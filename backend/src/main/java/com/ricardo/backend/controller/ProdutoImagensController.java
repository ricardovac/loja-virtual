package com.ricardo.backend.controller;

import com.ricardo.backend.entity.ProdutoImagens;
import com.ricardo.backend.messages.ResponseMessage;
import com.ricardo.backend.service.ProdutoImagensService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/produtoImagens")
@CrossOrigin("http://localhost:3000")
public class ProdutoImagensController {
    @Autowired
    private ProdutoImagensService produtoImagensService;

    @GetMapping("/")
    public List<ProdutoImagens> listarTodos() {
        return produtoImagensService.listarTodosProdutoImagens();
    }

    @GetMapping("/produto/{id}")
    public List<ProdutoImagens> buscarPorProduto(@PathVariable("id") Long idProduto) {
        return produtoImagensService.buscarPorProduto(idProduto);
    }

    @PostMapping("/")
    public void inserir(@RequestParam("idProduto") Long idProduto,
            @RequestParam("file") MultipartFile file)
            throws IOException {

        String message = "";
        try {
            produtoImagensService.inserirProdutoImagens(idProduto, file);
            message = "Imagem enviado com sucesso: " + file.getOriginalFilename();
            ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = "Não foi possível enviar a imagem: " + file.getOriginalFilename() + "!";
            ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        produtoImagensService.excluirProdutoImagens(id);
        return ResponseEntity.ok().build();
    }
}