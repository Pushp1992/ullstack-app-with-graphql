const graphql = require("graphql");
const { books, authors } = require("../mocks/mock-data");

// destructuring graphql
const { 
    GraphQLObjectType, 
    GraphQLInt, 
    GraphQLString, 
    GraphQLSchema ,
    GraphQLList
} = graphql;

// This is a schema file which will be consumed by graphQLHTTP
// In order to create schema, we must have object, which will be consumed by GraphQLSchem1.

// 1. Create required object type(s)
// 2. Create RootQuery
// 3. Pass RootQuery to Schema
// 4. Export schema to reqired place

// 1. Creating schema Object type
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    genere: { type: GraphQLString },
    authorId: {type: GraphQLInt},
    author: { // nested data to get author for specific book
        type: AuthorType,
        resolve(parent, args) {
            return authors.find(author => author.id === parent.authorId)
        }
    }
  }),
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: { // nested data to get all booklist by a specific author
            type: GraphQLList(BookType),
            resolve(parent, args) {
                return books.filter(book => book.authorId === parent.id)
            }
        }
    })
});

// 2. Passing all the schema object to RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        // get data from Db based on query
        return books.find((book) => book.id === args.id);
      },
    },
    books: {
        type: GraphQLList(BookType),
        resolve: () => books
    },
    author: {
        type: AuthorType,
        args: {id: {type: GraphQLInt}},
        resolve(parent, args) {
            return authors.find(author => author.id === args.id);
        }
    },
    authors: {
        type: GraphQLList(AuthorType),
        resolve: () => authors
    }
  },
});

// 3. Pass the RootQuery to schema
const schema = new GraphQLSchema({
  query: RootQuery,
});

// 4. export the schema
module.exports = schema;
