import {LocalSavePurchases} from "./local-save-purchases";
import {ICacheStore} from "../protocols/cache/cache-store";
import {SavePurchases} from "../../../domain/usecases/save-purchases";

class CacheStoreSpy implements ICacheStore {
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

const mockPurchases = (): Array<SavePurchases.Params> => [{
    id: '1',
    date: new Date(),
    value: 10
}, {
    id: '2',
    date: new Date(),
    value: 20
}, {
    id: '20',
    date: new Date(),
    value: 1,
}]

describe('LocalSavePurchases', () => {
    test('Should not delete cache on sut.init',() => {
        const { cacheStore } = makeSut()
        new LocalSavePurchases(cacheStore)
        expect(cacheStore.deleteCallsCount).toBe(0)
    })

    test('Should delete old cache on sut.save',async () => {
        const { cacheStore, sut } = makeSut()
        await sut.save(mockPurchases())
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should not insert new Cache if delete fails',() => {
        const { cacheStore, sut } = makeSut()
        jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => {
            throw new Error()
        })
        const promise = sut.save(mockPurchases())
        expect(cacheStore.insertCallsCount).toBe(0)
        expect(promise).rejects.toThrow()
    })

    test('Should insert new Cache if delete succeeds',async () => {
        const { cacheStore, sut } = makeSut()
        const purchases = mockPurchases()
        await sut.save(purchases)
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.insertCallsCount).toBe(1)
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual(purchases)
    })
})

