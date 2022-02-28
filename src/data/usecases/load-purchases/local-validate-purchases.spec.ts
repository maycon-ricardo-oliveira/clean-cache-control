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
})
