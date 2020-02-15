import fetch from "isomorphic-unfetch";
import { parse } from "@progfay/scrapbox-parser";

const projectName = process.env.projectName;

export default async (req, res) => {
  const { title } = req.query;
  const uriBase = `https://scrapbox.io/api/pages/${projectName}`;
  if (!title) {
    const apiRes = await fetch(`${uriBase}?sort=created`);
    const pages = (await apiRes.json()).pages.filter(page => page.pin === 0);
    res.status(200).json(pages);
    return;
  }
  const pageRes = await fetch(`${uriBase}/${encodeURIComponent(title)}`);
  const pageData = await pageRes.json();
  if (!pageData.persistent) {
    // page not found
    res.status(200).json([{ type: "title", text: title }]);
    return;
  }
  const textRes = await fetch(`${uriBase}/${encodeURIComponent(title)}/text`);
  const text = await textRes.text();
  res.status(200).json(parse(text));
};
