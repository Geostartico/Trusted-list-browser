export class Fetcher{
	private times: number = 0;

	getJSON(url: string){

		fetch(url)
		.then(res => res.json())
		.then(response => {
		
			if(!response.ok){
				
				this.times += 1;
				
				if (this.times > 2)
					throw new Error(response.statusText);
				
				this.getJSON(url);

			}

			return response;
		
		})
	
	}

}
