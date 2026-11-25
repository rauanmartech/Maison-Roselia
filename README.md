# Maison-Roselia

Landing page em português para uma marca fictícia de casamentos em um castelo. O projeto usa HTML, CSS e JavaScript com Vite. As fontes e imagens WebP são servidas pelo próprio site.

## Desenvolvimento

Use Node.js 22.12 ou superior e execute os comandos na pasta de `package.json`.

```sh
npm ci
npm run dev
```

## Build e publicação na Vercel

```sh
npm run build
npm run preview
```

Adicione os arquivos do projeto a um repositório GitHub e importe o repositório na Vercel. Use o preset Vite, o comando de build `npm run build` e o diretório de saída `dist`.

## Pedidos de visita

Sem endereço comercial configurado, o formulário gera um pedido em texto para o visitante baixar. Para encaminhar pedidos por e-mail, defina `VITE_CONTACT_EMAIL` no ambiente da Vercel antes do build. Para testar localmente, copie `.env.example` para `.env.local`, preencha o endereço e reinicie o servidor. Use um e-mail de contato público. O visitante confirma o envio no aplicativo de e-mail e a equipe combina a data.

## Arquivos principais

- `index.html` contém o texto e as seções da página.
- `src/style.css` contém a tipografia, a paleta e o layout responsivo.
- `src/main.js` controla a navegação, o carrossel e o pedido de visita.
- `public/images/` reúne as fotografias, a coroa e os ornamentos em WebP gerados com ImageGen.
