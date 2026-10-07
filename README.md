# Gabriel & Vanessa · Pré-save 13.03.2027

Site de confirmação de presença (RSVP) do casamento de Gabriel & Vanessa, com a mesma identidade visual do convite pré-save: aquarela da igreja, papel creme, tons oliva e a dupla tipográfica *Great Vibes* + *Cormorant Garamond*.

**O que tem no site**

- Data, local e horários (cerimônia às 17h, recepção às 19h na Chácara Dornellas)
- Contagem regressiva
- Botões para salvar a data no Google Agenda ou no Apple/Outlook (.ics)
- Formulário de RSVP: nome, WhatsApp, presença, número de pessoas, acompanhantes e mensagem

É um site estático (HTML, CSS e JS), sem build. Para ver localmente, basta abrir o `index.html` no navegador.

## Publicar no GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**, depois a branch `main` e a pasta `/ (root)`.
3. O site fica disponível em `https://<seu-usuario>.github.io/casamento-gabriel-vanessa/`.

## Salvando as respostas (Google Planilhas)

Sem essa configuração, o formulário roda em **modo demonstração**: mostra a mensagem de agradecimento, mas não salva nada.

1. Crie uma planilha no Google Planilhas (ex.: "RSVP Casamento").
2. Abra **Extensões → Apps Script**, apague o conteúdo e cole o arquivo [`apps-script/Code.gs`](apps-script/Code.gs).
3. Clique em **Implantar → Nova implantação**, escolha o tipo **App da Web** e configure:
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa
4. Autorize o acesso e copie a URL gerada (termina em `/exec`).
5. Cole essa URL em `ENDPOINT`, no arquivo [`config.js`](config.js), e faça commit.

As respostas caem na aba **Confirmações** da planilha. Lá dá para filtrar por presença e somar a coluna *Pessoas* para chegar ao total de convidados.

## Personalizar

- `config.js`: endpoint, número máximo de pessoas por resposta e prazo para confirmar.
- `style.css`: as cores ficam nas variáveis do `:root`.
- `assets/`: as imagens recortadas do convite original (`convite-original.jpg`).
