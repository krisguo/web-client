import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { SaleStateWidgetChartPseudoModule } from '@/modules-arch/pseudo-modules/sale-state-widget-chart-pseudo-module'

export class SaleStateWidgetPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/pages/sale-details/SaleStateWidget.vue'),
      allowedSubmodules: [
        SaleStateWidgetChartPseudoModule,
      ],
      ...opts,
    })
  }
}
