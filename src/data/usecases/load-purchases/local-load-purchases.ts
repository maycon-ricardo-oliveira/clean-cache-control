import {ICacheStore} from "../../protocols/cache/cache-store";
import {ISavePurchases, SavePurchases} from "../../../domain/usecases/save-purchases";


export class LocalLoadPurchases implements ISavePurchases {
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

    async loadAll(): Promise<void> {
        this.cacheStore.fetch(this.key)
    }
}