package com.sistema.services;

import com.sistema.entities.Produto;
import com.sistema.exceptions.ResourceNotFoundException;
import com.sistema.repositories.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Produto> findAll() {
        return produtoRepository.findAll();
    }

    public Produto findById(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com id: " + id));
    }

    public Produto save(Produto produto) {
        return produtoRepository.save(produto);
    }

    public Produto update(Long id, Produto produto) {
        Produto existingProduto = findById(id);

        existingProduto.setNome(produto.getNome());
        existingProduto.setPreco(produto.getPreco());
        existingProduto.setQuantidade(produto.getQuantidade());
        existingProduto.setDescricao(produto.getDescricao());
        existingProduto.setCategoria(produto.getCategoria());
        existingProduto.setFornecedor(produto.getFornecedor());

        return produtoRepository.save(existingProduto);
    }

    public void delete(Long id) {
        Produto produto = findById(id);
        produtoRepository.delete(produto);
    }

    // Método para reduzir a quantidade de produtos em estoque
    @Transactional
    public void reduzirEstoque(Long produtoId, Integer quantidade) {
        Produto produto = findById(produtoId);

        if (produto.getQuantidade() < quantidade) {
            throw new IllegalStateException("Quantidade insuficiente em estoque para o produto: " + produto.getNome());
        }

        produto.setQuantidade(produto.getQuantidade() - quantidade);
        produtoRepository.save(produto);
    }

    // Método para aumentar a quantidade de produtos em estoque
    @Transactional
    public void aumentarEstoque(Long produtoId, Integer quantidade) {
        Produto produto = findById(produtoId);
        produto.setQuantidade(produto.getQuantidade() + quantidade);
        produtoRepository.save(produto);
    }

    // Para compatibilidade com código existente
    @Transactional
    public void atualizarEstoque(Long produtoId, Integer quantidade) {
        reduzirEstoque(produtoId, quantidade);
    }
}