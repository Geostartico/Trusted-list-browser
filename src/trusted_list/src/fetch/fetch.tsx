export class Fetcher{
	times: number;

    constructor() {
        this.times = 0;
    }

	async getJSON (url: string) {

        return await fetch(url)
		.then(res => {

			if(!res.ok){
                console.log("merda");

				//this.getJSON(url);
			}
            
            return res.json();

        }).catch(error => {
            console.log("something went wrong");
        });
	}
}
