import {ICacheStore} from "../../protocols/cache/cache-store";
import {ISavePurchases, SavePurchases} from "../../../domain/usecases/save-purchases";
import {ILoadPurchases, LoadPurchases} from "../../../domain/usecases/load-purchases";
import {CachePolicy} from "../../protocols/cache/cache-policy";


export class LocalLoadPurchases implements ISavePurchases, ILoadPurchases {
    private  readonly key = 'purchases';
    constructor(
        private readonly cacheStore: ICacheStore,
        private readonly currentDate: Date
        ) {
    }

    async save (purchases: Array<SavePurchases.Params>): Promise<void> {
        this.cacheStore.replace(this.key, {
            timestamp: this.currentDate,
            value: purchases,
        })
    }

    async loadAll(): Promise<Array<LoadPurchases.Result>> {
        try {
            const cache = this.cacheStore.fetch(this.key)

            if (!CachePolicy.validate(cache.timestamp, this.currentDate)) {
                throw new Error()
            }

            return cache.value

        } catch(error) {
            this.cacheStore.delete(this.key)
            return []
        }
    }
}