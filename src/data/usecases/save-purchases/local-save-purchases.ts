import {ICacheStore} from '../protocols/cache/cache-store';
import {ISavePurchases, SavePurchases} from "../../../domain/usecases/save-purchases";

export class LocalSavePurchases implements ISavePurchases {
    constructor(private readonly cacheStore: ICacheStore) {
    }

    async save (purchases: Array<SavePurchases.Params>): Promise<void> {
        this.cacheStore.delete('purchases')
        this.cacheStore.insert('purchases', purchases)
    }
}