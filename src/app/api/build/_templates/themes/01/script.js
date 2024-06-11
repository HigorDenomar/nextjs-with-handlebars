// Esse script pode ser servido via GTM (Google Tag Manager)

console.log('Teste')

async function main() {
  const response = await fetch(
    'https://api.github.com/users/HigorDenomar/repos'
  )
  const data = await response.json()

  console.log(data)

  const profile = document.getElementById('profile')

  profile.textContent = JSON.stringify(data, null, 2)
}

main()
