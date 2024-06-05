'use client'

import { generateHTML } from '@/utils/generate-html';
import { Button } from '@casar/ui-kit/button';
import { Typography } from '@casar/ui-kit/typography';
import { useState } from 'react';
import { FormComponent } from './_components/form';

export default function Home() {
  const [html, setHtml] = useState('')

  function handleGenerate() {
    const content = generateHTML(<FormComponent />)

    setHtml(content)
  }

  return (
    <main className="flex flex-col items-center justify-center p-24 text-neutral">
      <Typography type='title'>Spike</Typography>

      <Button onClick={handleGenerate}>Gerar HTML</Button>

      <div dangerouslySetInnerHTML={{ __html: html }} className='w-full max-w-2xl' />
    </main>
  );
}
