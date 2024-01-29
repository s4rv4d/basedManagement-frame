import sharp from "sharp";
import satori from "satori";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let param2 = req.query.param2;
  param2 = String(param2).replace("ipfs://", "https://ipfs.io/ipfs/");

  try {
    const svg = await satori(
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "f4f4f4",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 20,
          }}
        >
          <h2 style={{ textAlign: "center", color: "lightgray" }}>
            <img
              src={param2}
              alt="logo"
              width="100%"
              height="400"
              style={{ objectFit: "cover" }}
            />
          </h2>
        </div>
      </div>,
      {
        width: 600,
        height: 400,
        fonts: [],
      }
    );

    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

    // Set the content type to PNG and send the response
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "max-age=10");
    res.send(pngBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
}
