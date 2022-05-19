import { strict as assert } from 'node:assert';
import {Country, Service, Type, Provider, Status} from "../items.js"
import {Test} from "./testClass.js";
import {UnorderedMap} from "../UnorderedMap.js";


describe('Unordered Map Test', function () {
    let et = new UnorderedMap(8);
    let t1 = new Test(1, 2);
    let t2 = new Test(1, 2);
    et.set(t1, 2);
    et.set(t2, 4);
    for(let i = 0; i < 11; i ++){
        et.set(new Test(3, i), i);
    }
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
    console.log(et.entries());
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
    
});
