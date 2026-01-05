# 📡 Telemetry API - Sistema de Telemetria Multi-Tenant

API REST para coleta e gerenciamento de dados de telemetria de dispositivos IoT com suporte a múltiplos tenants e isolamento de dados.

---

## 📋 Sobre o Projeto

Sistema de telemetria desenvolvido para gerenciar dispositivos IoT e suas leituras de sensores, com foco em:

-   🔐 **Multi-tenancy:** Isolamento completo de dados entre diferentes tenants
-   📊 **Telemetria em tempo real:** Coleta e armazenamento de leituras de sensores
-   🔒 **Segurança:** Autenticação JWT e validação rigorosa de permissões
-   🧪 **Testabilidade:** Cobertura completa com testes de integração
-   🏗️ **Arquitetura limpa:** Separação de responsabilidades e alta manutenibilidade

---

## 🏛️ Arquitetura

O projeto segue uma **Arquitetura em Camadas (Layered Architecture)** com clara separação de responsabilidades:

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                  │
│   (Controllers, Middlewares, Routes)        │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│         Application Layer                   │
│      (Use Cases, DTOs, Business Logic)      │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│           Domain Layer                      │
│    (Entities, Interfaces, Repositories)     │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│        Infrastructure Layer                 │
│  (Database, External Services, Containers)  │
└─────────────────────────────────────────────┘
```

### Camadas

-   **Presentation:** Responsável pela comunicação HTTP (Express, Controllers, Middlewares)
-   **Application:** Contém a lógica de negócio (Use Cases, DTOs)
-   **Domain:** Define as entidades e contratos (Entities, Repository Interfaces)
-   **Infrastructure:** Implementação concreta (Repositories, Database, DI Container)

### Principais Tecnologias

| Tecnologia               | Propósito                         |
| ------------------------ | --------------------------------- |
| **Node.js + TypeScript** | Runtime e tipagem estática        |
| **Express.js**           | Framework web                     |
| **PostgreSQL**           | Banco de dados relacional         |
| **Drizzle ORM**          | ORM e gerenciamento de migrations |
| **TSyringe**             | Injeção de dependências           |
| **JWT**                  | Autenticação e autorização        |
| **Jest + Supertest**     | Testes de integração              |
| **Docker Compose**       | Orquestração de containers        |

---

## 📦 Funcionalidades

### Gerenciamento de Tenants

-   ✅ Criação de tenants (usuários)
-   ✅ Autenticação via JWT
-   ✅ Isolamento completo de dados

### Gerenciamento de Dispositivos

-   ✅ Registro de dispositivos por tenant
-   ✅ Listagem de dispositivos do tenant autenticado
-   ✅ Validação de propriedade de dispositivos

### Telemetria (Sensor Readings)

-   ✅ Criação de leituras de sensores
-   ✅ Listagem das últimas 10 leituras por dispositivo
-   ✅ Validação de multi-tenancy em todas as operações
-   ✅ Timestamps automáticos

---

## 🚀 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

-   **Node.js** v18.x ou superior
-   **Docker** e **Docker Compose**
-   **Git**

---

## 📥 Instalação

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd project-open-telemetry
```

### 2. Instalar dependências

```bash
npm install
```

#### Dependências Principais

```bash
# Framework web
npm install express cors morgan helmet

# Tipagens TypeScript
npm install @types/express @types/cors @types/morgan @types/helmet

# Database & ORM
npm install drizzle-orm pg dotenv
npm install -D drizzle-kit tsx @types/pg

# Autenticação e Segurança
npm install jsonwebtoken bcrypt
npm install -D @types/jsonwebtoken @types/bcrypt

# Injeção de Dependências
npm install tsyringe reflect-metadata

# Desenvolvimento
npm install -D typescript ts-node nodemon

# Testes
npm install -D jest ts-jest @types/jest supertest @types/supertest cross-env
```

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://telemetry:telemetry@localhost:5432/TELEMETRY
SECRET_KEY=g1pcGImdLwQGd09zJcIBhG6Xc-9lQPiH
SERVER_PORT=4000
```

Crie o arquivo `.env.test` para testes:

```env
DATABASE_URL=postgresql://telemetry:telemetry@localhost:5432/TELEMETRY_TEST
SECRET_KEY=test-secret-key-for-integration-tests
SERVER_PORT=4001
```

### 2. Subir Containers Docker

```bash
cd docker
docker-compose up -d
```

**Serviços disponíveis:**

-   **PostgreSQL:** `localhost:5432`
-   **pgAdmin:** `http://localhost:5050`
    -   Email: `admin@admin.com`
    -   Senha: `admin`

### 3. Configurar pgAdmin (Primeira vez)

1. Acesse `http://localhost:5050`
2. Faça login com as credenciais acima
3. Adicione um novo servidor:
    - **Name:** `Telemetry`
    - **Host:** `postgres`
    - **Port:** `5432`
    - **Username:** `telemetry`
    - **Password:** `telemetry`
    - **Database:** `TELEMETRY`

### 4. Criar banco de testes

No pgAdmin, execute o SQL:

```sql
CREATE DATABASE "TELEMETRY_TEST";
```

---

## 🗄️ Migrations

### Banco de Desenvolvimento

```bash
npm run db:push
```

### Banco de Testes

```bash
npx cross-env DATABASE_URL=postgresql://telemetry:telemetry@localhost:5432/TELEMETRY_TEST npm run db:push
```

### Outros comandos de migration

```bash
# Gerar migrations a partir do schema
npm run db:generate

# Aplicar migrations
npm run db:migrate
```

---

## ▶️ Executando a Aplicação

### Modo Desenvolvimento (com hot-reload)

```bash
npm run dev
```

A API estará disponível em: `http://localhost:4000`

---

## 🧪 Testes

### Testes de Integração

```bash
# Rodar todos os testes
npm test

# Rodar em modo watch (desenvolvimento)
npm run test:watch

# Rodar com cobertura de código
npm run test:coverage
```

### Script de Teste Manual (Bash)

```bash
# Certifique-se de que o servidor está rodando
npm run dev

# Em outro terminal, execute o script
bash test-tenant-isolation.sh
```

**Os testes validam:**

-   ✅ Isolamento entre tenants
-   ✅ Autenticação JWT
-   ✅ Criação e listagem de dispositivos
-   ✅ Criação e listagem de sensor readings
-   ✅ Validação de permissões (403, 404, 401)

---

## 📁 Estrutura do Projeto

```
project-open-telemetry/
├── src/
│   ├── application/           # Camada de Aplicação
│   │   ├── dtos/             # Data Transfer Objects
│   │   └── usecases/         # Casos de uso (lógica de negócio)
│   │
│   ├── domain/               # Camada de Domínio
│   │   └── telemetry/
│   │       ├── entities/     # Entidades de domínio
│   │       └── repositories/ # Interfaces dos repositórios
│   │
│   ├── infrastructure/       # Camada de Infraestrutura
│   │   ├── container/        # Configuração do TSyringe
│   │   ├── database/         # Configuração do banco (Drizzle)
│   │   ├── repositories/     # Implementações concretas
│   │   └── server/           # Configuração do Express
│   │
│   └── presentation/         # Camada de Apresentação
│       └── http/
│           ├── controllers/  # Controllers HTTP
│           ├── middlewares/  # Middlewares (Auth, etc)
│           └── routes/       # Rotas da API
│
├── tests/                    # Testes de integração
│   ├── helpers/             # Helpers para testes
│   └── integration/         # Testes de integração
│
├── docker/                   # Docker Compose
├── drizzle/                  # Migrations do Drizzle
├── .env                      # Variáveis de ambiente (dev)
├── .env.test                 # Variáveis de ambiente (test)
└── package.json
```

---

## 🔌 API Endpoints

### Autenticação

#### `POST /api/v1/tenant`

Cria um novo tenant (usuário).

**Request:**

```json
{
    "username": "usuario",
    "password": "senha123"
}
```

**Response:** `201 Created`

```json
{
    "id": "uuid",
    "username": "usuario"
}
```

#### `POST /api/v1/auth/login`

Realiza login e retorna token JWT.

**Request:**

```json
{
    "username": "usuario",
    "password": "senha123"
}
```

**Response:** `200 OK`

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tenantId": "uuid",
    "username": "usuario"
}
```

---

### Dispositivos (Requer autenticação)

#### `POST /api/v1/device`

Cria um novo dispositivo para o tenant autenticado.

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
    "name": "Sensor Temperatura 01"
}
```

**Response:** `201 Created`

```json
{
    "id": "uuid",
    "name": "Sensor Temperatura 01",
    "tenantId": "uuid"
}
```

#### `GET /api/v1/device`

Lista todos os dispositivos do tenant autenticado.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
[
    {
        "id": "uuid",
        "name": "Sensor Temperatura 01",
        "tenantId": "uuid"
    }
]
```

---

### Telemetria (Requer autenticação)

#### `POST /api/v1/telemetry`

Cria uma nova leitura de sensor.

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
    "deviceId": "uuid-do-device",
    "value": 25.5
}
```

**Response:** `201 Created`

```json
{
    "id": "uuid",
    "deviceId": "uuid-do-device",
    "tenantId": "uuid",
    "value": 25.5,
    "timestamp": "2026-01-05T12:34:56.789Z"
}
```

#### `GET /api/v1/telemetry/:deviceId`

Lista as últimas 10 leituras de um dispositivo.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
[
    {
        "id": "uuid",
        "deviceId": "uuid-do-device",
        "tenantId": "uuid",
        "value": 25.5,
        "timestamp": "2026-01-05T12:34:56.789Z"
    }
]
```

---

## 🔒 Segurança

### Multi-Tenancy

-   Todos os endpoints protegidos validam o `tenantId` do token JWT
-   Não é possível acessar ou modificar dados de outros tenants
-   Validação em todas as camadas (Controller, Use Case, Repository)

### Autenticação

-   Tokens JWT com expiração configurável
-   Senhas hasheadas com bcrypt (salt rounds: 10)
-   Middleware de autenticação em todas as rotas protegidas

### Códigos HTTP

| Código | Significado                                             |
| ------ | ------------------------------------------------------- |
| `200`  | Sucesso                                                 |
| `201`  | Criado com sucesso                                      |
| `400`  | Requisição inválida (parâmetros faltando)               |
| `401`  | Não autenticado (token inválido ou ausente)             |
| `403`  | Proibido (tentativa de acessar recurso de outro tenant) |
| `404`  | Recurso não encontrado                                  |
| `500`  | Erro interno do servidor                                |

---

## 🛠️ Scripts Disponíveis

| Comando                 | Descrição                                 |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Inicia o servidor em modo desenvolvimento |
| `npm test`              | Executa os testes de integração           |
| `npm run test:watch`    | Testes em modo watch                      |
| `npm run test:coverage` | Testes com relatório de cobertura         |
| `npm run db:generate`   | Gera migrations do Drizzle                |
| `npm run db:migrate`    | Aplica migrations                         |
| `npm run db:push`       | Sincroniza schema com banco               |

---

## 🐛 Troubleshooting

### Porta 4000 já está em uso

**Windows:**

```bash
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

**Linux/Mac:**

```bash
lsof -ti:4000 | xargs kill -9
```

### Banco de dados não conecta

1. Verifique se os containers estão rodando:

    ```bash
    cd docker
    docker-compose ps
    ```

2. Reinicie os containers:
    ```bash
    docker-compose down
    docker-compose up -d
    ```

### Testes falhando

1. Certifique-se de que o banco `TELEMETRY_TEST` existe
2. Rode as migrations no banco de teste:
    ```bash
    npx cross-env DATABASE_URL=postgresql://telemetry:telemetry@localhost:5432/TELEMETRY_TEST npm run db:push
    ```

---

## 📝 Licença

ISC

---

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando Node.js e TypeScript**
