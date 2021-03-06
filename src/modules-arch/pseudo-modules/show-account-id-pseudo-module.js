import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class ShowAccountIdPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/common/KeyViewer'),
      ...opts,
    })
  }
}
