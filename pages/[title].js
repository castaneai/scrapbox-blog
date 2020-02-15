import fetch from "isomorphic-unfetch";
import Link from "next/link";
import { apiUrl } from "../util";

function randomKey() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 16);
}

const parseNode = node => {
  switch (node.type) {
    case "plain":
      return <span key={randomKey()}>{node.text}</span>;
    case "link":
      return (
        <a key={randomKey()} href={node.href}>
          {node.href}
        </a>
      );
    case "image":
      return (
        <img key={randomKey()} src={node.src} style={{ maxWidth: "400px" }} />
      );

    case "hashTag":
      return (
        <Link href="/[title]" as={`/${node.href}`}>
          <a>{node.href}</a>
        </Link>
      );
    default:
      return (
        <span key={randomKey()}>
          unknown node: <code>{JSON.stringify(node)}</code>
        </span>
      );
  }
};

const Post = props => (
  <>
    {props.data.map(line => {
      switch (line.type) {
        case "title":
          return <h1 key={randomKey()}>{line.text}</h1>;
        case "line":
          return <p key={randomKey()}>{line.nodes.map(parseNode)}</p>;
      }
    })}
  </>
);

Post.getInitialProps = async ctx => {
  const { title } = ctx.query;
  const res = await fetch(
    apiUrl(`/api/posts?title=${encodeURIComponent(title)}`, ctx.req)
  );
  const data = await res.json();

  console.log(`fetched page: ${title}`);
  return { data };
};

export default Post;
