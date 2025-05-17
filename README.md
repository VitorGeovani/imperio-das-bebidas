<div align="center">
  <img src="frontend/Sistema/src/assets/images/logo-sem-fundo.png" alt="Império das Bebidas Logo" width="200">
</div>

# 🥂 Império das Bebidas
## 🚀 Sistema de Gerenciamento de Vendas

Este repositório contém o código fonte do sistema "Império das Bebidas", uma aplicação completa para gerenciamento de vendas de bebidas, controle de estoque e relacionamento com clientes.

### 📁 Estrutura do Projeto

O projeto está organizado em duas partes principais:
- **Frontend**: 🖌️ Aplicação Angular com interface responsiva e intuitiva
- **Backend**: ⚙️ API RESTful em Java com Spring Boot

### ⚙️ Backend

O backend é desenvolvido com Java utilizando o framework Spring Boot, oferecendo uma API RESTful robusta e escalável para o frontend.

#### 🛠️ Tecnologias Utilizadas
- Java 17
- Spring Boot 2.7
- Spring Security (JWT)
- Spring Data JPA & Hibernate
- Maven para gerenciamento de dependências
- MySQL/PostgreSQL (banco de dados)

#### 📊 Estrutura do Backend
- **Entidades**: Cliente, Produto, Usuario, Venda, ItemVenda, Categoria
- **Repositórios**: Interfaces que estendem JpaRepository para operações de CRUD otimizadas
- **Serviços**: Lógica de negócios encapsulada para cada entidade
- **Controladores (Resources)**: Endpoints RESTful da API
- **DTOs**: Objetos de transferência de dados para comunicação segura
- **Configurações**: Segurança, CORS, Jackson, Validações

#### 🔌 Endpoints Principais
- Autenticação: `/auth` - Login e gestão de tokens
- Clientes: `/clientes` - CRUD de clientes
- Produtos: `/produtos` - Gerenciamento do catálogo de bebidas
- Usuários: `/usuarios` - Administração de usuários do sistema
- Vendas: `/vendas` - Registro e consulta de vendas
- Dashboard: `/dashboard` - Métricas e estatísticas

### 🖌️ Frontend

O frontend é desenvolvido com Angular, proporcionando uma interface moderna, responsiva e amigável.

#### 🎨 Tecnologias Utilizadas
- Angular 16+
- TypeScript 5
- Bootstrap 5
- Bootstrap Icons
- RxJS para operações assíncronas
- NgCharts para visualização de dados

#### 🧩 Estrutura do Frontend
- **Components**: Componentes reutilizáveis da UI (Dashboard, Login, Vendas, etc.)
- **Services**: Lógica de comunicação com a API e gerenciamento de estado
- **Models**: Interfaces TypeScript que representam as entidades do sistema
- **Guards**: Proteção de rotas para autenticação e autorização
- **Interceptors**: Manipulação de requisições HTTP e tokens
- **Pipes**: Transformação de dados para exibição personalizada

### 🚀 Instalação e Execução

#### ⚙️ Backend
1. Navegue até o diretório `backend`
2. Execute `mvn clean install` para instalar as dependências
3. Configure o arquivo `application.properties` com suas credenciais de banco de dados
4. Execute `mvn spring-boot:run` para iniciar o servidor
5. A API estará disponível em `http://localhost:8080`

#### 🖌️ Frontend
1. Navegue até o diretório `frontend/Sistema`
2. Execute `npm install` para instalar as dependências
3. Configure o arquivo de ambiente com a URL da API
4. Execute `ng serve` para iniciar o servidor de desenvolvimento
5. Acesse `http://localhost:4200` no navegador

### 📋 Recursos

O sistema inclui funcionalidades para:
- 👥 Gerenciamento completo de clientes (cadastro, histórico de compras)
- 🍾 Cadastro e controle de produtos com categorias e níveis de estoque
- 💰 Processamento de vendas com múltiplas formas de pagamento
- 🔐 Autenticação e autorização de usuários com diferentes níveis de acesso
- 📊 Relatórios e análises de vendas com gráficos interativos
- 📱 Interface responsiva para uso em dispositivos móveis
- 🌙 Tema claro/escuro para melhor experiência do usuário

### 👨‍💻 Contribuição

Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### 📜 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

### 👥 Equipe

Este projeto foi desenvolvido pela equipe:
- 👨‍💻 Vitor Geovani e Bruno Henrique - Desenvolvimento Backend
- 👨‍💻 Vitor Geovani - Desenvolvimento Frontend
- 👨‍💻 Vitor Geovani - UI/UX e Design
- 👨‍💻 João Vitor, Emanuel e Vinicius Tenório - Testes e Documentação
- 👨‍💻 João Vitor, Emanuel e Vinicius Tenório - Testes e Documentação

### 🚧 Status do Projeto

Projeto em desenvolvimento ativo como parte do Programa Integrador (PI) do curso de Análise e Desenvolvimento de Sistemas do Centro Universitário SENAC - Santo Amaro. Atualizações semanais.

### 📞 Contato

Para mais informações sobre o projeto, entre em contato através de:
- 📧 Email: sincerev36@email.com
- 🌐 GitHub: [imperio-das-bebidas](https://github.com/VitorGeovani/imperio-das-bebidas)