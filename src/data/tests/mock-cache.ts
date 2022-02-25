import {ICacheStore} from "../protocols/cache/cache-store";
import {SavePurchases} from "../../domain/usecases/save-purchases";

export class CacheStoreSpy implements ICacheStore {
    deleteCallsCount = 0
    insertCallsCount = 0
    deleteKey: string
    insertKey: string
    insertValues: Array<SavePurchases.Params> = []

    delete(key): void {
        this.deleteKey = key
        this.deleteCallsCount++
    }

    insert(key, value: any): void {
        this.insertKey = key
        this.insertCallsCount++
        this.insertValues = value
    }

    simulateDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete')
            .mockImplementationOnce(() => { throw new Error() })
    }

    simulateInsertError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert')
            .mockImplementationOnce(() => { throw new Error() })
    }
}
