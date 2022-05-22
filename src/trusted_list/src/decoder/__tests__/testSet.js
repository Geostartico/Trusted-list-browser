import { strict as assert } from 'node:assert';
import {Country, Service, Type, Provider, Status} from "../items"
import {Test} from "./testClass";
import {UnorderedSet} from "../UnorderedSet";


describe('Unordered Set Test', function () {
    let et = new UnorderedSet(8);
    let t1 = new Test(1, 2);
    let t2 = new Test(1, 2);
    et.add(t1);
    et.add(t2);
    for(let i = 0; i < 11; i ++){
        et.add(new Test(3, i));
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
    it("should remove an item", function () {
        assert.equal(et.remove(t1), true);
        assert.equal(et.getSize(), 11);
        assert.equal(et.has(t1), false);

    })
    it("should return all the elements in values", function () {
        et.values().forEach((elem) => {
            assert.equal(et.has(elem), true);
        })
    })
    it("should iterate over every item", function () {
        let set2 = new UnorderedSet(8);
        et.forEach((elem) =>{
            assert.equal(et.has(elem), true);
            set2.add(elem);
        });
        assert(set2.getSize(), 12);
    })
});
