export class Fetcher{
	
	private counter;

	public constructor(){
	
		this.counter = 0;

	}

	async getJSON (url: string) {

	return await fetch(url)
	.then(res => {

			if(!res.ok){
                		
				console.log("tua mamma");
				
				if (this.counter < 2){
					this.counter += 1;
					return await this.getJSON(url);
				}
				else{
				    this.counter = 0;
					throw new Error('Can\'t fetch json');
                }
        	}
        	return res.json();
        })
	}
}
