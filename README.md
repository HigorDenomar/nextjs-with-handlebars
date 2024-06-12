Este projeto visa testar a viabilidade de gerar sites estáticos com Handlebars e Next.js.

## Executando o projeto

Para iniciar o servidor de desenvolvimento, execute um dos seguintes comandos:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

O site estará disponível em [http://localhost:3000](http://localhost:3000).

## Sobre o projeto

Na tela inicial, há um formulário que servirá de base para a geração de um site estático. Após preencher e enviar os dados, uma requisição é feita para [http://localhost:3000/api/build](http://localhost:3000/api/build).

Essa [rota](./src/app/api/build/route.ts) é responsável por processar os dados enviados pelo formulário e gerar um HTML, utilizando como base o [templete Handlebars](./src/app/api/build/_templates/themes/01/index.hbs).

```ts
const content = templateSchema.parse(await request.json())

const templateDir = resolve(
  process.cwd(),
  'src/app/api/build/_templates/themes',
  content.theme,
  'index.hbs'
)

const template = handlebars.compile(await fs.readFile(templateDir, 'utf8'))

const html = template(content)
```

Em seguida, utilizamos o PostCSS pra gerar o CSS necessário para o nosso HTML.

```ts
async function generateCSSfromHTML(html: string) {
  const twBase = '@tailwind base; @tailwind components; @tailwind utilities;'

  const { css } = await new Promise<postcss.Result<postcss.Root>>(
    (resolve, reject) => {
      postcss([
        tailwind({
          ...casarTheme,
          content: [{ raw: html, extension: 'html' }],
        }),
      ])
        .process(twBase, { from: undefined })
        .then((result) => {
          resolve(result)
        })
        .catch((error) => {
          reject(error)
        })
    }
  )

  return css
}
```

O resultado final é salvo em uma pasta `sites` na raiz do projeto, usando o valor de `theme` como nome da subpastas. Por exemplo, se o valor enviado para `theme` for '01', o output será:

- `/sites/01/index.html`
- `/sites/01/styles.css`
- `/sites/01/script.js`
