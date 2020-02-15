import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { apiUrl } from "../util";
import moment from "moment";

const Index = props => (
  <div>
    <h1>{process.env.projectName}</h1>
    <ul>
      {props.posts
        .filter(post => post.pin === 0)
        .map(post => (
          <li key={post.id}>
            <span>{moment.unix(post.created).format("YYYY/MM/DD")}</span>
            <Link href="/[title]" as={`/${post.title}`}>
              <a>{post.title}</a>
            </Link>
          </li>
        ))}
    </ul>
  </div>
);

Index.getInitialProps = async ctx => {
  const res = await fetch(apiUrl(`/api/posts`, ctx?.req));
  const pages = await res.json();
  return {
    posts: pages
  };
};

export default Index;
