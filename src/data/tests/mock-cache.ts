import {ICacheStore} from "../protocols/cache/cache-store";
import {SavePurchases} from "../../domain/usecases/save-purchases";

export class CacheStoreSpy implements ICacheStore {
    messages: Array<CacheStoreSpy.Message> = []
    deleteKey: string
    insertKey: string
    insertValues: Array<SavePurchases.Params> = []

    delete(key): void {
        this.messages.push(CacheStoreSpy.Message.delete)
        this.deleteKey = key
    }

    insert(key, value: any): void {
        this.messages.push(CacheStoreSpy.Message.insert)
        this.insertValues = value
        this.insertKey = key
    }

    simulateDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
            this.messages.push(CacheStoreSpy.Message.delete)
            throw new Error()
        })
    }

    simulateInsertError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
            this.messages.push(CacheStoreSpy.Message.insert)
            throw new Error()
        })
    }
}

export namespace CacheStoreSpy {
    export enum Message {
        delete,
        insert
    }
}