package com.ricardo.backend.dto;

import com.ricardo.backend.entity.Pessoa;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.beans.BeanUtils;

@Data
public class PessoaClienteRequestDTO {
    @NotNull(message = "Nome é obrigatório.")
    @Size(min = 3, message = "O nome deve conter pelo menos 3 digitos.")
    private String nome;
    @NotNull(message = "O CPF é obrigatório.")
    @Size(min = 11, message = "O CPF é obrigatorio.")
    private String cpf;
    @NotNull(message = "O Email é obrigatório.")
    @Size(min = 1, message = "O Email é obrigatorio.")
    @Email(message = "O email não está corretamente formatado")
    private String email;
    @NotNull(message = "O Endereco é obrigatório.")
    @Size(min = 3, message = "O Endereco é obrigatorio.")
    private String endereco;
    @NotNull(message = "O CEP é obrigatório.")
    @Size(min = 6, message = "O CEP é obrigatorio.")
    private String cep;
    private String cidade;

    public Pessoa converter(PessoaClienteRequestDTO pessoaClienteRequestDTO) {
        Pessoa pessoa = new Pessoa();
        BeanUtils.copyProperties(pessoaClienteRequestDTO, pessoa);
        return pessoa;
    }
}
