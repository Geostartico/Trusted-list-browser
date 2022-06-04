import { strict as assert } from 'node:assert';
import {Country, Service, Type, Provider, Status} from "../items"
import {Test} from "../testClass";
import {UnorderedMap} from "../UnorderedMap";


describe('Unordered Map Test', function () {
    let et = undefined;
    let t1 = undefined;
    beforeAll(() => {
        expect(() => {et = new UnorderedMap(8)}).not.toThrow();
        t1 = new Test(1, 2);
        let t2 = new Test(1, 2);
        et.set(t1, 2);
        et.set(t2, 4);
        for(let i = 0; i < 11; i ++){
            et.set(new Test(3, i), i);
        }
    })
    it("shouldn't let to construct a map of dimension 0", () => {
        expect(() => new UnorderedMap(0)).toThrow()
        expect(() => new UnorderedMap(-1)).toThrow()
    })
    it("should have unique elements", function () {
        assert.equal(et.getSize(), 12);
    })
    it("should contain all elements", function () {
        for(let i = 0; i < 11; i ++){
            assert.equal(et.has(new Test(3, i)), true);
        }
    })
    it("shouldn't contain elements not given", function () {
        for(let i = 0; i < 11; i ++){
            assert.equal(et.has(new Test(4, i)), false);
        }
    })
    //console.log(et.entries());
    it("should have the right value for every element", function () {
        assert.equal(et.get(t1), 4);
        et.forEach((num, key) =>{
            assert.equal(et.get(key), num);
        });
    })
    it("should remove an item", function () {
        assert.equal(et.remove(t1), true);
        assert.equal(et.getSize(), 11);
        assert.equal(et.has(t1), false);

    })
    it("should return all the elements in values", function () {
        et.entries().forEach((elem) => {
            assert.equal(et.has(elem.getKey()), true);
        })
    })
    it("should iterate over every item", function () {
        let set2 = new UnorderedMap(8);
        et.forEach((num, key) =>{
            assert.equal(et.has(key), true);
            set2.set(key, 2);
        });
        assert(set2.getSize(), 12);
    })
    it("should copy the map", function () {
        let copy = et.copy();
        assert.equal(copy.getSize(), et.getSize())
        copy.forEach((val, key) => assert.equal(et.has(key), true))
    })
    it("should return the right intersection", () => {
        let set1 = new UnorderedMap(8);
        let set2 = new UnorderedMap(8);
        for(let i = 0; i < 9; i ++){
            set1.set(new Test(1, i), 0);
        }
        for(let i = 0; i < 2; i ++){
            set2.set(new Test(1, i), 0);
        }
        let int = UnorderedMap.mapIntersect([set1, set2]);
        for(let i = 0; i < 2; i ++){
            assert.equal(int.has(new Test(1, i)), true)
        }
    })    
});
