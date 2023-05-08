package com.ricardo.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.Hibernate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "pessoa")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Pessoa implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull(message = "Nome é obrigatório.")
    @Size(min = 3, message = "O nome deve conter pelo menos 3 digitos.")
    private String nome;
    @NotNull(message = "CPF é obrigatório.")
    @Size(min = 1, message = "CPF é obrigatorio.")
    private String cpf;
    @NotNull(message = "Email é obrigatório.")
    @Size(min = 1, message = "Email é obrigatorio.")
    @Email(message = "O email não está corretamente formatado")
    private String email;
    private String codigoRecuperacaoSenha;
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataEnvioCodigo;
    private String senha;
    @NotNull(message = "O Endereco é obrigatório.")
    @Size(min = 1, message = "O Endereco é obrigatorio.")
    private String endereco;
    @NotNull(message = "O CEP é obrigatório.")
    @Size(min = 1, message = "O CEP é obrigatorio.")
    private String cep;

    @ManyToOne
    @JoinColumn(name = "idCidade")
    private Cidade cidade;

    @OneToMany(mappedBy = "pessoa", orphanRemoval = true, cascade = { CascadeType.PERSIST,
            CascadeType.MERGE }, fetch = FetchType.EAGER)
    @Setter(value = AccessLevel.NONE)
    @ToString.Exclude
    private List<PermissaoPessoa> permissaoPessoas;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dataCriacao;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dataAtualizacao;

    public void setPermissaoPessoas(List<PermissaoPessoa> permissaoPessoas) {
        for (PermissaoPessoa permissaoPessoa : permissaoPessoas) {
            permissaoPessoa.setPessoa(this);
        }

        this.permissaoPessoas = permissaoPessoas;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o))
            return false;
        Pessoa pessoa = (Pessoa) o;
        return getId() != null && Objects.equals(getId(), pessoa.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return permissaoPessoas;
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
