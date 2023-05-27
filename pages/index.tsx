import {
  collection,
  where,
  getDocs,
  limit,
  query,
  getCountFromServer,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BlogCard from "../components/BlogCard";
import Categories from "../components/Categories";
import { Firebase } from "../firebase/firebase";
import { BlogType } from "../types/BlogType";
import { getAllDocuments } from "../utils/getAllDocuments";
import Search from "../components/Search";

const Home = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [category, setCategory] = useState("");
  // const lim = useRef(1);
  // const count = useRef(0);

  // console.log("limit", lim.current)
  // console.log("count", count.current)

  const getBlogs = async () => {
    const blogsCollectionRef = collection(Firebase.db, "blogs");

    console.log(Firebase.auth)

    try {
      let q;
      if (category === "") {
        q = query(blogsCollectionRef);
      } else {
        q = query(blogsCollectionRef, where("category", "==", category));
      }

      const snapshot = await getDocs(q);
      // count.current = (await getCountFromServer(q)).data().count;

      if (snapshot.docs.length > 0) {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // const tempBlogs = [...blogs, ...data]
        setBlogs(data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.log("Error fetching documents:", error);
      return [];
    }
  };

  useEffect(() => {
    getBlogs();
  }, [getBlogs, category]);

  return (
    <div className="flex justify-between mx-32 my-8 gap-16">
      <div className="flex flex-col flex-grow ">
      <Search/>
        {/* <InfiniteScroll
          dataLength={count.current}
          next={getBlogs}
          hasMore={count < blogs?.length}
          loader={<h4>Loading...</h4>} 
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>
          &#8595; Pull down to refresh
          </h3>
          }
          releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
          }
        > */}
        {blogs.map((blog: BlogType, ind) => (
          <BlogCard blog={blog} key={ind}/>
        ))}
        {blogs.length === 0 && (
          <div className="text-3xl text-center mt-8 flex-grow font-light">
            No Blogs Found.
          </div>
        )}
        {/* </InfiniteScroll> */}
      </div>
      <div>
        <Categories category={category} setCategory={setCategory} />
      </div>
    </div>
  );
};

export default Home;
