package com.sistema.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.DecimalMin;
import java.math.BigDecimal;

@Entity
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class ItemVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "venda_id")
    @JsonIgnoreProperties("itens")
    private Venda venda;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "produto_id")
    private Produto produto;

    @Min(value = 1, message = "Quantidade deve ser pelo menos 1")
    private Integer quantidade;

    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal valorUnitario;

    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal subtotal;

    public ItemVenda() {
    }

    public ItemVenda(Venda venda, Produto produto, Integer quantidade, BigDecimal valorUnitario) {
        this.venda = venda;
        this.produto = produto;
        this.quantidade = quantidade;
        this.valorUnitario = valorUnitario;
        calcularSubtotal();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Venda getVenda() {
        return venda;
    }

    public void setVenda(Venda venda) {
        this.venda = venda;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
        this.calcularSubtotal();
    }

    public BigDecimal getValorUnitario() {
        return valorUnitario;
    }

    public void setValorUnitario(BigDecimal valorUnitario) {
        this.valorUnitario = valorUnitario;
        this.calcularSubtotal();
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    // Método para atualizar subtotal
    public void calcularSubtotal() {
        if (this.quantidade != null && this.valorUnitario != null) {
            this.subtotal = this.valorUnitario.multiply(BigDecimal.valueOf(this.quantidade));
        }
    }
}