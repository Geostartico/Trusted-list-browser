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
        fac = new Facade(() => {
            console.log("ciao");
        });
        all.forEach((elem) => {
            sum += elem.services.length;
        }) 
        //await sleep(30000); 
        
    }, 1000000);
    it("should finish", () => {
        //console.log(fac.getView());
        assert.equal(fac.getView().services.getSize(), sum);
        assert.equal(finished, true);
    })
    it("should select an item", () =>{
        curCount = fac.getView().countries.values()[0];
        fac.updateAdd(curCount);
        assert.equal(fac.getSelected().countries.getSize(), 1);
        assert.equal(fac.getSelected().countries.values()[0].countryCode, curCount.countryCode);
    })
    it("should remove an item", () =>{
        fac.updateRemove(curCount);
        assert.equal(fac.getSelected().countries.getSize(), 0);
        assert.equal(fac.getView().services.getSize(), 0);
    })
})