package com.ricardo.backend.seed;


import com.ricardo.backend.entity.Categoria;
import com.ricardo.backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class CategoriaSeed implements CommandLineRunner {
    private final List<String> categoriaNomes = Arrays.asList(
            "Eletrônicos",
            "Moda",
            "Livros",
            "Beleza",
            "Casa e Decoração",
            "Esportes e Lazer",
            "Alimentos e Bebidas",
            "Brinquedos e Jogos"
    );

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Override
    public void run(String... args) {
        for (String nome : categoriaNomes) {
            Categoria categoria = categoriaRepository.findByNome(nome);
            if (categoria == null) {
                categoria = new Categoria();
                categoria.setNome(nome);
                categoriaRepository.save(categoria);
            }
        }
    }
}