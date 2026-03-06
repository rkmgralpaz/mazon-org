# mazon-org

Theme principal del sitio WordPress MAZON.

## Desarrollo Local

- **Proyecto Local**: `/Users/rebecakarenmossetto/Local Sites/mazon-org/app/public/wp-content/themes/mazon-acc/`
- **URL local**: http://mazon-org.local
- **Theme name**: mazon-acc

## Workflow

1. **Cambios en GitHub**: Se hacen vía Claude o manualmente en este repo
2. **Pull local**: `git pull origin main` desde `~/github-repos/mazon-org`
3. **Deploy a producción**: FTP manual al servidor de producción

## Scripts disponibles

```bash
# Instalar dependencias
npm install
```

## Notas

- `node_modules/` está excluido del repo (ver `.gitignore`)
- Después de hacer `git pull`, si hay cambios en `package.json`, correr `npm install`
