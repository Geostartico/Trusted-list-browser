export class Fetcher{

	async getJSON (url: string) {
    
        if(!window.navigator.onLine)
            throw new Error("Not Connected")

        let response = null;

        for (let i = 0; i < 3; i++){

	        await fetch(url)
	        .then(res => {

                if(!res.ok) {
                    if(i !== 2)
                        return null;
                    throw new Error("Something Went Wrong during Fetch");
                }


	            return res.json();
            }).then(res => {
                response = res;
            }).catch(err => { 
                if (i == 2)
                    throw err;
            });

            if(response !== null)
                return response;
        }

    }
}
