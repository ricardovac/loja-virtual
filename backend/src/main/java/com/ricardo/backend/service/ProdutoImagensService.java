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
import java.util.stream.Stream;

@Service
public class ProdutoImagensService {
    private final String imagePath = "backend/src/main/resources/static/img/";
    @Autowired
    private ProdutoImagensRepository produtoImagensRepository;
    @Autowired
    private ProdutoRepository produtoRepository;

    public Stream<ProdutoImagens> listarTodosProdutoImagens() {
        return produtoImagensRepository.findAll().stream();
    }

    public ProdutoImagens buscarArquivo(String id) {
        return produtoImagensRepository.findById(id).get();
    }

    public List<ProdutoImagens> buscarPorProduto(String idProduto) {
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

    public ProdutoImagens inserirProdutoImagens(Long idProduto, MultipartFile file) throws IOException {
        // Acha o produto por Id.
        Produto produto = produtoRepository.findById(idProduto).orElse(null);
        // Coloca o nome
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        ProdutoImagens produtoImagens = new ProdutoImagens();

        try {
            if (!file.isEmpty()) {
                byte[] bytes = file.getBytes();
                assert produto != null;
                // String nomeImagem = produto.getId() + file.getOriginalFilename();
                Path caminho = Paths.get(imagePath + fileName);
                Files.write(caminho, bytes);
                produtoImagens.setNome(fileName);
                produtoImagens.setTipo(file.getContentType());
                produto.setArquivo(file.getBytes());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        produtoImagens.setProduto(produto);
        produtoImagens.setDataCriacao(new Date());
        return produtoImagensRepository.save(produtoImagens);
    }

    public void excluirProdutoImagens(String id) {
        Optional<ProdutoImagens> produtoImagensOpcional = produtoImagensRepository.findById(id);
        produtoImagensOpcional.ifPresent(p -> produtoImagensRepository.delete(p));
    }
}
