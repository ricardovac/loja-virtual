package com.ricardo.backend.service;

import com.ricardo.backend.entity.Marca;
import com.ricardo.backend.repository.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class MarcaService {
    @Autowired
    private MarcaRepository marcaRepository;

    public List<Marca> listarTodosMarca() {
        return marcaRepository.findAll();
    }

    public Marca inserirMarca(Marca marca) {
        marca.setDataCriacao(new Date());
        return marcaRepository.saveAndFlush(marca);
    }

    public Marca alterarMarca(Marca marca) {
        marca.setDataAtualizacao(new Date());
        return marcaRepository.saveAndFlush(marca);
    }

    public void excluirMarca(Long id) {
        Optional<Marca> marcaOpcional = marcaRepository.findById(id);
        marcaOpcional.ifPresent(p -> marcaRepository.delete(p));
    }
}
