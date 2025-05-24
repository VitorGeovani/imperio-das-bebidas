package com.sistema.services;

import com.sistema.dto.ItemVendaDTO;
import com.sistema.dto.VendaDTO;
import com.sistema.entities.Cliente;
import com.sistema.entities.ItemVenda;
import com.sistema.entities.Produto;
import com.sistema.entities.Venda;
import com.sistema.exceptions.ResourceNotFoundException;
import com.sistema.repositories.ClienteRepository;
import com.sistema.repositories.ItemVendaRepository;
import com.sistema.repositories.ProdutoRepository;
import com.sistema.repositories.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ItemVendaRepository itemVendaRepository;

    @Autowired
    private ProdutoService produtoService;

    private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    public List<Venda> findAll() {
        return vendaRepository.findAll();
    }

    public Venda findById(Long id) {
        return vendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada com id: " + id));
    }

    public Venda fromDTO(VendaDTO dto) {
        try {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Cliente não encontrado com id: " + dto.getClienteId()));

            Venda venda = new Venda();
            venda.setId(dto.getId());
            venda.setCliente(cliente);

            // Parse da data
            if (dto.getDataVenda() != null && !dto.getDataVenda().isEmpty()) {
                venda.setDataVenda(sdf.parse(dto.getDataVenda()));
            } else {
                venda.setDataVenda(new Date());
            }

            venda.setFormaPagamento(dto.getFormaPagamento());
            venda.setObservacoes(dto.getObservacoes());
            venda.setStatus(dto.getStatus());

            // Processar itens
            List<ItemVenda> itens = new ArrayList<>();
            if (dto.getItens() != null) {
                for (ItemVendaDTO itemDTO : dto.getItens()) {
                    Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Produto não encontrado com id: " + itemDTO.getProdutoId()));

                    ItemVenda item = new ItemVenda();
                    if (itemDTO.getId() != null) {
                        item.setId(itemDTO.getId());
                    }

                    item.setVenda(venda);
                    item.setProduto(produto);
                    item.setQuantidade(itemDTO.getQuantidade());

                    // Converter precoUnitario do frontend para valorUnitario no backend
                    item.setValorUnitario(
                            itemDTO.getPrecoUnitario() != null ? itemDTO.getPrecoUnitario() : produto.getPreco());

                    itens.add(item);
                }
            }

            venda.setItens(itens);
            return venda;

        } catch (ParseException e) {
            throw new RuntimeException("Erro ao processar a data da venda: " + e.getMessage());
        }
    }

    @Transactional
    public Venda save(Venda venda) {
        if (venda.getDataVenda() == null) {
            venda.setDataVenda(new Date());
        }

        // Salvar venda para gerar ID
        venda = vendaRepository.save(venda);

        // Lista para armazenar os itens que serão persistidos
        List<ItemVenda> itensParaSalvar = new ArrayList<>();

        // Verificar estoque e processar itens
        for (ItemVenda item : venda.getItens()) {
            Produto produto = item.getProduto();

            // Verificar se há quantidade suficiente em estoque
            if (produto.getQuantidade() < item.getQuantidade()) {
                throw new IllegalStateException(
                        "Quantidade insuficiente em estoque para o produto: " + produto.getNome());
            }

            // Atualizar referência da venda
            item.setVenda(venda);
            itensParaSalvar.add(item);

            // Atualizar estoque
            produtoService.reduzirEstoque(produto.getId(), item.getQuantidade());
        }

        // Salvar os itens
        for (ItemVenda item : itensParaSalvar) {
            itemVendaRepository.save(item);
        }

        // Calcular valor total da venda
        venda.calcularValorTotal();

        return vendaRepository.save(venda);
    }

    @Transactional
    public Venda update(Long id, Venda novaVenda) {
        Venda vendaExistente = vendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada com id: " + id));

        // Atualizar dados básicos
        vendaExistente.setCliente(novaVenda.getCliente());
        vendaExistente.setDataVenda(novaVenda.getDataVenda());
        vendaExistente.setFormaPagamento(novaVenda.getFormaPagamento());
        vendaExistente.setObservacoes(novaVenda.getObservacoes());
        vendaExistente.setStatus(novaVenda.getStatus());

        // Excluir itens removidos e retornar produtos ao estoque
        List<ItemVenda> itensAntigos = new ArrayList<>(vendaExistente.getItens());

        for (ItemVenda itemAntigo : itensAntigos) {
            boolean encontrado = false;
            for (ItemVenda novoItem : novaVenda.getItens()) {
                if (novoItem.getId() != null && novoItem.getId().equals(itemAntigo.getId())) {
                    encontrado = true;
                    break;
                }
            }

            if (!encontrado) {
                // Retornar o item ao estoque
                produtoService.aumentarEstoque(itemAntigo.getProduto().getId(), itemAntigo.getQuantidade());

                // Remover o item da venda e excluí-lo
                vendaExistente.getItens().remove(itemAntigo);
                itemVendaRepository.deleteById(itemAntigo.getId());
            }
        }

        // Processar novos itens e atualizações
        for (ItemVenda novoItem : novaVenda.getItens()) {
            if (novoItem.getId() == null) {
                // Novo item
                novoItem.setVenda(vendaExistente);
                vendaExistente.getItens().add(novoItem);

                // Atualizar estoque
                produtoService.reduzirEstoque(novoItem.getProduto().getId(), novoItem.getQuantidade());

                itemVendaRepository.save(novoItem);
            } else {
                // Item existente - verificar se precisa atualizar
                Optional<ItemVenda> itemExistente = vendaExistente.getItens().stream()
                        .filter(i -> i.getId().equals(novoItem.getId()))
                        .findFirst();

                if (itemExistente.isPresent()) {
                    ItemVenda item = itemExistente.get();

                    // Se a quantidade mudou, ajustar o estoque
                    if (item.getQuantidade() != novoItem.getQuantidade()) {
                        if (item.getQuantidade() < novoItem.getQuantidade()) {
                            // Aumentou a quantidade - reduzir estoque
                            int diferenca = novoItem.getQuantidade() - item.getQuantidade();
                            produtoService.reduzirEstoque(item.getProduto().getId(), diferenca);
                        } else {
                            // Diminuiu a quantidade - aumentar estoque
                            int diferenca = item.getQuantidade() - novoItem.getQuantidade();
                            produtoService.aumentarEstoque(item.getProduto().getId(), diferenca);
                        }

                        item.setQuantidade(novoItem.getQuantidade());
                        item.setValorUnitario(novoItem.getValorUnitario());
                        itemVendaRepository.save(item);
                    }
                }
            }
        }

        // Recalcular valor total
        vendaExistente.calcularValorTotal();

        return vendaRepository.save(vendaExistente);
    }

    @Transactional
    public void delete(Long id) {
        Venda venda = vendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada com id: " + id));

        // Devolver produtos ao estoque
        for (ItemVenda item : venda.getItens()) {
            produtoService.aumentarEstoque(item.getProduto().getId(), item.getQuantidade());
        }

        // Remover venda e seus itens
        vendaRepository.deleteById(id);
    }
}