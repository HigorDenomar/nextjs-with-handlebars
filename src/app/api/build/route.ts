import { promises as fs } from 'fs'
import { handlebars } from 'hbs'
import { resolve } from 'path'
import postcss from 'postcss'
import tailwind from 'tailwindcss'
import { z } from 'zod'

import casarTheme from '@casar/ui-kit/tailwind-config'

export const dynamic = 'force-dynamic'

const templateSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
  content: z.object({
    list: z.array(z.string()).optional(),
    message: z.string(),
  }),
  theme: z.string(),
})

export async function POST(request: Request) {
  try {
    const content = templateSchema.parse(await request.json())

    const template = handlebars.compile(
      await fs.readFile(
        resolve(process.cwd(), 'src/app/api/build/_templates/index.hbs'),
        'utf8'
      )
    )

    const html = template(content)

    const css = await generateCSSfromHTML(html)

    await handleToCreateFiles(html, css)

    // await fetch('http://localhost:3333', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     html,
    //     css,
    //   }),
    // })

    return Response.json({ css, html })
  } catch (error) {
    return Response.json({ html: '', error })
  }
}

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

async function handleToCreateFiles(html: string, css: string) {
  const outDir = resolve(process.cwd(), 'src/app/api/build/_output')

  await fs.mkdir(outDir, {
    recursive: true,
  })

  await fs.writeFile(resolve(outDir, 'index.html'), html, {
    encoding: 'utf8',
  })

  await fs.writeFile(resolve(outDir, 'styles.css'), css, {
    encoding: 'utf8',
  })
}
