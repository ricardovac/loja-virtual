package com.ricardo.backend.controller;

import com.ricardo.backend.entity.ProdutoImagens;
import com.ricardo.backend.messages.ResponseFile;
import com.ricardo.backend.messages.ResponseMessage;
import com.ricardo.backend.service.ProdutoImagensService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produtoImagens")
@CrossOrigin("http://localhost:3000")
public class ProdutoImagensController {
    @Autowired
    private ProdutoImagensService produtoImagensService;

    @GetMapping("/")
    public ResponseEntity<List<ResponseFile>> listarTodos() {
        List<ResponseFile> files = produtoImagensService.listarTodosProdutoImagens().map(file -> {
            String fileDownloadUri = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/")
                    .path(file.getId())
                    .toUriString();

            return new ResponseFile(
                    file.getNome(),
                    fileDownloadUri,
                    file.getTipo(),
                    file.getArquivo().length);
        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(files);
    }

    @GetMapping("/produto/{id}")
    public List<ProdutoImagens> buscarPorProduto(@PathVariable("id") String idProduto) {
        return produtoImagensService.buscarPorProduto(idProduto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable String id) {
        ProdutoImagens produtoImagens = produtoImagensService.buscarArquivo(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + produtoImagens.getNome() + "\"")
                .body(produtoImagens.getArquivo());
    }

    @PostMapping("/")
    public ResponseEntity<ResponseMessage> inserir(@RequestParam("idProduto") Long idProduto,
            @RequestParam("file") MultipartFile file)
            throws IOException {
        String message = "";
        try {
            produtoImagensService.inserirProdutoImagens(idProduto, file);
            message = "Arquivo enviado com sucesso: " + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = "Não foi possível enviar o arquivo: " + file.getOriginalFilename() + "!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        produtoImagensService.excluirProdutoImagens(id);
        return ResponseEntity.ok().build();
    }
}
