import { collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Firebase } from "../firebase/firebase";
import { CategoryType } from "../types/CategoryType";
import { getAllDocuments } from "../utils/getAllDocuments";

type categoriesPropsType = {
  category: any,
  setCategory: any,
}

const Categories = ({setCategory, category}: categoriesPropsType) => {
  const categoriesCollectionRef = collection(Firebase.db, "category");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  useEffect(() => {
    (async function () {
      const data = await getAllDocuments(categoriesCollectionRef);
      setCategories(data);
    })();
  }, [categoriesCollectionRef]);

  return (
    <div className="w-48">
      <div className="text-2xl font-light">Categories</div>
      <div>
        {categories.map((item, ind) => (
          <div
            key={ind}
            className="bg-secondary px-4 py-2 w-fit cursor-pointer rounded-lg my-2"
            onClick={() => setCategory(category === item.name ? "" : item.name)}
            style={{
              background: category === item.name ? "#6D5D6E" : "",
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
