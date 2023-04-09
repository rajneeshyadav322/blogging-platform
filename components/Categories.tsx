import { collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Firebase } from "../firebase/firebase";
import { CategoryType } from "../types/CategoryType";
import { getAllDocuments } from "../utils/getAllDocuments";

const Categories = ({ category, setCategory }) => {
  const categoriesCollectionRef = collection(Firebase.db, "category");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  useEffect(() => {
    (async function () {
      const data = await getAllDocuments(categoriesCollectionRef);
      setCategories(data);
    })();
  }, []);

  return (
    <div className="w-48">
      <div className="text-2xl font-light">Categories</div>
      <div>
        {categories.map((item) => (
          <div
            className="bg-[#efefef] px-4 py-2 w-fit cursor-pointer rounded-lg my-2"
            onClick={() => setCategory(category === item.name ? "" : item.name)}
            style={{
              background: category === item.name ? "violet" : "",
              color: category === item.name ? "white" : ""
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
