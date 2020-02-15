import fetch from "isomorphic-unfetch";
import Link from "next/link";
import { apiUrl } from "../../util";

function randomKey() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 16);
}

const parseNode = node => {
  const key = randomKey();
  switch (node.type) {
    case "plain":
      return <span key={key}>{node.text}</span>;
    case "link":
      return (
        <a key={key} href={node.href}>
          {node.href}
        </a>
      );
    case "quote":
      return <blockquote key={key}>{node.nodes.map(parseNode)}</blockquote>;
    case "strong":
    case "decoration":
      return (
        <span key={key}>
          <strong>{node.nodes.map(parseNode)}</strong>
        </span>
      );
    case "image":
      return <img key={key} src={node.src} style={{ maxWidth: "400px" }} />;
    case "hashTag":
      return (
        <Link key={key} href="/[title]" as={`/${node.href}`}>
          <a>{node.href}</a>
        </Link>
      );
    case "code":
      return <code key={key}>{node.text}</code>;
    case "icon":
      return <img key={key} width="16" height="16" />;
    default:
      return (
        <span key={key}>
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
  return { data };
};

export default Post;
