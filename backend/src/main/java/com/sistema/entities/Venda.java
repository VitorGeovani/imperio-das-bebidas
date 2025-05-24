package com.sistema.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import javax.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ItemVenda> itens = new ArrayList<>();

    @Temporal(TemporalType.TIMESTAMP)
    private Date dataVenda;

    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal valorTotal;

    private String formaPagamento;

    private String observacoes;

    private String status;

    public Venda() {
        this.dataVenda = new Date();
        this.valorTotal = BigDecimal.ZERO;
    }

    public Venda(Long id, Cliente cliente) {
        this.id = id;
        this.cliente = cliente;
        this.dataVenda = new Date();
        this.valorTotal = BigDecimal.ZERO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public List<ItemVenda> getItens() {
        return itens;
    }

    public void setItens(List<ItemVenda> itens) {
        this.itens = itens;
    }

    public Date getDataVenda() {
        return dataVenda;
    }

    public void setDataVenda(Date dataVenda) {
        this.dataVenda = dataVenda;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public String getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Método para adicionar item e atualizar valor total
    public void adicionarItem(Produto produto, Integer quantidade) {
        ItemVenda item = new ItemVenda(this, produto, quantidade, produto.getPreco());
        this.itens.add(item);
        this.calcularValorTotal();
    }

    // Método para remover item e atualizar valor total
    public void removerItem(ItemVenda item) {
        this.itens.remove(item);
        this.calcularValorTotal();
    }

    // Método para calcular valor total da venda
    public void calcularValorTotal() {
        this.valorTotal = BigDecimal.ZERO;
        for (ItemVenda item : this.itens) {
            if (item.getSubtotal() != null) {
                this.valorTotal = this.valorTotal.add(item.getSubtotal());
            }
        }
    }
}