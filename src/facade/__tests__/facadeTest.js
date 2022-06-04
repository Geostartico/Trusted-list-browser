import { Facade } from "../facade";
import { Fetcher } from "../../fetch/Fetcher";
import { strict as assert } from "node:assert";
import { SelectionType } from "../../gui/Enums";
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("facade test", () => {
    let all = undefined;
    let fac = undefined;
    let finished = false;
    let curCount = undefined;
    let sum = 0;
    beforeAll(async () => {
        let tmpfetch = new Fetcher();
        all = await tmpfetch.getJSON("https://esignature.ec.europa.eu/efda/tl-browser/api/v1/search/tsp_list");
        fac = new Facade();
        await fac.setUp(() => finished = true)
        all.forEach((elem) => {
            sum += elem.services.length;
        })       
    }, 1000000);
    it("should finish", () => {
        assert.equal(fac.getView().services.getSize(), sum);
        assert.equal(finished, true);
    })
    it("should select an item", () =>{
        curCount = fac.getView().countries.values()[0];
        fac.updateAdd(curCount);
        assert.equal(fac.getSelected().countries.getSize(), 1);
        assert.equal(fac.getSelected().countries.values()[0].countryCode, curCount.countryCode);
        fac.getView().services.forEach((elem) =>{
            assert.equal(elem.getCountry().countryCode, curCount.countryCode);
        })
    })
    it("should remove an item", () =>{
        fac.updateRemove(curCount);
        assert.equal(fac.getSelected().countries.getSize(), 0);
        assert.equal(fac.getView().services.getSize(), sum);
    })
    it("shouldn't remove an item if it makes the list empty", () => {
        let tmp = fac.getSelectableCountries().values();
        fac.updateAdd(tmp[0]);
        fac.updateAdd(tmp[1]);
        let tmpProv = tmp[0].getProviders().values()[0];
        fac.updateAdd(tmpProv);
        assert.equal(fac.updateRemove(tmp[0]), false);
        assert.equal(fac.getSelected().countries.has(tmp[0]), true);
    })
})