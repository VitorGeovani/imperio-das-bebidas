package com.sistema.services;

import com.sistema.entities.Usuario;
import com.sistema.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Optional<Usuario> authenticate(String email, String senha) {
        // Log para diagnóstico
        System.out.println("Autenticando usuário: " + email);

        // Verificar credenciais de admin hardcoded
        if ("admin@imperio.com".equals(email) && "admin123".equals(senha)) {
            System.out.println("Autenticação bem-sucedida para admin");
            // Criar um usuário admin fictício para autenticação
            Usuario adminUser = new Usuario();
            adminUser.setId(1L);
            adminUser.setNome("Administrador");
            adminUser.setEmail("admin@imperio.com");
            return Optional.of(adminUser);
        }

        // Verificar credenciais de usuário padrão
        if ("funcionario@imperio.com".equals(email) && "func123".equals(senha)) {
            System.out.println("Autenticação bem-sucedida para user");
            Usuario standardUser = new Usuario();
            standardUser.setId(2L);
            standardUser.setNome("Usuário Padrão");
            standardUser.setEmail("user");
            return Optional.of(standardUser);
        }

        // Verificar no banco de dados
        try {
            Usuario usuario = usuarioRepository.findByEmail(email);
            if (usuario != null && passwordEncoder.matches(senha, usuario.getSenha())) {
                System.out.println("Autenticação bem-sucedida para usuário do banco de dados: " + email);
                return Optional.of(usuario);
            }
        } catch (Exception e) {
            System.err.println("Erro ao verificar usuário no banco de dados: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("Autenticação falhou para: " + email);
        return Optional.empty();
    }

    @Transactional
    public Usuario registerUser(Usuario usuario) {
        // Criptografar a senha antes de salvar
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }
}