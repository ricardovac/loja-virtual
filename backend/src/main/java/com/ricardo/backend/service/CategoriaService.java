package com.ricardo.backend.service;

import com.ricardo.backend.entity.Categoria;
import com.ricardo.backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> listarTodosCategoria() {
        return categoriaRepository.findAll();
    }

    public Categoria inserirCategoria(Categoria categoria) {
        categoria.setDataCriacao(new Date());
        return categoriaRepository.saveAndFlush(categoria);
    }

    public Categoria alterarCategoria(Categoria categoria) {
        categoria.setDataAtualizacao(new Date());
        return categoriaRepository.saveAndFlush(categoria);
    }

    public void excluirCategoria(Long id) {
        Optional<Categoria> categoriaOpcional = categoriaRepository.findById(id);
        categoriaOpcional.ifPresent(p -> categoriaRepository.delete(p));
    }
}
