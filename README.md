# movie-api
This is the backend API for the myFlix application, a movie directory website.

## Getting Started with Postman
In order to get started, one must make a POST request in order to add a new user to the database at the following endpoint: https://the-greatest.herokuapp.com/users
Next, one must log in using a POST request to the following endpoint: https://the-greatest.herokuapp.com/login 
Upon successful log in, copy the token created in the JSON response like shown below:

`"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYXZvcml0ZU1vdmllIjpbXSwiX2lkIjoiNjAzZWY0ZDczNjQ5MTMwMDE3M2YxNGQ4IiwidXNlcm5hbWUiOiJ0cmFjeW1jZ3JhZHkiLCJwYXNzd29yZCI6IiQyYiQxMCRFYnpwTlB2bW9GYTJxNkVmcTZxOGZPd2dnTWc3VEJ5aUlsc1Awc2xuTnIzN2dva1ZNTmQzYSIsImVtYWlsIjoidHJhY3ltY2dyYWR5QGdtYWlsLmNvbSIsIl9fdiI6MCwiaWF0IjoxNjE0NzM5MjYzLCJleHAiOjE2MTUzNDQwNjMsInN1YiI6InRyYWN5bWNncmFkeSJ9.vXw71Zp3bDw13SYU0ZgB51OVn_SSRPc3dBmGK5OVRI0" `

Now, go to the auth tab in postman.  Select the "Bearer Token" option under "type" and paste the token into the input field as shown below: 

![Token Snip](/public/Snip3_bearerToken.PNG)

Other api requests involving movies and users will require a bearer token. Make sure you have a token pasted into the above mentioned field. Otherwise, a 401 status error will prevent you from successfully making an api call.  A 401 status error signifies you are not authorized to access the endpoint.

Available movies and endpoints:

- Movies (Examples)
  - GET Request: https://the-greatest.herokuapp.com/movies - Get all movies
  - GET Request: https://the-greatest.herokuapp.com/movies/:Title - Get movie by title (i.e. The%20Waterboy)
  (i.e. https://the-greatest.herokuapp.com/movies/The%20Waterboy)
  - GET Request: https://the-greatest.herokuapp.com/movies/Genres/:Name - Get movie genre by name (i.e. Western)
  - GET Request: https://the-greatest.herokuapp.com/movies/Directors/:Name - Get director by name 
  (i.e. https://the-greatest.herokuapp.com/movies/Directors/Quentin%20Tarantino)

- Users (Examples)
  - GET Request: https://the-greatest.herokuapp.com/users - Get all users
  - GET Request: https://the-greatest.herokuapp.com/users/:username - Get user by username (i.e. tracymcgrady)
  - PUT Request: https://the-greatest.herokuapp.com/users/:username - Edit user information by username (i.e. tracymcgrady)
  - PUT Request: https://the-greatest.herokuapp.com/users/:username/movies/:movieID - Add movie to user's list of favorite movies 
  (i.e. https://the-greatest.herokuapp.com/users/tracymcgrady/movies/5f9775aa4f731ed4350df25d)
  - DELETE Request: https://the-greatest.herokuapp.com/users/:username/movies/:movieID - Delete movie from user's list of favorite movies
  (i.e. https://the-greatest.herokuapp.com/users/tracymcgrady/movies/5f97812701d0ee8d4abfed9f)
  - DELETE Request: https://the-greatest.herokuapp.com/users/:username - Delete a user from the database (a.k.a. deregister)
