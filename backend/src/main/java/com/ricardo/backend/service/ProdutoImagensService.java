package com.ricardo.backend.service;

import com.ricardo.backend.entity.Produto;
import com.ricardo.backend.entity.ProdutoImagens;
import com.ricardo.backend.repository.ProdutoImagensRepository;
import com.ricardo.backend.repository.ProdutoRepository;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProdutoImagensService {
    private final String imagePath = "backend/src/main/resources/static/img/";
    @Autowired
    private ProdutoImagensRepository produtoImagensRepository;
    @Autowired
    private ProdutoRepository produtoRepository;

    public List<ProdutoImagens> listarTodosProdutoImagens() {
        return produtoImagensRepository.findAll();
    }

    public List<ProdutoImagens> buscarPorProduto(Long idProduto) {
        List<ProdutoImagens> listaProdutoImagens = produtoImagensRepository.findByProdutoId(idProduto);

        for (ProdutoImagens produtoImagens : listaProdutoImagens) {
            try (InputStream in = new FileInputStream(imagePath + produtoImagens.getNome())) {
                produtoImagens.setArquivo(IOUtils.toByteArray(in));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return listaProdutoImagens;
    }

    public ProdutoImagens inserirProdutoImagens(Long idProduto, MultipartFile file) {
        // Acha o produto por Id.
        Produto produto = produtoRepository.findById(idProduto).orElse(null);
        // Coloca o nome
        ProdutoImagens produtoImagens = new ProdutoImagens();
        String imageName = UUID.randomUUID() + "." + StringUtils.getFilenameExtension(file.getOriginalFilename());

        try {
            if (!file.isEmpty()) {
                byte[] bytes = file.getBytes();
                assert produto != null;
//                String nomeImagem = produto.getId() + file.getOriginalFilename();
                Path caminho = Paths.get(imagePath + imageName);
                Files.write(caminho, bytes);
                produtoImagens.setNome(imageName);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        produtoImagens.setProduto(produto);
        produtoImagens.setDataCriacao(new Date());
        produtoImagens = produtoImagensRepository.saveAndFlush(produtoImagens);
        return produtoImagens;
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
