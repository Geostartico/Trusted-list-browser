export class Fetcher{
	
	

	async getJSON (url: string) {

	return await fetch(url)
	.then(res => {

			if(!res.ok)
                throw new Error('Can\'t fetch json');
                
        	}
        	res.json();
        }).catch(error => {
            return await this.fetch(url)
        });
	}
}
