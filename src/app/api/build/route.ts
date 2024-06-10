import { promises as fs } from 'fs'
import { handlebars } from 'hbs'
import { resolve } from 'path'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

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

  return Response.json({ html })
}
