package com.ricardo.backend.repository;

import com.ricardo.backend.entity.ProdutoImagens;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoImagensRepository extends JpaRepository<ProdutoImagens, String> {
    public List<ProdutoImagens> findByProdutoId(String id);

    public List<ProdutoImagens> findByNome(String nome);

}