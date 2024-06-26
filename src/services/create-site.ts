export const createSiteService = async (theme: string) => {
  const response = await fetch('http://localhost:3000/api/build', {
    method: 'POST',
    body: JSON.stringify({
      seo: {
        title: 'Título bem bacaninha',
        description: 'Descrição bem legal',
      },
      content: {
        message: 'Mensagem bem supimpa!',
        list: ['item 01', 'item 02', 'item 03', 'item 04'],
      },
      theme,
    }),
  })

  const data = await response.json()

  return { data, status: response.status }
}
