package com.ricardo.backend.service;

import com.ricardo.backend.entity.Produto;
import com.ricardo.backend.entity.ProdutoImagens;
import com.ricardo.backend.repository.ProdutoImagensRepository;
import com.ricardo.backend.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ProdutoImagensService {
    @Autowired
    private ProdutoImagensRepository produtoImagensRepository;
    @Autowired
    private ProdutoRepository produtoRepository;

    public List<ProdutoImagens> listarTodosProdutoImagens() {
        return produtoImagensRepository.findAll();
    }

    public ProdutoImagens inserirProdutoImagens(Long id, MultipartFile file) {
        Produto produto = null;
        if (produtoRepository.findById(id).isPresent()) {
            produto = produtoRepository.findById(id).get();
        }
        ProdutoImagens imagem = new ProdutoImagens();

        try {
            if (!file.isEmpty()) {
                byte[] bytes = file.getBytes();
                assert produto != null;
                String nomeDaImagem = String.valueOf(produto.getId()) + file.getOriginalFilename();
                Path path = Paths.get("src/main/resources/static/img/" + nomeDaImagem);
                Files.write(path, bytes); // Escreve a imagem.
                imagem.setNome(nomeDaImagem);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        imagem.setProduto(produto);
        imagem.setDataCriacao(new Date());
        imagem = produtoImagensRepository.saveAndFlush(imagem);
        return imagem;
    }

    public ProdutoImagens alterarProdutoImagens(ProdutoImagens produtoImagens) {
        Optional<ProdutoImagens> produtoImagensExistente = produtoImagensRepository.findById(produtoImagens.getId());
        if (produtoImagensExistente.isPresent()) {
            produtoImagens.setDataCriacao(produtoImagensExistente.get().getDataCriacao()); // Mantém a data de criação existente
        } else {
            produtoImagens.setDataCriacao(new Date()); // Define uma nova data de criação
        }
        produtoImagens.setDataAtualizacao(new Date()); // Define a nova data de atualização
        return produtoImagensRepository.saveAndFlush(produtoImagens);
    }

    public void excluirProdutoImagens(Long id) {
        Optional<ProdutoImagens> produtoImagensOpcional = produtoImagensRepository.findById(id);
        produtoImagensOpcional.ifPresent(p -> produtoImagensRepository.delete(p));
    }
}
