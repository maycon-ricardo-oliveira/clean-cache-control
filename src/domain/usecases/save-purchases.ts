import {PurchaseModel} from "../models/purshase-model";

export interface ISavePurchases {
    save:(purchases: Array<SavePurchases.Params>) => Promise<void>
}

export namespace SavePurchases {
    export type Params = PurchaseModel
}