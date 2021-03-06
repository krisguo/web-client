import {
  FundedEffect,
  LockedEffect,
  IssuedEffect,
  ChargedEffect,
  UnlockedEffect,
  WithdrawnEffect,
  ChargedFromLockedEffect,
  ParticularBalanceChangeEffect,
} from '../wrappers/effect'

import { CreateAMLAlertRequestOp } from '../wrappers/operation-details/create-aml-alert-request'
import { ManageAssetPairOp } from '../wrappers/operation-details/manage-asset-pair'
import { CheckSaleStateOp } from '../wrappers/operation-details/check-sale-state'
import { CreateIssuanceRequestOp } from '../wrappers/operation-details/create-issuance-request'
import { CreateWithdrawRequestOp } from '../wrappers/operation-details/create-withdrawal-request'
import { ManageOfferOp } from '../wrappers/operation-details/manage-offer'
import { PaymentOp } from '../wrappers/operation-details/payment'
import { ReviewRequestOp } from '../wrappers/operation-details/review-request'

export default {
  filters: {
    effectTypeTranslationId (effect) {
      switch (effect.constructor) {
        case FundedEffect:
          return 'movements-history.effects.funded'
        case LockedEffect:
          return 'movements-history.effects.locked'
        case IssuedEffect:
          return 'movements-history.effects.issued'
        case ChargedEffect:
          return 'movements-history.effects.charged'
        case UnlockedEffect:
          return 'movements-history.effects.unlocked'
        case WithdrawnEffect:
          return 'movements-history.effects.withdrawn'
        case ChargedFromLockedEffect:
          return 'movements-history.effects.charged-from-locked'
        case ParticularBalanceChangeEffect:
          return 'movements-history.effects.matched'
        default:
          return 'movements-history.effects.unknown'
      }
    },
    operationTypeTranslationId (operationDetails) {
      switch (operationDetails.constructor) {
        case CreateAMLAlertRequestOp:
          return 'movements-history.operations.create-aml-alert-request'
        case CheckSaleStateOp:
          return 'movements-history.operations.check-sale-state'
        case CreateIssuanceRequestOp:
          return 'movements-history.operations.create-issuance-request'
        case CreateWithdrawRequestOp:
          return 'movements-history.operations.create-withdraw-request'
        case ManageOfferOp:
          return 'movements-history.operations.manage-offer'
        case PaymentOp:
          return 'movements-history.operations.payment'
        case ReviewRequestOp:
          return 'movements-history.operations.review-request'
        case ManageAssetPairOp:
          return 'movements-history.operations.manage-asset-pair'
        default:
          return 'movements-history.operations.unknown'
      }
    },
  },
}
