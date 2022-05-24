export class Fetcher{
	
	getJSON(url: string){

		fetch(url)
		.then(res => res.json())
		.then(response => {
		
			if(!response.ok){
				throw new Error(response.statusText)
			}

			return response;
		
		})
	
	}

}
