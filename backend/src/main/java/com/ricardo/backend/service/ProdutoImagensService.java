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

    // Inserindo a imagem apartir do diretorio.
    public List<ProdutoImagens> buscarPorProduto(Long idProduto) {
        List<ProdutoImagens> listaProdutoImagens = produtoImagensRepository.findByProdutoId(idProduto);

        for (ProdutoImagens produtoImagens : listaProdutoImagens) {
            try (InputStream in = new FileInputStream(imagePath + produtoImagens.getNome())) {
                produtoImagens.setImagem(IOUtils.toByteArray(in));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return listaProdutoImagens;
    }

    // Inserindo imagem no resources e seu nome, tipo no construtor.
    public ProdutoImagens inserirProdutoImagens(Long idProduto, MultipartFile file) throws IOException {
        // Acha o produto por Id.
        Produto produto = produtoRepository.findById(idProduto).orElse(null);
        // Coloca o nome
        ProdutoImagens objeto = new ProdutoImagens();

        try {
            if (!file.isEmpty()) {
                byte[] bytes = file.getBytes();
                String nomeImagem = produto.getId() + file.getOriginalFilename();
                Path caminho = Paths.get(imagePath + nomeImagem);
                Files.write(caminho, bytes);
                objeto.setNome(nomeImagem);
                objeto.setTipo(file.getContentType());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        objeto.setProduto(produto);
        objeto.setDataCriacao(new Date());
        return produtoImagensRepository.saveAndFlush(objeto);
    }

    public void excluirProdutoImagens(Long id) {
        Optional<ProdutoImagens> produtoImagensOpcional = produtoImagensRepository.findById(id);
        produtoImagensOpcional.ifPresent(p -> produtoImagensRepository.delete(p));
    }
}
