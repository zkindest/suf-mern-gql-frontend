import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import storage from './utils/localStorage';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
});

const authLink = setContext(() => {
  const loggedUser = storage.loadUser();

  return {
    headers: {
      authorization: loggedUser ? loggedUser.token : null,
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Question: {
        fields: {
          upvotedBy: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          downvotedBy: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  link: authLink.concat(httpLink),
});

export default client;