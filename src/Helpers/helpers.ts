import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

async function getBMNFTs() {
  const client = new ApolloClient({
    uri: "https://hub.uplink.wtf/api/graphql",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query mintBoard($spaceName: String!) {
        mintBoard(spaceName: $spaceName) {
          id
          referrer
          posts {
            id
            created
            totalMints
            author {
              id
              address
              userName
              displayName
              profileAvatar
            }
            edition {
              id
              chainId
              contractAddress
              name
              symbol
              editionSize
              royaltyBPS
              fundsRecipient
              defaultAdmin
              saleConfig {
                publicSalePrice
                maxSalePurchasePerAddress
                publicSaleStart
                publicSaleEnd
                presaleStart
                presaleEnd
                presaleMerkleRoot
              }
              description
              animationURI
              imageURI
              referrer
            }
          }
        }
      }
    `,
    variables: {
      spaceName: "basedmanagement",
    },
  });

  return data;
}

async function fetchDataAndStore() {
  try {
    const data = await getBMNFTs(); // Call your function
    // postsArray = data.mintBoard.posts.reverse();
    const posts = [...data.mintBoard.posts]; // Create a shallow copy of the posts array
    return posts; // Extract and store the posts
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function findIndexWithHighestTotalMints(postsArray) {
  if (!Array.isArray(postsArray) || postsArray.length === 0) {
    return -1; // return -1 if the data is not an array or is empty
  }

  let maxMints = 0;
  let indexWithMaxMints = -1;

  for (let i = 0; i < postsArray.length; i++) {
    const totalMints = parseInt(postsArray[i].totalMints, 10);
    if (totalMints > maxMints) {
      maxMints = totalMints;
      indexWithMaxMints = i;
    }
  }

  return indexWithMaxMints;
}

function getNextIndex(postsArray, currentIndex) {
  if (!Array.isArray(postsArray) || postsArray.length === 0) {
    return -1; // return -1 if the array is not valid or is empty
  }

  // Check if currentIndex is valid
  if (currentIndex < 0 || currentIndex >= postsArray.length) {
    return 0;
  }

  const nextIndex = currentIndex + 1;

  // Check if nextIndex exceeds the array length
  if (nextIndex >= postsArray.length) {
    return 0; // or return 0 to loop back to the first element
  }

  return nextIndex;
}

function getPreviousIndex(postsArray, currentIndex) {
  if (!Array.isArray(postsArray) || postsArray.length === 0) {
    return -1; // return -1 if the array is not valid or is empty
  }

  // Check if currentIndex is valid
  if (currentIndex < 0 || currentIndex >= postsArray.length) {
    return postsArray.length - 1;
  }

  const previousIndex = currentIndex - 1;

  // Check if previousIndex is before the start of the array
  if (previousIndex < 0) {
    return 0; // or return array.length - 1 to loop back to the last element
  }

  return previousIndex;
}

export {
  getBMNFTs,
  getNextIndex,
  getPreviousIndex,
  fetchDataAndStore,
  findIndexWithHighestTotalMints,
};
