import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class SaleStateWidgetChartPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/common/chart/Chart'),
      ...opts,
    })
  }
}
