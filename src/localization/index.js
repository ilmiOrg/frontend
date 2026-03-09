const loaders = {
  en: () => import('./en'),
  ru: () => import('./ru'),
  tg: () => import('./tg'),
  ky: () => import('./ky'),
  kk: () => import('./kk')
}

export default loaders