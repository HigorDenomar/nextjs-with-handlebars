import { promises as fs } from 'fs'
import { handlebars } from 'hbs'
import { JSDOM } from 'jsdom'
import { resolve } from 'path'
import postcss from 'postcss'
import tailwind from 'tailwindcss'
import { z } from 'zod'

import casarTheme from '@casar/ui-kit/tailwind-config'

// export const dynamic = 'force-dynamic'

const templateSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
  theme: z.string(),
  content: z.object({
    list: z.array(z.string()).optional(),
    message: z.string(),
  }),
})

export async function POST(request: Request) {
  const content = templateSchema.parse(await request.json())

  const template = handlebars.compile(
    await fs.readFile(
      resolve(process.cwd(), 'src/app/api/build/_templates/index.hbs'),
      'utf8'
    )
  )

  const html = template(content)

  try {
    const dom = new JSDOM(html)
    const document = dom.window.document
    const classes = new Set<string>()

    document.querySelectorAll('*').forEach((element) => {
      element.className
        .split(' ')
        .forEach((className) => classes.add(className))
    })

    const cssToProcess = `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
  
      ${Array.from(classes)
        .map((className) => `.${className} {}`)
        .join('\n')}
    `

    const { css } = await new Promise<postcss.Result<postcss.Root>>(
      (resolve, reject) => {
        postcss([tailwind(casarTheme)])
          .process(cssToProcess, { from: undefined })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      }
    )

    await generateFiles(html, css)

    return Response.json({ css, html })
  } catch (error) {
    return Response.json({ html: '', error })
  }
}

async function generateFiles(html: string, css: string) {
  await fs.mkdir(resolve(process.cwd(), 'src/app/api/build/_templates/out'), {
    recursive: true,
  })

  await fs.writeFile(
    resolve(process.cwd(), 'src/app/api/build/_templates/out/index.html'),
    html,
    {
      encoding: 'utf8',
    }
  )

  await fs.writeFile(
    resolve(process.cwd(), 'src/app/api/build/_templates/out/styles.css'),
    css,
    {
      encoding: 'utf8',
    }
  )
}
