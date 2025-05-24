package com.sistema.services;

import com.sistema.entities.Cliente;
import com.sistema.exceptions.ResourceNotFoundException;
import com.sistema.repositories.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    public Cliente findById(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));
    }

    @Transactional
    public Cliente save(Cliente cliente) {
        // Validar CNPJ antes de salvar
        if (!validarCNPJ(cliente.getCnpj())) {
            throw new IllegalArgumentException("CNPJ inválido");
        }
        return clienteRepository.save(cliente);
    }

    @Transactional
    public Cliente update(Long id, Cliente cliente) {
        Cliente existingCliente = findById(id);

        // Validar CNPJ antes de atualizar
        if (!validarCNPJ(cliente.getCnpj())) {
            throw new IllegalArgumentException("CNPJ inválido");
        }

        existingCliente.setNome(cliente.getNome());
        existingCliente.setCnpj(cliente.getCnpj());
        existingCliente.setEndereco(cliente.getEndereco());
        existingCliente.setTelefone(cliente.getTelefone());
        existingCliente.setEmail(cliente.getEmail());

        return clienteRepository.save(existingCliente);
    }

    @Transactional
    public void delete(Long id) {
        Cliente cliente = findById(id);
        clienteRepository.delete(cliente);
    }

    // Método para validar CNPJ
    private boolean validarCNPJ(String cnpj) {
        cnpj = cnpj.replaceAll("[^0-9]", "");

        if (cnpj.length() != 14)
            return false;

        // Verifica se todos os dígitos são iguais
        boolean allDigitsEqual = true;
        for (int i = 1; i < cnpj.length(); i++) {
            if (cnpj.charAt(i) != cnpj.charAt(0)) {
                allDigitsEqual = false;
                break;
            }
        }
        if (allDigitsEqual)
            return false;

        // Calcula primeiro dígito verificador
        int soma = 0;
        int[] peso1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
        for (int i = 0; i < 12; i++) {
            soma += (cnpj.charAt(i) - '0') * peso1[i];
        }
        int resto = soma % 11;
        int dv1 = (resto < 2) ? 0 : 11 - resto;

        if (dv1 != (cnpj.charAt(12) - '0'))
            return false;

        // Calcula segundo dígito verificador
        soma = 0;
        int[] peso2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
        for (int i = 0; i < 13; i++) {
            soma += (cnpj.charAt(i) - '0') * peso2[i];
        }
        resto = soma % 11;
        int dv2 = (resto < 2) ? 0 : 11 - resto;

        return dv2 == (cnpj.charAt(13) - '0');
    }
}