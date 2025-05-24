package com.sistema.resources;

import com.sistema.entities.Usuario;
import com.sistema.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthResource {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");

        // Log para diagnóstico
        System.out.println("Tentativa de login - Email: " + email);

        Optional<Usuario> usuario = authService.authenticate(email, senha);

        if (usuario.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", usuario.get().getId());
            response.put("nome", usuario.get().getNome());
            response.put("email", usuario.get().getEmail());
            response.put("message", "Login realizado com sucesso");

            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Credenciais inválidas");
            return ResponseEntity.status(401).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody Usuario usuario) {
        Usuario newUser = authService.registerUser(usuario);
        return ResponseEntity.ok(newUser);
    }
}