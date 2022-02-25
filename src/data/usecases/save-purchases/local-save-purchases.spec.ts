import {ICacheStore} from "../../protocols/cache/cache-store";
import {mockPurchases} from "../../tests/mock-purchases";
import {LocalSavePurchases} from "./local-save-purchases";
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

    simulateDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete')
            .mockImplementationOnce(() => { throw new Error() })
    }

    simulateInsertError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert')
            .mockImplementationOnce(() => { throw new Error() })
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
        await sut.save(mockPurchases())
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should not insert new Cache if delete fails',() => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateDeleteError()
        const promise = sut.save(mockPurchases())
        expect(cacheStore.insertCallsCount).toBe(0)
        expect(promise).rejects.toThrow()
    })

    test('Should not throw if insert throws',() => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateInsertError()
        const promise = sut.save(mockPurchases())
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
