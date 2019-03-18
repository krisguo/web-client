import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { SaleCampaignViewerPseudoModule } from '@/modules-arch/pseudo-modules/sale-campaign-viewer-pseudo-module'

export class SaleDetailsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/SaleDetails'),
      allowedSubmodules: [
        SaleCampaignViewerPseudoModule,
      ],
    })
  }
}
