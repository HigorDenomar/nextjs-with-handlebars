'use client'

import { Button } from '@casar/ui-kit/button'
import { Input } from '@casar/ui-kit/input'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  message: z.string(),
  theme: z.string(),
  list: z.string()
})

type FormType = z.infer<typeof formSchema>

export default function HomePage() {
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
  } = useForm<FormType>({
    mode: 'all',
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: FormType) {
    await fetch('http://localhost:3000/api/build', {
      method: 'POST',
      body: JSON.stringify({
        seo: {
          title: values.title,
          description: values.description
        },
        content: {
          message: values.message,
          list: values.list.split(',')
        },
        theme: values.theme
      })
    })

    alert(`Tema ${values.theme} salvo com sucesso!`)
  }


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 mt-5 border p-4 rounded-lg w-full'>
        <Input
          label='Título:'
          status={errors.title && 'error'}
          errorMessage={errors.title?.message}
          {...register('title')}
        />

        <Input
          label='Descrição:'
          status={errors.description && 'error'}
          errorMessage={errors.description?.message}
          {...register('description')}
        />

        <Input
          label='Mensagem:'
          status={errors.message && 'error'}
          errorMessage={errors.message?.message}
          {...register('message')}
        />

        <Input
          label='Tema (numero):'
          status={errors.theme && 'error'}
          errorMessage={errors.theme?.message}
          mask='99'
          {...register('theme')}
        />

        <Input
          label='Lista (separe por vírgula)'
          status={errors.list && 'error'}
          errorMessage={errors.list?.message}
          {...register('list')}
        />

        <Button type='submit' disabled={!isValid || isSubmitting}>Enviar</Button>
      </form>
    </>
  )
}
