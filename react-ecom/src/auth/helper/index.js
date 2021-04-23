import { API } from '../../backend';

import { cartEmpty } from '../../core/helper/cartHelper';


export const signup = (user) => {
  return fetch(`${API}user/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json()
    })
    .catch(err => console.log(err))
}



export const signin = (user) => {
  const formData = new FormData();

  for (const name in user) {
    console.log(user[name]);
    formData.append(name, user[name]);
  }

  return fetch(`${API}user/login/`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      console.log("SUCCESS", response);
      return response.json();
    })
    .catch((err) => console.log(err));
};


export const authenticate = (data, next) => {
  if (typeof window !== undefined) {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

// export const isAuthenticated = () => {
//   if (typeof window == undefined) {
//     return false;
//   }
//   if (localStorage.getItem("jwt")) {
//     let userData = JSON.parse(localStorage.getItem("jwt"))
//     // console.log(userData, userData.user.id)
//     getSession(userData.user.id)
//     .then((res) => {
//       // console.log(res)
//       if(res.token) {
//         console.log(res)
//         if(userData.token == res.token.session_token) {
//           return true
//         }
//         return false
//       } else {
//         return false
//       }
//     })
//     .catch(err => console.log(err))
//     // return JSON.parse(localStorage.getItem("jwt"));

//     //TODO: compare JWT with database json token
//   } else {
//     return false;
//   }
// };


export const isAuthenticated = () => {
  if (typeof window == undefined) {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    console.log('aaaa')
    return JSON.parse(localStorage.getItem("jwt"));
    //TODO: compare JWT with database json token
  } else {
    return false;
  }
};

export const signout = (next) => {
  const userId = isAuthenticated() && isAuthenticated().user.id;

  console.log("USERID: ", userId);

  if (typeof window !== undefined) {
    localStorage.removeItem("jwt");
    cartEmpty(() => { });
    //next();

    return fetch(`${API}user/logout/${userId}`, {
      method: "GET",
    })
      .then((response) => {
        console.log("Signout success");
        next();
      })
      .catch((err) => console.log(err));
  }
};

const getSession = (id) => {
  if (typeof window !== undefined) {

    return fetch(`${API}user/getSessionId/${id}`, {
      method: 'GET'
    })
      .then(response => {
        return response.json()
      })
      .catch(err => console.log(err))
  }
}