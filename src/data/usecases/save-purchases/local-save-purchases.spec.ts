import {mockPurchases} from "../../tests/mock-purchases";
import {LocalSavePurchases} from "./local-save-purchases";
import {CacheStoreSpy} from "../../tests/mock-cache";

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
    test('Should not delete or insert cache on sut.init',() => {
        const { cacheStore } = makeSut()
        new LocalSavePurchases(cacheStore)
        expect(cacheStore.messages).toEqual([])
    })

    test('Should delete old cache on sut.save',async () => {
        const { cacheStore, sut } = makeSut()
        await sut.save(mockPurchases())
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should not insert new Cache if delete fails',() => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateDeleteError()
        const promise = sut.save(mockPurchases())
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])
        expect(promise).rejects.toThrow()
    })

    test('Should insert new Cache if delete succeeds',async () => {
        const { cacheStore, sut } = makeSut()
        const purchases = mockPurchases()
        await sut.save(purchases)
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual(purchases)
    })

    test('Should not throw if insert throws',() => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateInsertError()
        const promise = sut.save(mockPurchases())
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
        expect(promise).rejects.toThrow()
    })
})
