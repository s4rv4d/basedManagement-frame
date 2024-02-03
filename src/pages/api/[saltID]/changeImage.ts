/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextApiRequest, NextApiResponse } from "next";
import { use } from "react";
import {
  fetchDataAndStore,
  getPreviousIndex,
  getNextIndex,
} from "src/Helpers/helpers";

import url from "url";

let postsArray = [];
// let currentIndex = 0;
let totalCount = 0;
let currentPost;
let userSalt = "";

let sessionMapping: { [key: string]: number } = {};
let isLatestMapping: { [key: string]: boolean } = {};
let isPopularMapping: { [key: string]: boolean } = {};

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

      const { pathname } = url.parse(req.url || "", true);
      userSalt = String(pathname?.split("/")[2]);

      if (!fid || !hash) {
        return res.status(400).send("Invalid message");
      }

      postsArray = await fetchDataAndStore();
      totalCount = postsArray.length;

      if (param1 === "start") {
        sessionMapping[userSalt] = 0;
        isLatestMapping[userSalt] = false;
        isPopularMapping[userSalt] = false;
      }

      // order checking
      if (isLatestMapping[userSalt]) {
        const reorderPosts = postsArray.sort((a, b) => b.id - a.id);

        postsArray = reorderPosts;
        totalCount = postsArray.length;
      } else if (isPopularMapping[userSalt]) {
        const reorderPosts = postsArray.sort(
          (a, b) => b.totalMints - a.totalMints
        );

        postsArray = reorderPosts;
        totalCount = postsArray.length;
      }

      if (buttonIndex === 1) {
        sessionMapping[userSalt] = getPreviousIndex(
          postsArray,
          sessionMapping[userSalt]
        );

        console.log(sessionMapping[userSalt]);
      } else if (buttonIndex === 2) {
        console.log("Prev");
        console.log(sessionMapping);

        sessionMapping[userSalt] = getNextIndex(
          postsArray,
          sessionMapping[userSalt]
        );

        console.log("next");
        console.log(sessionMapping[userSalt]);
      } else if (buttonIndex === 3) {
        isLatestMapping[userSalt] = true;
        isPopularMapping[userSalt] = false;

        const reorderPosts = postsArray.sort((a, b) => b.id - a.id);

        postsArray = reorderPosts;
        totalCount = postsArray.length;

        sessionMapping[userSalt] = 0;
      } else {
        console.log("last");
        isLatestMapping[userSalt] = false;
        isPopularMapping[userSalt] = true;

        const reorderPosts = postsArray.sort(
          (a, b) => b.totalMints - a.totalMints
        );

        postsArray = reorderPosts;
        totalCount = postsArray.length;

        sessionMapping[userSalt] = 0;
      }

      //   sessionMapping[userSalt] = currentIndex;

      console.log(userSalt);
      console.log(sessionMapping[userSalt]);

      currentPost = postsArray[sessionMapping[userSalt]];
      console.log(currentPost.id);

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
                }/api/${userSalt}/changeImage">
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
