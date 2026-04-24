# VENATTO - Deploy com Dokploy

## Pré-requisitos

- VPS com Docker
- Domínio configurado
- Dokploy instalado

## Configuração do Projeto

### 1. Volumes Persistentes

Crie os seguintes volumes no Dokploy:

```
/data/venatto  # Para o banco SQLite
/data/uploads  # Para arquivos de mídia
/data/backup   # Para backups automáticos
```

### 2. Variáveis de Ambiente

Configure no Dokploy:

```bash
DATABASE_URL=file:/data/venatto/prod.db
ADMIN_EMAIL=admin@venatto.com.br
ADMIN_PASSWORD_HASH=SEU_HASH_BCRYPT_AQUI
NODE_ENV=production
```

### 3. Build Settings

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: 3000

### 4. Mount Volumes

No Dokploy, monte os volumes:

- `/data/venatto` → `/data/venatto`
- `/data/uploads` → `/data/uploads`
- `/data/backup` → `/data/backup`

### 5. Backup Automático

Configure um cron job no servidor:

```bash
# Executar diariamente às 2:00
0 2 * * * /path/to/project/scripts/backup.sh
```

## Verificação

Após deploy:

1. Acesse `https://seudominio.com`
2. Acesse `https://seudominio.com/admin/login`
3. Login com credenciais configuradas
4. Teste upload de imagens
5. Verifique se dados persistem após restart

## Troubleshooting

- **Banco não persiste**: Verifique se volume `/data/venatto` está montado
- **Uploads falham**: Verifique se volume `/data/uploads` está montado
- **Erro 401**: Verifique variáveis de ambiente
- **SEO não atualiza**: Aguarde revalidação do cache