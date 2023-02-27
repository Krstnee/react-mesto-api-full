class Authorization {
   constructor({url, token}) {
      this._url = url;
      this.token = token;
   }
   
   _getResponse(res) {
      if(!res.ok) {
        return Promise.reject(`Ошибка загрузки данных: ${res.status}`);
      };
      return res.json();
      }

   register(data) {
      return fetch(`${this._url}/signup`, {
         method: 'POST',
         credentials: 'include',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            "password": data.password,
            "email": data.email
         })
      })
      .then(res => this._getResponse(res));
   }

   authorize(data) {
   return fetch(`${this._url}/signin`, {
      method: 'POST',
      credentials: 'include',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
      },
      
      body: JSON.stringify({
         "password": data.password,
         "email": data.email
      })
      })
      .then(res => this._getResponse(res));
   }

   getContent(jwt) {
      return fetch(`${this._url}/users/me`, {
         method: 'GET',
         credentials: 'include',
         headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${jwt}`
         }
         })
         .then(res => this._getResponse(res));
   }
   
   logout() {
      return fetch(`${this._url}/signout`, {
         method: 'POST',
         credentials: 'include',
         headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
         }
         })
         .then(res => this._getResponse(res));
   }
}

export default new Authorization({
   url: 'https://krstne.nomoredomains.club',
});