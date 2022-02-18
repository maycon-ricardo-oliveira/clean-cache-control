import {ICacheStore} from '../protocols/cache/cache-store';

export class LocalSavePurchases {
    constructor(private readonly cacheStore: ICacheStore) {
    }

    async save (): Promise<void> {
        this.cacheStore.delete('purchases')
        this.cacheStore.insert('purchases')
    }
}