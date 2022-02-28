import {PurchaseModel} from "../models/purshase-model";

export interface ILoadPurchases {
    loadAll:() => Promise<Array<LoadPurchases.Result>>
}

export namespace LoadPurchases {
    export type Result = PurchaseModel
}