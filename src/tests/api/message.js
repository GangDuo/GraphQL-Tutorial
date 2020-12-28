import axios from 'axios';
 
const API_URL = 'http://localhost:8000/graphql';

export const createMessage = async (variables, token) =>
  axios.post(
    API_URL,
    {
      query: `
        mutation ($text: String!) {
          createMessage (text: $text) {
            text
          }
        }      
      `,
      variables,
    },
    {
      headers: {
        'x-token': token,
      },
    },
  );