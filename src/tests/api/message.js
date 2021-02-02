import axios from 'axios';
import WebSocket from 'ws';
import fetch from 'cross-fetch';
import { split, HttpLink, ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
 
class SubscriptionClient {
  constructor({uri, ...others}) {
    const httpLink = new HttpLink({
      uri: 'http://localhost:8000/graphql',
      fetch,
      headers: {
        //authorization: `Bearer xxxxx`
      }
    });
  
    const wsLink = new WebSocketLink({
      uri: "ws://localhost:8000/graphql",
      options: {
        reconnect: true,
        lazy: true,
      },
      webSocketImpl: WebSocket,
    });
    this.wsLink = wsLink;
  
    const link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink,
    );
  
    this.apollo = new ApolloClient({
      link,
      cache: new InMemoryCache()
    });  
  }

  subscribe({query}) {
    return this.apollo.subscribe({ query })
  }

  clean() {
    this.apollo.stop();
    this.wsLink.subscriptionClient.close()
  }
}


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

export const subscribeToNewMessage = (variables) => {
  const client = new SubscriptionClient({url: ''});
  return new Promise(async (resolve, reject) => {
    const sub = client.subscribe({
        query: gql`
        subscription {
          messageCreated {
            message {
                text
            }
          }
        }
        `,
        })
      .subscribe(
        v => {
          sub.unsubscribe()
          client.clean()
          resolve(v)
        },
        e => reject(e),
      );
  })
};
