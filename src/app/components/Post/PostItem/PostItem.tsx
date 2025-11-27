import { IPost } from "@/interfaces/IPost";

export default function PostItem({ post }: { post: IPost }) {
  return (
    <div>
      <p>{post.content}</p>

      {post.media?.map((item, index) =>
        item.type === "video" ? (
          <video key={index} src={item.url} controls style={{ width: "200px" }} />
        ) : (
          <img key={index} src={item.url} style={{ width: "200px" }} />
        )
      )}
    </div>
  );
}
