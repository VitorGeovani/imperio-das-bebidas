package com.sistema.resources;

import com.sistema.dto.VendaDTO;
import com.sistema.entities.Venda;
import com.sistema.services.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class VendaResource {

    @Autowired
    private VendaService vendaService;

    @GetMapping
    public ResponseEntity<List<Venda>> findAll() {
        List<Venda> vendas = vendaService.findAll();
        return ResponseEntity.ok(vendas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venda> findById(@PathVariable Long id) {
        Venda venda = vendaService.findById(id);
        return ResponseEntity.ok(venda);
    }

    @PostMapping
    public ResponseEntity<Venda> create(@Valid @RequestBody VendaDTO vendaDTO) {
        try {
            Venda venda = vendaService.fromDTO(vendaDTO);
            venda = vendaService.save(venda);

            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(venda.getId())
                    .toUri();

            return ResponseEntity.created(uri).body(venda);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao criar venda: " + e.getMessage(), e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venda> update(@PathVariable Long id, @Valid @RequestBody VendaDTO vendaDTO) {
        try {
            Venda venda = vendaService.fromDTO(vendaDTO);
            venda = vendaService.update(id, venda);
            return ResponseEntity.ok(venda);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar venda: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vendaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}