# Guia Completo: Deploy Gratuito no Render

## Visao Geral do Projeto

Este projeto "Cruzador de Planilhas" e uma aplicacao full-stack com:
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Express.js + TypeScript
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Autenticacao**: Sessions com connect-pg-simple

---

## IMPORTANTE: Limitacoes do Render Gratuito

Antes de comecar, saiba que o plano gratuito do Render tem limitacoes:

| Recurso | Limite Gratuito |
|---------|-----------------|
| Banco PostgreSQL | **Expira em 30 dias** (depois e deletado!) |
| Armazenamento DB | 1 GB |
| RAM do DB | 256 MB |
| Horas de instancia | 750 horas/mes |
| Bandwidth | 100 GB/mes |

**ATENCAO**: O banco de dados gratuito do Render expira em 30 dias e seus dados serao perdidos. Para uso permanente, considere alternativas como Neon (gratuito sem expiracao) ou upgrade para plano pago.

---

## Passo 1: Preparar o Codigo para Deploy

### 1.1 Criar conta no GitHub (se nao tiver)
1. Acesse https://github.com
2. Clique em "Sign up"
3. Siga as instrucoes para criar sua conta

### 1.2 Criar repositorio no GitHub
1. Clique no "+" no canto superior direito
2. Selecione "New repository"
3. Nome: `cruzador-planilhas` (ou outro nome)
4. Marque como "Private" se quiser manter privado
5. Clique "Create repository"

### 1.3 Subir o codigo para o GitHub

No terminal do Replit, execute:

```bash
# Inicializar Git (se ainda nao foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit - Cruzador de Planilhas"

# Conectar ao seu repositorio GitHub (substitua pelo seu usuario)
git remote add origin https://github.com/SEU_USUARIO/cruzador-planilhas.git

# Enviar o codigo
git branch -M main
git push -u origin main
```

---

## Passo 2: Criar Conta no Render

1. Acesse https://render.com
2. Clique em "Get Started for Free"
3. Escolha "Sign in with GitHub" (recomendado para facilitar)
4. Autorize o Render a acessar seu GitHub
5. Complete o cadastro (nao precisa de cartao de credito)

---

## Passo 3: Criar o Banco de Dados PostgreSQL

### 3.1 Criar o banco

1. No Dashboard do Render, clique em "New +"
2. Selecione "PostgreSQL"
3. Preencha os campos:
   - **Name**: `cruzador-db`
   - **Database**: `cruzador` (ou deixe em branco para gerar automatico)
   - **User**: `cruzador_user` (ou deixe em branco)
   - **Region**: Escolha a mais proxima (Oregon e boa para Brasil)
   - **PostgreSQL Version**: 16
   - **Instance Type**: **Free** (selecione esta opcao!)

4. Clique em "Create Database"
5. Aguarde a criacao (pode levar 1-2 minutos)

### 3.2 Copiar a URL de conexao

1. Apos criado, acesse o banco de dados no Dashboard
2. Procure por **"Internal Database URL"** ou **"External Database URL"**
3. Copie a **Internal Database URL** - vai ser algo como:
   ```
   postgres://cruzador_user:SENHA_LONGA@dpg-xyz123.oregon-postgres.render.com/cruzador
   ```
4. **GUARDE ESSA URL!** Voce vai precisar dela no proximo passo

---

## Passo 4: Criar o Web Service

### 4.1 Criar o servico

1. No Dashboard do Render, clique em "New +"
2. Selecione "Web Service"
3. Escolha "Build and deploy from a Git repository"
4. Clique "Next"
5. Conecte seu repositorio GitHub:
   - Se nao aparecer, clique em "Configure account" para dar permissao
   - Selecione o repositorio `cruzador-planilhas`
6. Clique "Connect"

### 4.2 Configurar o servico

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | `cruzador-planilhas` |
| **Region** | Mesma regiao do banco de dados |
| **Branch** | `main` |
| **Root Directory** | (deixe em branco) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build && npm run db:push && npm run db:seed` |
| **Start Command** | `npm run start` |
| **Instance Type** | **Free** |

### 4.3 Adicionar variaveis de ambiente

Role para baixo ate "Environment Variables" e adicione:

| Variavel | Valor |
|----------|-------|
| `DATABASE_URL` | Cole a Internal Database URL do passo 3.2 |
| `SESSION_SECRET` | Uma senha forte (ex: `minha-senha-super-secreta-2024`) |
| `NODE_ENV` | `production` |
| `ADMIN_USERNAME` | `admin` (ou outro nome de usuario) |
| `ADMIN_PASSWORD` | Uma senha forte para o admin |

**DICA**: Para gerar uma senha forte para SESSION_SECRET, use:
```
Use qualquer gerador de senhas ou crie uma com pelo menos 32 caracteres
Exemplo: J7#kL9@mN2$pQ4&rT6*vX8!yZ0
```

### 4.4 Criar o servico

1. Clique em "Create Web Service"
2. Aguarde o deploy (primeira vez pode levar 5-10 minutos)
3. Acompanhe os logs para ver se tudo esta funcionando

---

## Passo 5: Verificar o Deploy

### 5.1 Acessar a aplicacao

1. Apos o deploy concluir, voce vera um link como:
   `https://cruzador-planilhas.onrender.com`
2. Clique para abrir sua aplicacao
3. Faca login com as credenciais definidas em ADMIN_USERNAME e ADMIN_PASSWORD

### 5.2 Verificar os logs

Se algo der errado:
1. No Dashboard do servico, clique em "Logs"
2. Procure por mensagens de erro
3. Os erros mais comuns sao:
   - DATABASE_URL incorreta
   - Falta de variaveis de ambiente

---

## Passo 6: Manutencao

### Atualizar a aplicacao

Sempre que fizer mudancas no codigo:

```bash
git add .
git commit -m "Descricao da mudanca"
git push
```

O Render detectara automaticamente e fara um novo deploy.

### Renovar o banco de dados (a cada 30 dias)

**IMPORTANTE**: O banco de dados gratuito expira em 30 dias!

1. Voce recebera um email do Render avisando da expiracao
2. Para continuar usando gratuitamente:
   - Exporte seus dados antes da expiracao
   - Delete o banco antigo
   - Crie um novo banco de dados gratuito
   - Atualize a DATABASE_URL no Web Service
   - Re-execute o seed para criar o usuario admin

---

## Alternativas Gratuitas ao Banco do Render

Se voce precisa de um banco permanente e gratuito, considere:

### Opcao 1: Neon (Recomendado)
- **Gratuito para sempre** (sem expiracao)
- 512 MB de armazenamento
- Site: https://neon.tech

Para usar o Neon:
1. Crie uma conta em https://neon.tech
2. Crie um novo projeto
3. Copie a connection string
4. Use essa URL no lugar da DATABASE_URL no Render

### Opcao 2: Supabase
- **Gratuito para sempre**
- 500 MB de armazenamento
- Site: https://supabase.com

### Opcao 3: ElephantSQL (Plano Tiny Turtle)
- **Gratuito para sempre**
- 20 MB de armazenamento (muito limitado)
- Site: https://www.elephantsql.com

---

## Resumo dos Comandos de Build

| Comando | Descricao |
|---------|-----------|
| `npm install` | Instala dependencias |
| `npm run build` | Compila o frontend e backend |
| `npm run db:push` | Cria as tabelas no banco de dados |
| `npm run db:seed` | Cria o usuario admin |
| `npm run start` | Inicia o servidor em producao |

---

## Custos

| Servico | Custo |
|---------|-------|
| Render Web Service (Free) | **R$ 0** |
| Render PostgreSQL (Free) | **R$ 0** (expira em 30 dias) |
| GitHub (Private repo) | **R$ 0** |
| **Total** | **R$ 0** |

---

## Troubleshooting (Solucao de Problemas)

### Erro: "DATABASE_URL must be set"
- Verifique se a variavel DATABASE_URL esta configurada no Render
- Certifique-se de que copiou a URL corretamente

### Erro: "Connection refused"
- Use a **Internal Database URL** (nao a External)
- Verifique se o banco esta na mesma regiao do Web Service

### Erro: "Build failed"
- Verifique os logs de build
- Certifique-se de que o package.json esta correto

### Aplicacao lenta ou "desliga"
- O plano gratuito do Render "dorme" apos 15 minutos de inatividade
- A primeira requisicao apos dormir pode levar 30-60 segundos
- Isso e normal no plano gratuito

---

## Conclusao

Seu projeto **pode sim** ser implantado gratuitamente no Render! A unica limitacao significativa e que o banco de dados gratuito expira a cada 30 dias.

Para uma solucao permanente e 100% gratuita, recomendo:
1. **Web Service**: Render (gratuito)
2. **Banco de Dados**: Neon (gratuito e sem expiracao)

Boa sorte com o deploy!
