import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { SaleStateWidgetPseudoModule } from '@/modules-arch/pseudo-modules/sale-state-widget-pseudo-module'

export class SaleCampaignViewerPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/pages/sale-details/SaleCampaignViewer'),
      allowedSubmodules: [
        SaleStateWidgetPseudoModule,
      ],
      ...opts,
    })
  }
}
