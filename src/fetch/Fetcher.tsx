export class Fetcher{

	async getJSON (url: string) {
    
        if(!window.navigator.onLine)		//Returns the online status of the browser
            throw new Error("Not Connected!")

        let response = null;

        for (let i = 0; i < 3; i++){		//If there's any kind of error, the for loop tries to call fetch function up to three times

	        await fetch(url)		//Fetches the JSON file
	        .then(res => {

                if(!res.ok) {
                    if(i !== 2)
                        return null;
                    throw new Error("Something Went Wrong during Fetch");
                }

	            return res.json();		//If there's no error json() function extracts only the body of JSON file	
            }).then(res => {
                response = res;
            }).catch(err => { 
                if (i === 2)
                    throw err;
            });

            if(response !== null)		//Returns JSON file
                return response;
        }

    }
}
