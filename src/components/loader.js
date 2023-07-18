export function removeLoader() {
  const loader = document.querySelector('#loader');
  const header = document.querySelector('header');
  const container = document.querySelector('#content');
  loader.classList.add('hidden');
  header.classList.remove('opacity-25');
  header.classList.remove('z-[-1]');
  container.classList.remove('hidden');
}

export function addLoader() {
  const loader = document.querySelector('#loader');
  const header = document.querySelector('header');
  const container = document.querySelector('#content');
  loader.classList.remove('hidden');
  header.classList.add('opacity-25');
  header.classList.add('z-[-1]');
  container.classList.add('hidden');
}
