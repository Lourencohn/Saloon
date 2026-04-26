# Como subir esse repo no GitHub

Você já criou o repo em `https://github.com/Lourencohn/Saloon.git`. Siga os passos:

## 1. Baixe esse pacote handoff
Faça download do arquivo zip que aparece no chat (botão de download abaixo) e extraia onde quiser.

## 2. Inicialize e suba

```bash
cd Saloon-handoff       # pasta extraída
git init
git branch -M main
git add .
git commit -m "feat: initial Saloon Expo + Supabase scaffolding"
git remote add origin https://github.com/Lourencohn/Saloon.git
git push -u origin main
```

> Se o GitHub recusar por já ter README online, use `git pull origin main --allow-unrelated-histories` antes do push, ou force com `git push -u origin main --force` (se não houver nada importante remoto).

## 3. Configure local

```bash
git clone https://github.com/Lourencohn/Saloon.git
cd Saloon
npm install
cp .env.example .env       # preencha com suas chaves Supabase
npx expo start
```

## 4. Configure Supabase

1. Crie projeto em https://supabase.com
2. Em Authentication → Providers, mantenha Email habilitado
3. Cole o conteúdo de `supabase/schema.sql` no SQL Editor e rode
4. Copie Project URL + anon public key para `.env`
5. Inicie o app, crie uma conta e teste o fluxo Home → Salão → Agendamento → Agenda
6. Opcionalmente, regenere os tipos após alterar o schema:
   ```bash
   npx supabase gen types typescript --project-id <id> > types/database.ts
   ```

## 5. Workflow com Claude Code

Na raiz do projeto, rode:

```bash
claude
```

Ele lê automaticamente o `CLAUDE.md`. Comece pedindo:

> "Implemente a tela Home (`app/(tabs)/index.tsx`) seguindo `prototype/saloon-screens-1.jsx → ScreenHome`. Use os tokens de `constants/tokens.ts` e NativeWind."

Depois siga a tabela de telas no `CLAUDE.md`.

## 6. (Opcional) Inclua o protótipo como referência viva

Copie a pasta inteira do protótipo HTML para `prototype/` antes do primeiro commit:

```bash
mkdir prototype
# copie Saloon.html, saloon-*.jsx, tweaks-panel.jsx, android-frame.jsx
```

Assim o Claude Code consegue olhar o JSX original como spec visual.
