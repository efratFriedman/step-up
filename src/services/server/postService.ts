// import { cookies } from "next/headers";
// import { getBaseUrl } from "@/utils/baseUrl";

// export const getPostById = async (id: string) => {
//   const cookieStore = cookies();

//   const res = await fetch(
//     `${getBaseUrl()}/api/posts/${id}`,
//     {
//       cache: "no-store",
//       headers: {
//         Cookie: cookieStore.toString(),
//       },
//     }
//   );

//   if (!res.ok) return null;

//   const data = await res.json();
//   return data.post;
// };

import { dbConnect } from "@/lib/DB";
import Post from "@/models/Post";
import { IPost } from "@/interfaces/IPost";

export const getPostById = async (id: string): Promise<IPost | null> => {
  await dbConnect();

  const post = await Post.findById(id)
  .populate("userId")
  .lean<IPost>();

    return post as IPost;
};

