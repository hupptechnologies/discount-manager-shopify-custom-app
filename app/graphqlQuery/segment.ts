export const GET_SEGMENTS_QUERY = `
query getSegments {
    segments(first: 100) {
      edges {
        node {
          id
          query
          name
          creationDate
          lastEditDate
        }
      }
    }
}`;