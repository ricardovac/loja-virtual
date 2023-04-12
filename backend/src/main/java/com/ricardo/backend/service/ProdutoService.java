package com.ricardo.backend.service;

import com.ricardo.backend.entity.Produto;
import com.ricardo.backend.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Produto> listarTodosProdutos() {
        return produtoRepository.findAll();
    }

    public Produto inserirProduto(Produto produto) {
        produto.setDataCriacao(new Date());
        return produtoRepository.saveAndFlush(produto);
    }

    public Produto alterarProduto(Produto produto) {
        Optional<Produto> produtoExistente = produtoRepository.findById(produto.getId());
        if (produtoExistente.isPresent()) {
            produto.setDataCriacao(produtoExistente.get().getDataCriacao()); // Mantém a data de criação existente
        } else {
            produto.setDataCriacao(new Date()); // Define uma nova data de criação
        }
        produto.setDataAtualizacao(new Date()); // Define a nova data de atualização
        return produtoRepository.saveAndFlush(produto);
    }

    public void excluirProduto(Long id) {
        Optional<Produto> produtoOpcional = produtoRepository.findById(id);
        produtoOpcional.ifPresent(p -> produtoRepository.delete(p));
    }
}
