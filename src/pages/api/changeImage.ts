/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { NextApiRequest, NextApiResponse } from "next";
import {
  fetchDataAndStore,
  getPreviousIndex,
  findIndexWithHighestTotalMints,
  getNextIndex,
} from "src/Helpers/helpers.ts";

let postsArray = [];
let currentIndex = 0;
let totalCount = 0;
let currentPost;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const fid = req.body?.untrustedData?.fid;
      const { hash } = req.body?.untrustedData.castId;
      const buttonIndex = req.body.untrustedData.buttonIndex;
      const param1 = req.query.param1;

      console.log({ fid, hash });

      if (!fid || !hash) {
        return res.status(400).send("Invalid message");
      }

      postsArray = await fetchDataAndStore();
      totalCount = postsArray.length;

      if (buttonIndex === 1) {
        currentIndex = getPreviousIndex(postsArray, currentIndex);
      } else if (buttonIndex === 2) {
        currentIndex = getNextIndex(postsArray, currentIndex);
      } else if (buttonIndex === 3) {
        currentIndex = totalCount - 1;
      } else if (param1 === "start") {
        currentIndex = 0;
      } else {
        currentIndex = findIndexWithHighestTotalMints(postsArray);
      }

      currentPost = postsArray[currentIndex];

      return res.status(200).send(`
              <!DOCTYPE html>
              <html>
              <head>
                  <meta name="fc:frame" content="vNext"/>
                  <meta name="fc:frame:image" content="${
                    process.env.HOST
                  }/api/renderImage?param1=${currentPost.id}&param2=${String(
        currentPost.edition.imageURI
      )}"/>
                <meta name="fc:frame:button:1" content="⬅️">
                <meta name="fc:frame:button:2" content="➡️">
                <meta name="fc:frame:button:3" content="Latest">
                <meta name="fc:frame:button:4" content="Popular">
                <meta name="fc:frame:post_url" content="${
                  process.env.HOST
                }/api/changeImage">
              </head>
              </html>
            `);
    } catch (e: unknown) {
      // @ts-expect-error
      return res.status(400).send(`Failed to validate message: ${e.message}`);
    }
  } else {
    return res.status(400).send("Invalid method");
  }
}
