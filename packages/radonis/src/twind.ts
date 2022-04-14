import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'
import { defineConfig, getSheet, twind, tx as tx$ } from 'twind'

export const twindConfig = defineConfig({
  presets: [presetAutoprefix(), presetTailwind(), presetTailwindForms()],
})

export const tw = /* #__PURE__ */ twind(twindConfig, getSheet(false))
export const tx = /* #__PURE__ */ tx$.bind(tw)
