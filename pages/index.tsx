import { collection, getDocs, limit, query } from "firebase/firestore";
import { NextPage } from "next";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BlogCard from "../components/BlogCard";
import { Firebase } from "../firebase/firebase";
import { BlogType } from "../types/BlogType";

const Home: NextPage = () => {
  const blogsCollectionRef = collection(Firebase.db, "blogs");
  const [blogs, setBlogs] = useState<any>();
  const [count, setCount] = useState(1);

  // useEffect(() => {
  const getAllBlogs = async () => {
    const q = query(blogsCollectionRef, limit(count));
    const data = await getDocs(q);
    const res = data.docs.map((item) => ({ ...item.data(), id: item.id }));
    console.log(res)
  };
  
  const getBlogs = async () => {
    console.log("asdasdnasndasjnd")
    setCount(prev=> prev+1)
    await getAllBlogs()
  }

  // getAllBlogs();
  // }, []);

  console.log(count);

  return (
    <div className="flex flex-col items-center my-8">
      <InfiniteScroll
        dataLength={100} //This is important field to render the next data
        next={getBlogs}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        // endMessage={
        //   <p style={{ textAlign: "center" }}>
        //     <b>Yay! You have seen it all</b>
        //   </p>
        // }
        // below props only if you need pull down functionality
        // refreshFunction={this.refresh}
        // pullDownToRefresh
        // pullDownToRefreshThreshold={50}
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        // }
      >
        {blogs?.map((blog: BlogType) => (
          <BlogCard blog={blog} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Home;
