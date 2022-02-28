import {ICacheStore} from "../protocols/cache/cache-store";
import {SavePurchases} from "../../domain/usecases/save-purchases";

export class CacheStoreSpy implements ICacheStore {
    insertValues: Array<SavePurchases.Params> = []
    actions: Array<CacheStoreSpy.Action> = []
    deleteKey: string
    insertKey: string
    fetchKey: string

    fetch(key: string): void {
        this.actions.push(CacheStoreSpy.Action.fetch)
        this.fetchKey = key
    }

    delete(key: string): void {
        this.actions.push(CacheStoreSpy.Action.delete)
        this.deleteKey = key
    }

    insert(key: string, value: any): void {
        this.actions.push(CacheStoreSpy.Action.insert)
        this.insertValues = value
        this.insertKey = key
    }

    replace(key: string, value: any): void {
        this.delete(key)
        this.insert(key, value)
    }

    simulateDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
            this.actions.push(CacheStoreSpy.Action.delete)
            throw new Error()
        })
    }

    simulateInsertError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
            this.actions.push(CacheStoreSpy.Action.insert)
            throw new Error()
        })
    }
}

export namespace CacheStoreSpy {
    export enum Action {
        delete,
        insert,
        fetch
    }
}