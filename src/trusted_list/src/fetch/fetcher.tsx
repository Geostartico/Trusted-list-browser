export class Fetcher{
	
	

	async getJSON (url: string) {
    
    for (let i = 0; i < 3; i++){
	    return await fetch(url)
	    .then(res => {

			    if(!res.ok)
                    console.log('Error fetching JSON');
            	else
            	    res.json();
            });
        }
	}
}
