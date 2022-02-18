import {LocalSavePurchases} from "./local-save-purchases";
import {ICacheStore} from "../protocols/cache/cache-store";

class CacheStoreSpy implements ICacheStore {
    deleteCallsCount = 0
    insertCallsCount = 0
    deleteKey: string
    insertKey: string

    delete(key): void {
        this.deleteKey = key
        this.deleteCallsCount++
    }

    insert(key): void {
        this.insertKey = key
        this.insertCallsCount++
    }
}

type SutTypes = {
    sut: LocalSavePurchases,
    cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore)

    return {
        sut,
        cacheStore
    }
}

describe('LocalSavePurchases', () => {
    test('Should not delete cache on sut.init',() => {
        const { cacheStore } = makeSut()
        new LocalSavePurchases(cacheStore)
        expect(cacheStore.deleteCallsCount).toBe(0)
    })

    test('Should delete old cache on sut.save',async () => {
        const { cacheStore, sut } = makeSut()
        await sut.save()
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should not insert new Cache if delete fails',() => {
        const { cacheStore, sut } = makeSut()
        jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => {
            throw new Error()
        })
        const promise = sut.save()
        expect(cacheStore.insertCallsCount).toBe(0)
        expect(promise).rejects.toThrow()
    })

    test('Should insert new Cache if delete succeeds',async () => {
        const { cacheStore, sut } = makeSut()
        await sut.save()
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.insertCallsCount).toBe(1)
        expect(cacheStore.insertKey).toBe('purchases')

    })
})

