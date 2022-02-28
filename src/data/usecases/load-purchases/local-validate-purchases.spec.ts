import {LocalLoadPurchases} from "./local-load-purchases";
import {CacheStoreSpy, getCacheExpirationDate} from "../../tests/mock-cache";
import {mockPurchases} from "../../tests/mock-purchases";

type SutTypes = {
    sut: LocalLoadPurchases,
    cacheStore: CacheStoreSpy
}

const makeSut = (timestamp = new Date()): SutTypes => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalLoadPurchases(cacheStore, timestamp)

    return {
        sut,
        cacheStore
    }
}

describe('LocalLoadPurchases', () => {
    test('Should not delete or insert cache on sut.init',() => {
        const { cacheStore } = makeSut()
        expect(cacheStore.actions).toEqual([])
    })

    test('Should delete if load fails',() => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateFetchError()
        sut.validate()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should has no side effect if load succeeds',async () => {
        const currentDate = new Date()
        const timestamp = getCacheExpirationDate(currentDate)
        timestamp.setSeconds(timestamp.getSeconds() + 1)

        const { cacheStore, sut } = makeSut(currentDate)
        cacheStore.fetchResult = { timestamp }
        sut.validate()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
        expect(cacheStore.fetchKey).toBe('purchases')
    })

    test('Should delete cache if its expired',async () => {
        const currentDate = new Date()
        const timestamp = getCacheExpirationDate(currentDate)
        timestamp.setSeconds(timestamp.getSeconds() - 1)

        const { cacheStore, sut } = makeSut(currentDate)
        cacheStore.fetchResult = { timestamp }
        sut.validate()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
        expect(cacheStore.fetchKey).toBe('purchases')
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should delete cache if its on expiration date',async () => {
        const currentDate = new Date()
        const timestamp = getCacheExpirationDate(currentDate)

        const { cacheStore, sut } = makeSut(currentDate)
        cacheStore.fetchResult = { timestamp }

        sut.validate()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
        expect(cacheStore.fetchKey).toBe('purchases')
        expect(cacheStore.deleteKey).toBe('purchases')
    })
})
