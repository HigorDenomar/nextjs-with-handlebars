'use client'

import { Button } from '@casar/ui-kit/button'
import { Input } from '@casar/ui-kit/input'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const formSchema = z.object({
  name: z.string().min(3, 'Mínimo de 3 caracteres'),
  email: z.string().email('Email inválido')
})

type FormType = z.infer<typeof formSchema>

export const FormComponent = () => {
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
  } = useForm<FormType>({
    mode: 'all',
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: FormType) {
    alert(Object.values(values).join(' - '))
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 mt-5 border p-4 rounded-lg w-full'>
        <Input
          label='Nome:'
          status={errors.name && 'error'}
          errorMessage={errors.name?.message}
          {...register('name')}
        />

        <Input
          label='E-mail:'
          status={errors.email && 'error'}
          errorMessage={errors.email?.message}
          {...register('email')}
        />

        <Button type='submit' disabled={!isValid || isSubmitting}>Enviar</Button>
      </form>
    </>
  )
}
