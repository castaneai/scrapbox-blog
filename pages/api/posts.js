import fetch from "isomorphic-unfetch";
import { parse } from "@progfay/scrapbox-parser";

const projectName = process.env.projectName;

export default async (req, res) => {
  const { title } = req.query;
  if (!title) {
    const apiRes = await fetch(`https://scrapbox.io/api/pages/${projectName}`);
    const pages = (await apiRes.json()).pages;
    res.status(200).json(pages);
    return;
  }
  const apiRes = await fetch(
    `https://scrapbox.io/api/pages/${projectName}/${encodeURIComponent(
      title
    )}/text`
  );
  const text = await apiRes.text();
  res.status(200).json(parse(text));
};
