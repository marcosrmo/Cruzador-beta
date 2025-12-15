# Guia Completo: Deploy GRATUITO com Neon + Render

Este guia mostra como publicar seu projeto "Cruzador de Planilhas" de forma **100% gratuita e permanente** usando:

- **Neon**: Banco de dados PostgreSQL gratuito (sem expiracao!)
- **Render**: Hospedagem do servidor (gratuito)

---

## Resumo dos Custos

| Servico | Custo | Limitacoes |
|---------|-------|------------|
| Neon (PostgreSQL) | **R$ 0** | 512 MB storage, sem expiracao |
| Render (Web Service) | **R$ 0** | "Dorme" apos 15 min inativo |
| GitHub | **R$ 0** | Repositorios privados gratis |
| **TOTAL** | **R$ 0** | - |

---

## PARTE 1: Criar Banco de Dados no Neon

### Passo 1.1: Criar conta no Neon

1. Acesse https://neon.tech
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"** (mais facil)
4. Autorize o acesso
5. Sua conta esta criada!

### Passo 1.2: Criar um novo projeto

1. No dashboard, clique em **"New Project"**
2. Preencha:
   - **Project name**: `cruzador-planilhas`
   - **Region**: Escolha a mais proxima (ex: `US East` ou `Europe`)
   - **Postgres version**: 16 (ou a mais recente)
3. Clique em **"Create Project"**

### Passo 1.3: Obter a Connection String

1. Apos criar, voce vera a tela do projeto
2. Procure por **"Connection string"** ou **"Connection Details"**
3. Clique em **"Show password"** para revelar a senha
4. Copie a **Connection string** completa. Sera algo como:

```
postgresql://neondb_owner:AbCdEf123456@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

5. **GUARDE ESSA URL!** Voce vai precisar dela no Render

---

## PARTE 2: Preparar o Codigo no GitHub

### Passo 2.1: Criar conta no GitHub (se nao tiver)

1. Acesse https://github.com
2. Clique em **"Sign up"**
3. Siga as instrucoes

### Passo 2.2: Criar repositorio

1. Clique no **"+"** no canto superior direito
2. Selecione **"New repository"**
3. Preencha:
   - **Repository name**: `cruzador-planilhas`
   - **Visibility**: Private (recomendado)
4. Clique **"Create repository"**
5. Nao adicione README nem .gitignore (ja temos)

### Passo 2.3: Subir o codigo

No terminal do Replit, execute estes comandos:

```bash
# Inicializar Git (se ainda nao foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Versao inicial - Cruzador de Planilhas"

# Conectar ao GitHub (SUBSTITUA seu-usuario pelo seu usuario do GitHub)
git remote add origin https://github.com/SEU-USUARIO/cruzador-planilhas.git

# Enviar o codigo
git branch -M main
git push -u origin main
```

**Nota**: O GitHub vai pedir suas credenciais. Use seu usuario e um Personal Access Token (nao a senha normal).

Para criar um token:
1. GitHub > Settings > Developer settings > Personal access tokens > Generate new token
2. De permissao de "repo"
3. Use esse token como senha

---

## PARTE 3: Criar o Web Service no Render

### Passo 3.1: Criar conta no Render

1. Acesse https://render.com
2. Clique em **"Get Started for Free"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Render

### Passo 3.2: Criar Web Service

1. No Dashboard, clique em **"New +"**
2. Selecione **"Web Service"**
3. Escolha **"Build and deploy from a Git repository"**
4. Clique **"Next"**

### Passo 3.3: Conectar repositorio

1. Se nao aparecer seu repositorio, clique em **"Configure account"**
2. Autorize o Render a acessar seus repositorios
3. Selecione o repositorio `cruzador-planilhas`
4. Clique **"Connect"**

### Passo 3.4: Configurar o servico

Preencha EXATAMENTE assim:

| Campo | Valor |
|-------|-------|
| **Name** | `cruzador-planilhas` |
| **Region** | `Oregon (US West)` ou proxima |
| **Branch** | `main` |
| **Root Directory** | (deixe em branco) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build && npm run db:push` |
| **Start Command** | `npm run start` |
| **Instance Type** | **Free** |

### Passo 3.5: Adicionar variaveis de ambiente

Role ate **"Environment Variables"** e adicione:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | (Cole a Connection String do Neon - Passo 1.3) |
| `SESSION_SECRET` | `sua-senha-super-secreta-aqui-2024` |
| `NODE_ENV` | `production` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `SuaSenhaForte123!` |

**IMPORTANTE sobre SESSION_SECRET:**
- Use uma senha longa e aleatoria
- Exemplo: `J7kL9mN2pQ4rT6vX8yZ0AaBbCcDdEeFf`
- Nunca compartilhe essa senha

### Passo 3.6: Criar o servico

1. Clique em **"Create Web Service"**
2. Aguarde o deploy (5-10 minutos na primeira vez)
3. Acompanhe os logs para ver o progresso

---

## PARTE 4: Criar o Usuario Admin

### Primeira vez (automatico via seed)

Se voce configurou `ADMIN_USERNAME` e `ADMIN_PASSWORD` nas variaveis de ambiente, o usuario sera criado automaticamente no primeiro deploy.

### Manualmente (se precisar)

Se precisar recriar o admin, no Render:

1. Va em **"Shell"** no seu Web Service
2. Execute:
```bash
npm run db:seed
```

---

## PARTE 5: Acessar sua Aplicacao

### Passo 5.1: Obter o link

1. Apos o deploy concluir, voce vera um link como:
   ```
   https://cruzador-planilhas.onrender.com
   ```
2. Esse e o link publico da sua aplicacao!

### Passo 5.2: Fazer login

1. Acesse o link
2. Entre com:
   - **Usuario**: O valor que voce colocou em `ADMIN_USERNAME`
   - **Senha**: O valor que voce colocou em `ADMIN_PASSWORD`

---

## PARTE 6: Manutencao

### Atualizar a aplicacao

Sempre que fizer mudancas no codigo:

```bash
git add .
git commit -m "Descricao da mudanca"
git push
```

O Render detectara automaticamente e fara um novo deploy.

### Verificar logs

1. No Dashboard do Render, clique no seu servico
2. Clique em **"Logs"**
3. Veja as mensagens em tempo real

### Acordar a aplicacao

O plano gratuito "dorme" apos 15 minutos sem uso.
- A primeira requisicao apos dormir demora 30-60 segundos
- Depois disso, funciona normalmente
- Isso e normal no plano gratuito

---

## Solucao de Problemas

### Erro: "Build failed"

Verifique:
1. O package.json esta correto?
2. Todas as dependencias estao listadas?
3. Veja os logs de build para detalhes

### Erro: "Cannot connect to database"

Verifique:
1. A DATABASE_URL esta correta?
2. Copiou a URL completa do Neon (incluindo `?sslmode=require`)?
3. O projeto no Neon esta ativo?

### Erro: "Credenciais invalidas" no login

1. Verifique se o seed rodou com sucesso
2. Confirme que ADMIN_USERNAME e ADMIN_PASSWORD estao corretos
3. No Render Shell, execute: `npm run db:seed`

### Aplicacao muito lenta

Normal no plano gratuito:
- Primeira requisicao apos inatividade e lenta
- Apos "acordar", funciona normalmente
- Para performance melhor, considere plano pago ($7/mes)

---

## Limites do Plano Gratuito

### Neon (Banco de Dados)

| Recurso | Limite |
|---------|--------|
| Storage | 512 MB |
| Branches | 10 |
| Compute hours | 191 horas/mes |
| Expiracao | **Nunca expira!** |

### Render (Web Service)

| Recurso | Limite |
|---------|--------|
| Instancias | 750 horas/mes |
| Bandwidth | 100 GB/mes |
| Sleep | Apos 15 min inativo |
| Build | 500 min/mes |

---

## Resumo Final

Voce agora tem:

1. **Banco de dados permanente** no Neon (gratis)
2. **Servidor web** no Render (gratis)
3. **Codigo versionado** no GitHub (gratis)

Custo total: **R$ 0,00 por mes**

---

## Proximos Passos (Opcionais)

### Dominio personalizado

Quer usar seu proprio dominio (ex: cruzador.seusite.com)?
1. Compre um dominio (~R$ 40/ano)
2. No Render, va em Settings > Custom Domains
3. Adicione seu dominio e configure o DNS

### Melhorar performance

Para eliminar o "sleep" do plano gratuito:
- Render Starter: $7/mes
- Ou use um servico de "ping" para manter acordado

---

## Contatos e Suporte

- **Neon Docs**: https://neon.tech/docs
- **Render Docs**: https://render.com/docs
- **Drizzle ORM**: https://orm.drizzle.team

Boa sorte com o deploy!
