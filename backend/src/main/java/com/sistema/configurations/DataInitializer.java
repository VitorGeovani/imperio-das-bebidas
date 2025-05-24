package com.sistema.configurations;

import com.sistema.entities.Cliente;
import com.sistema.entities.Produto;
import com.sistema.entities.Usuario;
import com.sistema.repositories.ClienteRepository;
import com.sistema.repositories.ProdutoRepository;
import com.sistema.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData(
            UsuarioRepository usuarioRepository,
            ClienteRepository clienteRepository,
            ProdutoRepository produtoRepository) {

        return args -> {
            // Verificar se já existem dados
            if (usuarioRepository.count() == 0) {
                // Criar usuário admin
                Usuario funcionario = new Usuario();
                funcionario.setNome("Funcionário");
                funcionario.setEmail("funcionario@imperio.com");
                funcionario.setSenha(passwordEncoder.encode("func123"));
                usuarioRepository.save(funcionario);

                System.out.println("Funcionário criado com sucesso!");
            }

            if (clienteRepository.count() == 0) {
                // Criar clientes de exemplo
                Cliente cliente1 = new Cliente();
                cliente1.setNome("Supermercado Silva");
                cliente1.setCnpj("12345678901234");
                cliente1.setEndereco("Rua das Flores, 123");
                cliente1.setTelefone("(11) 98765-4321");
                cliente1.setEmail("contato@supermercadosilva.com");
                clienteRepository.save(cliente1);

                Cliente cliente2 = new Cliente();
                cliente2.setNome("Mercearia do João");
                cliente2.setCnpj("98765432109876");
                cliente2.setEndereco("Av. Principal, 456");
                cliente2.setTelefone("(11) 91234-5678");
                cliente2.setEmail("joao@mercearia.com");
                clienteRepository.save(cliente2);

                Cliente cliente3 = new Cliente();
                cliente3.setNome("Bar do Zé");
                cliente3.setCnpj("45678912345678");
                cliente3.setEndereco("Rua das Bebidas, 789");
                cliente3.setTelefone("(11) 99876-5432");
                cliente3.setEmail("ze@bardoze.com");
                clienteRepository.save(cliente3);

                System.out.println("Clientes de exemplo criados com sucesso!");
            }

            if (produtoRepository.count() == 0) {
                // Criar produtos de exemplo
                Produto produto1 = new Produto();
                produto1.setNome("Cerveja Pilsen");
                produto1.setDescricao("Cerveja tipo Pilsen 600ml");
                produto1.setPreco(new BigDecimal("8.50"));
                produto1.setQuantidade(100);
                produto1.setCategoria("Cervejas");
                produto1.setFornecedor("Distribuidora Ambev");
                produtoRepository.save(produto1);

                Produto produto2 = new Produto();
                produto2.setNome("Vinho Tinto Seco");
                produto2.setDescricao("Vinho tinto seco 750ml");
                produto2.setPreco(new BigDecimal("45.90"));
                produto2.setQuantidade(50);
                produto2.setCategoria("Vinhos");
                produto2.setFornecedor("Vinícola Serra");
                produtoRepository.save(produto2);

                Produto produto3 = new Produto();
                produto3.setNome("Whisky Premium");
                produto3.setDescricao("Whisky 12 anos 750ml");
                produto3.setPreco(new BigDecimal("120.00"));
                produto3.setQuantidade(25);
                produto3.setCategoria("Destilados");
                produto3.setFornecedor("Importadora Global");
                produtoRepository.save(produto3);

                Produto produto4 = new Produto();
                produto4.setNome("Refrigerante Cola");
                produto4.setDescricao("Refrigerante sabor cola 2L");
                produto4.setPreco(new BigDecimal("9.90"));
                produto4.setQuantidade(200);
                produto4.setCategoria("Não Alcoólicos");
                produto4.setFornecedor("Distribuidora Nacional");
                produtoRepository.save(produto4);

                System.out.println("Produtos de exemplo criados com sucesso!");
            }
        };
    }
}