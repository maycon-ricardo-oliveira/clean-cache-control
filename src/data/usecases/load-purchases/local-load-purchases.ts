import {ICacheStore} from "../../protocols/cache/cache-store";
import {ISavePurchases, SavePurchases} from "../../../domain/usecases/save-purchases";
import {ILoadPurchases, LoadPurchases} from "../../../domain/usecases/load-purchases";


export class LocalLoadPurchases implements ISavePurchases, ILoadPurchases {
    private  readonly key = 'purchases';
    constructor(
        private readonly cacheStore: ICacheStore,
        private readonly timestamp: Date
        ) {
    }

    async save (purchases: Array<SavePurchases.Params>): Promise<void> {
        this.cacheStore.replace(this.key, {
            timestamp: this.timestamp,
            value: purchases,
        })
    }

    async loadAll(): Promise<Array<LoadPurchases.Result>> {
        try {
            this.cacheStore.fetch(this.key)
            return []
        } catch(error) {
            this.cacheStore.delete(this.key)
            return []
        }
    }
}